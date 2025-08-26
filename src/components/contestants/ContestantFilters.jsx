import { Search, Filter } from 'lucide-react';
import { PERFORMANCE_TYPES } from '../../utils/constants.js';

const ContestantFilters = ({ searchQuery, setSearchQuery, selectedFilter, setSelectedFilter, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-primary-600" />
          Find Contestants
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or performance type..."
              className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Performance Type Filter */}
        <div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">All Performance Types</option>
            {PERFORMANCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button (Mobile) */}
        <div className="md:hidden">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Quick Filter Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setSelectedFilter('');
            setSearchQuery('');
          }}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            !selectedFilter
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {PERFORMANCE_TYPES.slice(0, 5).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedFilter(type)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedFilter === type
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContestantFilters;