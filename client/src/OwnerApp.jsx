import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import OwnerPortal from "./pages/OwnerPortal";

function OwnerApp() {
  return (
    <Routes>
      {/* Owner Portal - main route */}
      <Route path="/" element={<OwnerPortal />} />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default OwnerApp;
