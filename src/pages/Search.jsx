import { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter } from 'lucide-react';
import ContestantCard from '../components/contestants/ContestantCard.jsx';
import { getAllContestants } from '../api/contestants.js';
import { PERFORMANCE_TYPES } from '../utils/constants.js';

const Search = () => {
  const [allContestants, setAllContestants] = useState([]);
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Fetch all contestants once on mount
    const fetchContestants = async () => {
      setLoading(true);
      try {
        const results = await getAllContestants();
        setAllContestants(results.filter(c => !c.isEliminated));
        setContestants(results.filter(c => !c.isEliminated));
      } catch (error) {
        console.error('Error fetching contestants:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContestants();
  }, []);

  const handleSearch = () => {
    setLoading(true);
    setHasSearched(true);

    let results = allContestants;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        c =>
          c.name.toLowerCase().includes(query) ||
          (c.performanceType && c.performanceType.toLowerCase().includes(query))
      );
    }

    if (selectedFilter && selectedFilter !== '') {
      results = results.filter(c => c.performanceType === selectedFilter);
    }

    setContestants(results);
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    // Filter on frontend when filter changes
    if (searchQuery || selectedFilter) {
      handleSearch();
    } else {
      setContestants(allContestants);
      setHasSearched(false);
    }
    // eslint-disable-next-line
  }, [selectedFilter]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Search Contestants
          </h1>
          <p className="text-lg text-gray-600">
            Find talented street performers by name or performance type
          </p>
        </div>

        {/* Search Interface */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search by name or performance type..."
                  className="pl-10 w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Performance Types</option>
                {PERFORMANCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <button
                onClick={handleSearch}
                disabled={loading || (!searchQuery.trim() && !selectedFilter)}
                className="w-full h-12 px-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  <>
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <Filter className="h-4 w-4 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Quick Filters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('');
                  setContestants(allContestants);
                  setHasSearched(false);
                }}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
              {PERFORMANCE_TYPES.slice(0).map((type) => (
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
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md animate-pulse">
                <div className="h-64 bg-gray-300 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : hasSearched && contestants.length > 0 ? (
          <div>
            <div className="mb-6">
              <p className="text-gray-600">
                Found {contestants.length} contestant{contestants.length !== 1 ? 's' : ''}
                {searchQuery && ` matching "${searchQuery}"`}
                {selectedFilter && ` in ${selectedFilter}`}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contestants.map((contestant) => (
                <ContestantCard
                  key={contestant._id}
                  contestant={contestant}
                  // onVote={handleVote}
                />
              ))}
            </div>
          </div>
        ) : hasSearched ? (
          <div className="text-center py-12">
            <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contestants found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or browse all contestants.
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Search</h3>
            <p className="text-gray-500">
              Enter a name or select a performance type to find contestants.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;