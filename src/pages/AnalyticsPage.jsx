import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAnalytics } from "../api";

function AnalyticsPage() {
  const { shortCode } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchAnalytics(shortCode)
      .then((res) => {
        if (!isMounted) return;
        if (res.success) {
          setData(res.data);
        } else {
          setError(res.message || "Could not load analytics");
        }
      })
      .catch(() => {
        if (isMounted) setError("Could not reach the server");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [shortCode]);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading analytics...</p>;
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/links" className="text-blue-600 underline">Back to links</Link>
      </div>
    );
  }

  const maxCount = Math.max(1, ...data.timeSeries.map((d) => d.count));

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link to="/links" className="text-blue-600 underline text-sm">← Back to links</Link>

      <h1 className="text-2xl font-bold mt-4 mb-1">Analytics</h1>
      <p className="text-gray-500 break-all mb-6">{data.originalUrl}</p>

      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-500">Total clicks</p>
        <p className="text-3xl font-bold">{data.clicks}</p>
      </div>

      <h2 className="font-semibold mb-2">Clicks per day</h2>
      {data.timeSeries.length === 0 ? (
        <p className="text-gray-400 text-sm mb-6">No clicks yet.</p>
      ) : (
        <div className="flex items-end gap-2 h-32 mb-6 border-b border-gray-200 pb-1">
          {data.timeSeries.map((point) => (
            <div key={point.date} className="flex flex-col items-center flex-1">
              <div
                className="bg-blue-500 w-full rounded-t"
                style={{ height: `${(point.count / maxCount) * 100}%`, minHeight: "4px" }}
                title={`${point.count} clicks`}
              />
              <span className="text-xs text-gray-400 mt-1">{point.date.slice(5)}</span>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-semibold mb-2">Device breakdown</h2>
      {data.deviceBreakdown.length === 0 ? (
        <p className="text-gray-400 text-sm">No clicks yet.</p>
      ) : (
        <ul className="space-y-1">
          {data.deviceBreakdown.map((item) => (
            <li key={item.device} className="flex justify-between text-sm border-b border-gray-100 py-1">
              <span>{item.device}</span>
              <span className="font-medium">{item.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AnalyticsPage;