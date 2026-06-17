import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
import { createLink } from "../api";

function CreateLinkPage() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await createLink(originalUrl, customAlias.trim() || undefined);
      if (res.success) {
        setResult(res);
        setOriginalUrl("");
        setCustomAlias("");
      } else {
        setError(res.message || "Something went wrong");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">Trim</h1>
      <p className="text-gray-500 mb-6">Shorten a URL and track its clicks.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Long URL</label>
          <input
            type="text"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="https://example.com/some/long/path"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Custom alias <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            placeholder="my-link"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
        >
          {loading ? "Creating..." : "Shorten"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-sm text-gray-500 mb-1">Your short link:</p>

          <a
            href={result.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline break-all"
          >
            {result.shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}

export default CreateLinkPage;