import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import ContestantCard from '../components/contestants/ContestantCard.jsx';
import { getAllContestants } from '../api/contestants.js';

const Contestants = () => {
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContestants();
  }, []);

  const fetchContestants = async () => {
    setLoading(true);
    try {
      const results = await getAllContestants();
      setContestants(results);
    } catch (error) {
      console.error('Error fetching contestants:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Meet Our Talented Contestants
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your vote is more than a click — it’s hope. Every vote pushes a raw street talent closer to their dream stage. Support your favorite and be part of their story
          </p>
        </div>

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
        ) : contestants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contestants.map((contestant) => (
              <ContestantCard
                key={contestant._id}
                contestant={contestant}
              // onVote={handleVote}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contestants found</h3>
            <p className="text-gray-500">
              Check back soon for new contestants!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contestants;