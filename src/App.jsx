import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Landing from "./Landing";
import SmartEmail from "./journeys/SmartEmail";
import FileConverter from "./journeys/FileConverter";
import PDFStudio from "./journeys/PDFStudio";
import WebOptimizer from "./journeys/WebOptimizer";
import IconGenerator from "./journeys/IconGenerator";

// Component to handle journey state cleanup on navigation
function JourneyStateManager() {
  const location = useLocation();

  useEffect(() => {
    // Cleanup any journey state when navigating between routes
    // This ensures each journey starts fresh
    window.scrollTo(0, 0);

    // Clear any file inputs or temporary data
    // (Will be implemented when journeys have actual state)

    return () => {
      // Additional cleanup if needed
    };
  }, [location.pathname]);

  return null;
}

// Main App component with routing
function App() {
  return (
    <BrowserRouter>
      <JourneyStateManager />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/email" element={<SmartEmail />} />
        <Route path="/convert" element={<FileConverter />} />
        <Route path="/pdf" element={<PDFStudio />} />
        <Route path="/optimize" element={<WebOptimizer />} />
        <Route path="/icons" element={<IconGenerator />} />
        <Route path="*" element={<Landing />} /> {/* Fallback to landing */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
