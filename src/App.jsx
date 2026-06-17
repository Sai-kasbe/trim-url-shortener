import { Routes, Route } from "react-router-dom";
import CreateLinkPage from "./pages/CreateLinkPage";
import LinksPage from "./pages/LinksPage";
import AnalyticsPage from "./pages/AnalyticsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreateLinkPage />} />
      <Route path="/links" element={<LinksPage />} />
      <Route path="/analytics/:shortCode" element={<AnalyticsPage />} />
    </Routes>
  );
}

export default App;