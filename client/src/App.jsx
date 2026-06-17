import { Routes, Route } from "react-router-dom";
import CreateLinkPage from "./pages/CreateLinkPage";
import LinksListPage from "./pages/LinksListPage";
import AnalyticsPage from "./pages/AnalyticsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreateLinkPage />} />
      <Route path="/links" element={<LinksListPage />} />
      <Route path="/analytics/:shortCode" element={<AnalyticsPage />} />
    </Routes>
  );
}

export default App;