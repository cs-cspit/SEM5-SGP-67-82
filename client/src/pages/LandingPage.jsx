import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Users,
  BarChart3,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Calendar,
  FileText,
  TrendingUp,
  Building2,
} from "lucide-react";
import AuthModal from "../components/AuthModal";
import "./LandingPage.css";

const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'
  const [isYearly, setIsYearly] = useState(false); // pricing toggle state
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setAuthMode("signup");
    setIsAuthModalOpen(true);
  };

  const handleSignIn = () => {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  };

  const features = [
    {
      icon: Clock,
      title: "Smart Attendance Tracking",
      description:
        "Real-time attendance monitoring with multiple check-in methods including QR codes, GPS, and manual entry.",
    },
    {
      icon: Users,
      title: "Employee Management",
      description:
        "Comprehensive employee directory with detailed profiles, department management, and role-based access control.",
    },
    {
      icon: Calendar,
      title: "Leave Management",
      description:
        "Streamlined leave application process with approval workflows, leave balance tracking, and calendar integration.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Detailed reports and insights on attendance patterns, productivity metrics, and workforce analytics.",
    },
    {
      icon: FileText,
      title: "Automated Payroll",
      description:
        "Accurate salary calculations based on attendance, overtime, and leave data with automated report generation.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description:
        "Enterprise-grade security with data encryption, audit trails, and compliance with labor regulations.",
    },
  ];

  const perks = [
    {
      icon: Zap,
      title: "Increase Productivity",
      description: "Boost team efficiency by 40% with automated processes",
    },
    {
      icon: TrendingUp,
      title: "Reduce Admin Work",
      description: "Save 15+ hours weekly on manual attendance tracking",
    },
    {
      icon: CheckCircle,
      title: "Easy Integration",
      description: "Seamlessly integrate with existing HR and payroll systems",
    },
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-container">
          <div className="logo-section">
            <div className="logo-icon">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <span className="logo-text">EmployeeHub</span>
          </div>
          <nav className="header-nav">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#pricing" className="nav-link">
              Pricing
            </a>
            <a href="#about" className="nav-link">
              About
            </a>
            <button onClick={handleSignIn} className="signin-btn">
              Sign In
            </button>
            <button onClick={handleGetStarted} className="get-started-btn">
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Revolutionize Your
              <span className="gradient-text"> Employee Management</span>
            </h1>
            <p className="hero-description">
              Streamline attendance tracking, manage leaves, and automate
              payroll with our comprehensive employee management solution. Built
              for modern businesses that value efficiency and accuracy.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Happy Employees</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Companies Trust Us</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime Guarantee</div>
              </div>
            </div>
            <div className="hero-actions">
              <button onClick={handleGetStarted} className="cta-primary">
                Start Free Trial
                <ArrowRight className="cta-icon" />
              </button>
              <button className="cta-secondary">
                Watch Demo
                <span className="demo-duration">(2 min)</span>
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="dashboard-preview">
              <div className="preview-header">
                <div className="preview-dots">
                  <div className="dot red"></div>
                  <div className="dot yellow"></div>
                  <div className="dot green"></div>
                </div>
                <span className="preview-title">Employee Dashboard</span>
              </div>
              <div className="preview-content">
                <div className="preview-card">
                  <div className="card-icon">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="card-content">
                    <div className="card-title">Total Employees</div>
                    <div className="card-value">1,247</div>
                  </div>
                </div>
                <div className="preview-card">
                  <div className="card-icon">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="card-content">
                    <div className="card-title">Present Today</div>
                    <div className="card-value">1,189</div>
                  </div>
                </div>
                <div className="preview-chart">
                  <div className="chart-title">Attendance Trend</div>
                  <div className="chart-bars">
                    <div className="chart-bar" style={{ height: "60%" }}></div>
                    <div className="chart-bar" style={{ height: "80%" }}></div>
                    <div className="chart-bar" style={{ height: "95%" }}></div>
                    <div className="chart-bar" style={{ height: "75%" }}></div>
                    <div className="chart-bar" style={{ height: "90%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              Manage
              <span className="gradient-text">Workforce</span>
            </h2>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="perks-section">
        <div className="section-container">
          <div className="perks-content">
            <div className="perks-text">
              <h5 className="perks-title">
                Why Choose Our
                <span className="gradient-text"> ERP ?</span>
              </h5>
              <p className="perks-description">
                Join thousands of companies that have transformed their HR
                operations with our powerful, user-friendly platform.
              </p>
              <div className="perks-grid">
                {perks.map((perk, index) => (
                  <div key={index} className="perk-item">
                    <div className="perk-icon">
                      <perk.icon className="w-6 h-6" />
                    </div>
                    <div className="perk-content">
                      <h4 className="perk-title">{perk.title}</h4>
                      <p className="perk-description">{perk.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="perks-visual">
              <div className="stats-card">
                <h3 className="stats-title">Platform Statistics</h3>
                <div className="stats-list">
                  <div className="stats-item">
                    <span className="stats-label">Time Saved</span>
                    <span className="stats-value">15+ hrs/week</span>
                  </div>
                  <div className="stats-item">
                    <span className="stats-label">Accuracy Increase</span>
                    <span className="stats-value">99.8%</span>
                  </div>
                  <div className="stats-item">
                    <span className="stats-label">Cost Reduction</span>
                    <span className="stats-value">35%</span>
                  </div>
                  <div className="stats-item">
                    <span className="stats-label">Employee Satisfaction</span>
                    <span className="stats-value">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title pricing-title">
              Transparent
              <span className="gradient-text"> Pricing</span>
            </h2>
          </div>

          <div className="pricing-toggle">
            <span className={`toggle-label ${!isYearly ? "active" : ""}`}>
              Monthly
            </span>
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="pricing-toggle"
                checked={isYearly}
                onChange={(e) => setIsYearly(e.target.checked)}
              />
              <label htmlFor="pricing-toggle" className="toggle-slider"></label>
            </div>
            <span className={`toggle-label ${isYearly ? "active" : ""}`}>
              Yearly
              <span className="toggle-badge">Save 20%</span>
            </span>
          </div>

          <div className="pricing-cards">
            {/* Monthly Plan */}
            <div
              className={`pricing-card monthly ${
                !isYearly ? "highlighted" : ""
              }`}
            >
              <div className="card-header">
                <h3 className="plan-name">Monthly Plan</h3>
                <div className="plan-price">
                  <span className="currency">₹</span>
                  <span className="amount">{isYearly ? "199" : "299"}</span>
                  <span className="period">
                    {isYearly ? "/month" : "/month"}
                  </span>
                </div>
                {isYearly && (
                  <div className="savings-badge">Billed Annually</div>
                )}
                <p className="plan-description">
                  Perfect for small to medium businesses
                </p>
              </div>
              <div className="card-features">
                <div className="feature-item">
                  <CheckCircle className="feature-check" />
                  <span>Up to 100 employees</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="feature-check" />
                  <span>Real-time attendance tracking</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="feature-check" />
                  <span>Leave management system</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="feature-check" />
                  <span>Basic reporting & analytics</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="feature-check" />
                  <span>Email support</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="feature-check" />
                  <span>Mobile app access</span>
                </div>
              </div>
              <button onClick={handleGetStarted} className="plan-cta">
                Start {isYearly ? "Annual" : "Monthly"} Plan
              </button>
            </div>

            {/* Yearly Plan */}
            <div
              className={`pricing-card yearly ${
                isYearly ? "highlighted popular" : "popular"
              }`}
            >
              <div className="popular-badge">Most Popular</div>
              <div className="card-header">
                <h3 className="plan-name">Yearly Plan</h3>
                <div className="plan-price">
                  <span className="currency">₹</span>
                  <span className="amount">{isYearly ? "2,399" : "199"}</span>
                  <span className="period">
                    {isYearly ? "/year" : "/month"}
                  </span>
                </div>
                <div className="savings-badge">Save ₹1,189 (20% off)</div>
                <p className="plan-description">
                  Best value for growing companies
                </p>
              </div>
              <div className="card-features">
                <div className="feature-item">
                  <CheckCircle className="feature-check" />
                  <span>Up to 500 employees</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="feature-check" />
                  <span>Advanced attendance tracking</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="feature-check" />
                  <span>Complete leave management</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="feature-check" />
                  <span>Advanced analytics & reports</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="feature-check" />
                  <span>Priority phone & email support</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="feature-check" />
                  <span>API access & integrations</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="feature-check" />
                  <span>Custom branding</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="feature-check" />
                  <span>Data export capabilities</span>
                </div>
              </div>
              <button onClick={handleGetStarted} className="plan-cta">
                Start {isYearly ? "Annual" : "Premium"} Plan
              </button>
            </div>
          </div>

          <div className="pricing-footer">
            <p className="pricing-note">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <p className="pricing-guarantee">
              30-day money-back guarantee on all plans
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="logo-text">EmployeeHub</span>
              </div>
              <p className="footer-description">
                Transform your HR operations with our comprehensive employee
                management solution.
              </p>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Product</h4>
              <ul className="footer-links">
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
                <li>
                  <a href="#integrations">Integrations</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Company</h4>
              <ul className="footer-links">
                <li>
                  <a href="#about">About Us</a>
                </li>
                <li>
                  <a href="#careers">Careers</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Support</h4>
              <ul className="footer-links">
                <li>
                  <a href="#help">Help Center</a>
                </li>
                <li>
                  <a href="#documentation">Documentation</a>
                </li>
                <li>
                  <a href="#community">Community</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </div>
  );
};

export default LandingPage;
