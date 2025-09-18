import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

function Filters({
  sortBy,
  setSortBy,
  timeFrame,
  setTimeFrame,
  content,
  setContent,
}) {
  const [localSearch, setLocalSearch] = useState(content);

  // Handle search input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setContent(localSearch);
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [localSearch, setContent]);

  return (
    <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search
              size={12}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Filter posts..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-6 pr-2 py-1 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600 whitespace-nowrap">
            Sort:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 py-1 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 min-w-0"
          >
            <option value="new">New</option>
            <option value="hot">Hot</option>
            <option value="top">Top</option>
            <option value="controversial">Controversial</option>
          </select>
        </div>

        {sortBy !== "new" && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600 whitespace-nowrap">
              Time:
            </label>
            <select
              value={timeFrame || ""}
              onChange={(e) => setTimeFrame(e.target.value || null)}
              className="px-2 py-1 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 min-w-0"
            >
              <option value="">All Time</option>
              <option value="hour">1h</option>
              <option value="day">1d</option>
              <option value="week">1w</option>
              <option value="month">1m</option>
              <option value="year">1y</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

export default Filters;
