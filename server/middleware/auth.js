import jwt from "jsonwebtoken";
import User from "../models/User.js";

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization");

    // Check if no token
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided, authorization denied",
      });
    }

    // Extract token (remove 'Bearer ' prefix)
    const actualToken = token.slice(7);

    try {
      // Verify token
      const decoded = jwt.verify(actualToken, JWT_SECRET);

      // Check if user still exists and is active
      const user = await User.findById(decoded.user.id).select("-password");
      if (!user) {
        return res.status(401).json({
          message: "Token is valid but user not found",
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          message: "Account has been deactivated",
        });
      }

      // Check if subscription is active (except for certain routes)
      if (!user.isSubscriptionActive() && !isExemptRoute(req.path)) {
        return res.status(403).json({
          message: "Subscription expired. Please renew your subscription to continue.",
          subscriptionStatus: user.subscriptionStatus,
          subscriptionEndDate: user.subscriptionEndDate,
        });
      }

      // Add user to request
      req.user = decoded.user;
      req.userDetails = user;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({
        message: "Token is not valid",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      message: "Server error in authentication",
    });
  }
};

// Routes that don't require active subscription
const exemptRoutes = [
  "/api/auth/me",
  "/api/auth/logout",
  "/api/auth/change-password",
  "/api/subscription",
  "/api/payment",
];

const isExemptRoute = (path) => {
  return exemptRoutes.some(route => path.startsWith(route));
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
      return next(); // Continue without user info
    }

    const actualToken = token.slice(7);

    try {
      const decoded = jwt.verify(actualToken, JWT_SECRET);
      const user = await User.findById(decoded.user.id).select("-password");

      if (user && user.isActive) {
        req.user = decoded.user;
        req.userDetails = user;
      }
    } catch (error) {
      // Token invalid, but continue without auth
      console.log("Optional auth failed:", error.message);
    }

    next();
  } catch (error) {
    next(); // Continue on any error
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

// Subscription check middleware
const checkSubscription = (requiredFeatures = []) => {
  return (req, res, next) => {
    if (!req.userDetails) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const user = req.userDetails;

    // Check if subscription is active
    if (!user.isSubscriptionActive()) {
      return res.status(403).json({
        message: "Subscription expired or inactive",
        subscriptionStatus: user.subscriptionStatus,
        subscriptionEndDate: user.subscriptionEndDate,
      });
    }

    // Check if user has required features
    for (const feature of requiredFeatures) {
      if (!user.features[feature]) {
        return res.status(403).json({
          message: `This feature (${feature}) is not available in your current plan`,
          currentPlan: user.subscriptionPlan,
          availableFeatures: Object.keys(user.features).filter(
            key => user.features[key]
          ),
        });
      }
    }

    next();
  };
};

// Employee limit check middleware
const checkEmployeeLimit = async (req, res, next) => {
  try {
    if (!req.userDetails) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // For POST requests (adding new employees), check the limit
    if (req.method === "POST") {
      const Employee = (await import("../models/Employee.js")).default;
      const currentCount = await Employee.countDocuments({
        // Assuming employees are linked to the user/company
        // Adjust this based on your Employee model structure
      });

      if (!req.userDetails.canAddEmployee(currentCount)) {
        return res.status(403).json({
          message: `Employee limit reached. Current limit: ${req.userDetails.employeeLimit}`,
          currentCount,
          limit: req.userDetails.employeeLimit,
          suggestion: "Upgrade your plan to add more employees",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Employee limit check error:", error);
    res.status(500).json({
      message: "Error checking employee limit",
    });
  }
};

// Rate limiting middleware (basic implementation)
const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const key = req.ip + (req.user ? req.user.id : "");
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [k, v] of requests.entries()) {
      if (v.timestamp < windowStart) {
        requests.delete(k);
      }
    }

    // Check current user's requests
    const userRequests = Array.from(requests.entries())
      .filter(([k]) => k.startsWith(key))
      .length;

    if (userRequests >= maxRequests) {
      return res.status(429).json({
        message: "Too many requests. Please try again later.",
        retryAfter: Math.ceil(windowMs / 1000),
      });
    }

    // Record this request
    requests.set(key + now, { timestamp: now });

    next();
  };
};

export {
  auth as default,
  optionalAuth,
  authorize,
  checkSubscription,
  checkEmployeeLimit,
  rateLimit,
};