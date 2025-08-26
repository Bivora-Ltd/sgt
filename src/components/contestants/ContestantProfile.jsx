import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Instagram, Trophy } from 'lucide-react';
import { getContestantById, voteForContestant } from '../../api/contestants.js';
import { getAllStreetfoods } from '../../api/streetfoods.js';
import { FaTiktok } from 'react-icons/fa';
import PaystackPayment from '../PaystackPayment.jsx';
import { verifyPayment } from '../../api/payment.js';

const ContestantProfile = () => {
  const { id } = useParams();
  const [contestant, setContestant] = useState(null);
  const [streetfoods, setStreetfoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [showPaystack, setShowPaystack] = useState(false);
  const [pendingVote, setPendingVote] = useState(null);
  const [fanEmail, setFanEmail] = useState('');
  const [fanName, setFanName] = useState('');
  const [showFanForm, setShowFanForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contestantData, streetfoodData] = await Promise.all([
          getContestantById(id),
          getAllStreetfoods()
        ]);
        setContestant(contestantData);
        setStreetfoods(streetfoodData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleVote = async (streetfoodId, qty = 1) => {
    try {
      const result = await voteForContestant(contestant._id, streetfoodId, qty);
      setContestant(prev => ({
        ...prev,
        votes: Number(result.contestant.votes || 0)
      }));
      alert(result.message || 'Vote cast successfully!');
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    } finally {
      setVoting(false);
      setQuantities(prev => ({
        ...prev,
        [streetfoodId]: 1
      }));
    }
  };

  const handleQtyChange = (foodId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [foodId]: Math.max(1, (prev[foodId] || 1) + delta)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse-slow text-primary-600 text-xl">Loading contestant profile...</div>
      </div>
    );
  }

  if (!contestant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contestant Not Found</h2>
          <Link to="/contestants" className="text-primary-600 hover:text-primary-700">
            Back to Contestants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {showFanForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4 text-center">Enter Your Details</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                setShowFanForm(false);
                setShowPaystack(true);
              }}
            >
              <input
                type="text"
                placeholder="Name (optional)"
                value={fanName}
                onChange={e => setFanName(e.target.value)}
                className="mb-3 w-full border rounded px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email (required)"
                value={fanEmail}
                onChange={e => setFanEmail(e.target.value)}
                required
                className="mb-4 w-full border rounded px-3 py-2"
              />
              <button
                type="submit"
                className="w-full py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Continue to Payment
              </button>
              <button
                type="button"
                className="w-full py-2 mt-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={() => {
                  setShowFanForm(false);
                  setVoting(false);
                  setPendingVote(null);
                  setFanEmail('');
                  setFanName('');
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {showPaystack && pendingVote && (
        <PaystackPayment
          amount={streetfoods.find(f => f._id === pendingVote.foodId).price * pendingVote.qty}
          email={fanEmail}
          currency={"NGN"}
          onSuccess= {async response => {
            let result = await verifyPayment(response.reference, {
              name: fanName || 'Anonymous',
              paymentFor: "voting",
              channel: "web",
              currency: "NGN",
              contestantId: contestant._id,
              fanEmail,
              fanName
            });
            if (!result.success) {
              alert('Payment verification failed: ' + result.message);
              return;
            }
            handleVote(pendingVote.foodId, pendingVote.qty);
            setShowPaystack(false);
            setPendingVote(null);
            setVoting(false);
            setFanEmail('');
            setFanName('');
          }}
          onClose={() => {
            setShowPaystack(false);
            setPendingVote(null);
            setVoting(false);
            setFanEmail('');
            setFanName('');
          }}
        />
      )}

      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/contestants"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Contestants
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-96">
                <img
                  src={contestant.imageUrl}
                  alt={contestant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6">
                  <h1 className="text-3xl font-bold text-white mb-2">{contestant.name} <span className="inline-flex items-center px-3 py-1 bg-gray-500 text-white text-sm font-medium rounded-full">
                      {contestant.group}
                    </span></h1>
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full">
                      {contestant.performanceType}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                        contestant.status === 'evicted'
                          ? 'bg-red-500 text-white'
                          : 'bg-primary-500 text-white'
                      }`}
                    >
                      {contestant.status}
                    </span>
                    <div className="flex items-center text-white">
                      <Heart className="h-5 w-5 text-red-500 mr-1" />
                      <span className="font-semibold">{contestant.votes} votes</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                    <p className="text-gray-600">{contestant.description || "No description"}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect</h3>
                    <div className="space-x-2 flex">
                      {contestant.socials.instagram && (
                        <a
                          href={contestant.socials.instagram.replace('@', '')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-pink-600 hover:text-pink-700 text-sm"
                        >
                          <Instagram className="h-4 w-4 mr-1" />
                          {contestant.socials.instagram.split('/').pop()}
                        </a>
                      )}
                      {contestant.socials.tiktok && (
                        <a
                          href={contestant.socials.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-pink-600 hover:text-pink-700 text-sm"
                        >
                          <FaTiktok className="h-4 w-4 mr-1" />
                          {contestant.socials.tiktok.split('/').pop()}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-600">{contestant.votes}</div>
                        <div className="text-sm text-gray-500">Total Votes</div>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Trophy className="h-4 w-4 mr-1" />
                      Registered: {new Date(contestant.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Voting Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Support {contestant.name}
              </h2>
              <p className="text-gray-600 text-center mb-6 text-sm">
                Purchase street food to cast your votes!
              </p>
              <div className="space-y-3">
                {streetfoods.map((food) => {
                  const qty = quantities[food._id] || 1;
                  return (
                    <div
                      key={food._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <img
                            src={food.imageUrl}
                            alt={food.name}
                            className="w-12 h-12 rounded-full mr-3"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{food.name}</h3>
                            <p className="text-sm text-gray-500">{food?.votePower * qty} vote</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary-600">
                            ₦{Number(food?.price * qty).toLocaleString(undefined)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center mb-2">
                        <button
                          type="button"
                          className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
                          onClick={() => handleQtyChange(food._id, -1)}
                          disabled={qty <= 1 || voting}
                        >-</button>
                        <input
                          type="number"
                          min={1}
                          value={qty}
                          onChange={e => {
                            const value = Math.max(1, Number(e.target.value) || 1);
                            setQuantities(prev => ({
                              ...prev,
                              [food._id]: value
                            }));
                          }}
                          className="w-12 text-center border-t border-b border-gray-200"
                          disabled={voting}
                        />
                        <button
                          type="button"
                          className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                          onClick={() => handleQtyChange(food._id, 1)}
                          disabled={voting}
                        >+</button>
                      </div>
                      <button
                        onClick={() => {
                          setVoting(true);
                          setPendingVote({ foodId: food._id, qty });
                          setShowFanForm(true);
                        }}
                        disabled={voting}
                        className="w-full py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                      >
                        {voting ? 'Processing...' : `Buy & Vote`}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  All purchases support the contestant and the StreetGotTalent platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestantProfile;