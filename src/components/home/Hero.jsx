import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, Trophy, Heart, CreditCard } from 'lucide-react';
import { getCurrentSeason } from '../../api/seasons.js';

const Hero = () => {
  const [season, setSeason] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeason = async () => {
      try {
        const currentSeason = await getCurrentSeason();
        setSeason(currentSeason);
      } catch (error) {
        console.error('Error fetching season:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeason();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-primary-600 to-secondary-600 min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-primary-600 to-secondary-600 min-h-screen flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-green-950 bg-opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm10 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 text-green-950 bg-white bg-opacity-20 rounded-full text-sm font-medium backdrop-blur-sm">
                <Trophy className="h-4 w-4 mr-2" />
                {season?.title || 'Current Season'}
              </div>
            </div>

            <h1 className="text-8xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Street's Got
              <span className="md:block text-accent-300"> Talent</span>
              <span className='block text-white text-lg'>The stage is 'urzzz</span>
            </h1>

            <p className="text-xl text-white text-opacity-90 mb-8 max-w-lg">
              'Discover the most talented street performers in the city! Vote for your favorites and help them achieve their dreams.'
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Users className="h-5 w-5 mr-2" />
                Register Now
              </Link>
              <Link
                to="/contestants"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-200"
              >
                <Play className="h-5 w-5 mr-2" />
                Vote Now
              </Link>
            </div>

            {season && (
              <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-950">₦
                      {Number(season?.registrationFee).toLocaleString(undefined)}
                    </div>
                    <div className="text-green-950 text-opacity-75 text-sm">Registration Fee</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent-300">
                      {
                        season?.acceptance ? 'Open' : 'Closed'
                      }
                    </div>
                    <div className="text-green-950 text-opacity-75 text-sm">Registration Status</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-950">
                      {new Date(season?.createdAt).getFullYear()}
                    </div>
                    <div className="text-green-950 text-opacity-75 text-sm">Season Year</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Visual Element */}
          <div className="animate-slide-up  lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-white bg-opacity-20 rounded-3xl transform rotate-6 backdrop-blur-sm"></div>
              <div className="relative bg-white bg-opacity-10 rounded-3xl p-8 backdrop-blur-sm">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-accent-400 rounded-full mb-6 transform animate-pulse-slow">
                    <Heart className="h-12 w-12 text-green-950" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-950 mb-4">Support Street Artists</h3>
                  <p className="text-green-950 text-opacity-90">
                    On these streets, dreams die in silence every day. Your donation is the difference between a talent fading away… or finding a stage that could change their life forever.
                  </p>
                  {/* <div className="mt-6 grid grid-cols-3 gap-2">
                    {['🌮', '🍔', '🍕'].map((emoji, index) => (
                      <div key={index} className="text-3xl p-3 bg-white bg-opacity-20 rounded-lg">
                        {emoji}
                      </div>
                    ))}
                  </div> */}
                  <div className='mt-6'>
                    <Link
                      className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 transform hover:scale-105"
                      disabled={loading}
                      to={'/donate'}
                    >
                      <CreditCard className="h-5 w-5 mr-2 inline" />Donate Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;