import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import OwnerDashboard from "./OwnerDashboard";
import "./OwnerPortal.css";

const OwnerPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const OWNER_PASSWORD = "09727";

  const handleLogin = (e) => {
    e.preventDefault();

    if (password === OWNER_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
      // Store owner session
      sessionStorage.setItem("ownerAuthenticated", "true");
    } else {
      setError("Invalid password. Please try again.");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    sessionStorage.removeItem("ownerAuthenticated");
  };

  // Check if already authenticated on component mount
  React.useEffect(() => {
    const isOwnerAuth = sessionStorage.getItem("ownerAuthenticated");
    if (isOwnerAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated) {
    return <OwnerDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="owner-portal">
      <div className="owner-login-container">
        <div className="owner-login-card">
          <div className="owner-login-header">
            <h1>Owner Portal</h1>
            <p>Enter password to access analytics and reports</p>
          </div>

          <form onSubmit={handleLogin} className="owner-login-form">
            <div className="password-field">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter owner password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button">
              Access Portal
            </button>
          </form>

          <div className="owner-login-footer">
            <p>Authorized access only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerPortal;
