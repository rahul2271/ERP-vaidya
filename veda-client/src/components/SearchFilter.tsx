"use client";

import { Search, X, Filter } from "lucide-react";
import { useState } from "react";

interface SearchFilterProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onFilterChange?: (filter: string) => void;
  filters?: { label: string; value: string }[];
  debounceMs?: number;
}

export default function SearchFilter({
  placeholder = "Search...",
  onSearch,
  onFilterChange,
  filters = [],
  debounceMs = 300,
}: SearchFilterProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    
    if (debounceTimeout) clearTimeout(debounceTimeout);
    
    const timeout = setTimeout(() => {
      onSearch(value);
    }, debounceMs);
    
    setDebounceTimeout(timeout);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  const handleFilterSelect = (filterValue: string) => {
    setActiveFilter(filterValue);
    onFilterChange?.(filterValue);
    setShowFilters(false);
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Button */}
        {filters.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-lg border transition flex items-center gap-1.5 ${
                activeFilter
                  ? "bg-primary-50 border-primary-300 text-primary-600"
                  : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              <Filter size={18} />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Filter</span>
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden">
                <button
                  onClick={() => {
                    handleFilterSelect("");
                    setShowFilters(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm font-medium transition ${
                    !activeFilter
                      ? "bg-primary-50 text-primary-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  All
                </button>
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => handleFilterSelect(filter.value)}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium transition border-t border-slate-100 ${
                      activeFilter === filter.value
                        ? "bg-primary-50 text-primary-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Filter Badge */}
      {activeFilter && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active:</span>
          <div className="inline-flex items-center gap-2 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-200">
            <span className="text-xs font-semibold text-primary-700">
              {filters.find((f) => f.value === activeFilter)?.label || activeFilter}
            </span>
            <button
              onClick={() => handleFilterSelect("")}
              className="text-primary-600 hover:text-primary-800 transition"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
