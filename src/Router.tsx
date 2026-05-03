"use client";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./screens/Index";
import Onboarding from "./screens/Onboarding";
import Dashboard from "./screens/Dashboard";
import Analytics from "./screens/Analytics";
import Profile from "./screens/Profile";
import Success from "./screens/Success";
import NotFound from "./screens/NotFound";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/success" element={<Success />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
