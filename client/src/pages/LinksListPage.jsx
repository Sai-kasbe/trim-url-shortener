import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLinks } from "../api";

function LinksListPage() {
  const [links, setLinks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks()
      .then((res) => {
        if (res.success) {
          setLinks(res.data);
        } else {
          setError(res.message || "Could not load links");
        }
      })
      .catch(() => setError("Could not reach the server"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your links</h1>
        <Link to="/" className="text-blue-600 underline text-sm">+ New link</Link>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && links.length === 0 && (
        <p className="text-gray-400">No links yet. Create one to get started.</p>
      )}

      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link._id}
            className="border border-gray-200 rounded-md p-4 flex items-center justify-between"
          >
            <div className="min-w-0">
              <p className="text-gray-500 text-sm truncate max-w-md">{link.originalUrl}</p>
              <p className="font-medium">/{link.shortCode}</p>
            </div>
            <div className="flex items-center gap-4 ml-4 shrink-0">
              <span className="text-sm text-gray-500">{link.clicks} clicks</span>
              <Link
                to={`/analytics/${link.shortCode}`}
                className="text-blue-600 underline text-sm"
              >
                Analytics
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LinksListPage;