import { useState, useEffect } from 'react';
import { Shield, Users, Trophy, Coffee, Settings, BarChart3, ArrowLeft, CreditCard } from 'lucide-react';
import { getCurrentSeason, updateSeasonDetails, updateSeasonStage, updateSeasonStatus } from '../api/seasons.js';
import { getAllContestants } from '../api/contestants.js';
import { getAllStreetfoods, createStreetfood, updateStreetfood, deleteStreetfood } from '../api/streetfoods.js';
import { Link } from 'react-router-dom';
import Login from '../components/admin/Login.jsx';
import { eliminateContestant } from '../api/admin.js';
import RegistrationForm from '../components/admin/RegistrationForm.jsx';
import StreetFoodForm from '../components/admin/StreetFoodForm.jsx';
import { getPaymentHistory } from '../api/payment.js';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [season, setSeason] = useState(null);
  const [contestants, setContestants] = useState([]);
  const [streetfoods, setStreetfoods] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showStreetFoodForm, setShowStreetFoodForm] = useState(false);
  const [editingStreetFood, setEditingStreetFood] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const [newSeasonData, setNewSeasonData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    setIsAuthenticated(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [seasonData, contestantData, streetfoodData, paymentData] = await Promise.all([
        getCurrentSeason(),
        getAllContestants(),
        getAllStreetfoods(),
        getPaymentHistory()
      ]);

      setSeason(seasonData);
      setContestants(contestantData);
      setStreetfoods(streetfoodData);
      setPaymentHistory(paymentData.payments);

      setLeaderboard(
        [...contestantData].sort((a, b) => b.votes - a.votes).slice(0, 10)
      );
      setNewSeasonData({
        title: seasonData.title || '',
        registrationFee: seasonData.registrationFee || 0,
        applicationDeadLine: seasonData.applicationDeadLine
          ? new Date(seasonData.applicationDeadLine).toISOString().split('T')[0]
          : ''
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSeason = async (id, seasonData) => {
    setLoading(true);
    try {
      await updateSeasonDetails(id, seasonData);
      fetchData();
    } catch (error) {
      console.error('Error updating season:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleEliminateContestant = async (contestantId) => {
    if (confirm('Are you sure you want to eliminate this contestant?')) {
      try {
        await eliminateContestant(contestantId);
        fetchData();
      } catch (error) {
        console.error('Error eliminating contestant:', error);
      }
    }
  };

  const handleCreateStreetFood = async (formData) => {
    setLoading(true);
    await createStreetfood(formData);
    setShowStreetFoodForm(false);
    setEditingStreetFood(null);

    fetchData();
  };

  const handleUpdateStreetFood = async (formData) => {
    setLoading(true);
    await updateStreetfood(editingStreetFood._id, formData);
    setShowStreetFoodForm(false);
    setEditingStreetFood(null);
    fetchData();
  };

  const handleEditStreetFood = (food) => {
    setEditingStreetFood(food);
    setShowStreetFoodForm(true);
  };

  const handleCancelStreetFoodForm = () => {
    setShowStreetFoodForm(false);
    setEditingStreetFood(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSeasonData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'contestants', name: 'Contestants', icon: Users },
    { id: 'streetfoods', name: 'Street Foods', icon: Coffee },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse-slow text-primary-600 text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated &&
        <Login />
      }

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-red-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="text-sm text-gray-500">
              Season: {season?.name} | Status: {season?.status}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <nav className="bg-white rounded-lg shadow-md">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                        : 'text-gray-700'
                    }`}
                  >
                    <IconComponent className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-primary-600 mr-3" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{contestants.length}</div>
                        <div className="text-sm text-gray-500">Active Contestants</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <Trophy className="h-8 w-8 text-yellow-600 mr-3" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{contestants.reduce((sum, c) => sum + c.votes, 0)}</div>
                        <div className="text-sm text-gray-500">Total Votes</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <Coffee className="h-8 w-8 text-secondary-600 mr-3" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{streetfoods.length}</div>
                        <div className="text-sm text-gray-500">Street Foods</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">₦{Number(season?.registrationFee).toLocaleString(undefined)}</div>
                        <div className="text-sm text-gray-500">Registration Fee</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contestants</h3>
                  <div className="space-y-3">
                    {leaderboard
                      .map((contestant, index) => (
                        <div key={contestant._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{contestant.name}</div>
                              <div className="text-sm text-gray-500">{contestant.performanceType}</div>
                            </div>
                          </div>
                          <div className={`text-sm font-semibold ${
                              contestant.status === 'evicted'
                                ? 'text-red-500'
                                : 'text-primary-500'
                            }`}>{contestant.status} </div>
                          <span className="text-lg font-semibold text-primary-600">{contestant.votes} votes</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Payment History for Street Got Talent { season?.title }</h2>
               {/* history */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  {/* <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contestants</h3> */}
                  <div className="space-y-3">
                    {paymentHistory
                      .map((payment, index) => (
                        <div key={payment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div>
                              <div className="font-medium text-gray-900">{payment.metaData.paymentFor}</div>
                              <div className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className={`text-sm font-semibold  text-primary-500`}>{ payment.metaData.currency }</div>
                          <span className="text-lg font-semibold text-primary-600">{Number(payment.amount).toLocaleString(undefined)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contestants' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Contestant Management</h2>
                {showRegistrationForm && (
                  <div>                    
                    {/* Back button */}
                    <div className="bg-white shadow-sm"
                      onClick={() => {
                        setShowRegistrationForm(false)
                      }}
                    >
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                          <ArrowLeft className="h-5 w-5 mr-2" />
                          Back to Dashboard
                      </div>
                    </div>
                    <RegistrationForm />
                  </div>
                )}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="min-w-full">
                    <div className="px-6 py-4 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">All Contestants</h3>
                        <button
                          onClick={() => setShowRegistrationForm(true)}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                          Add New Contestant
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contestant</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contestants.map((contestant) => (
                          <tr key={contestant._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={contestant.imageUrl}
                                  alt={contestant.name}
                                  className="h-10 w-10 rounded-full object-cover mr-4"
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{contestant.name}</div>
                                  <div className="text-sm text-gray-500">{contestant.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {contestant.performanceType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {contestant.votes}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(contestant.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                disabled={contestant.status === 'evicted'}
                                onClick={() => handleEliminateContestant(contestant._id)}
                                className="text-red-600 hover:text-red-900 mr-4"
                              >
                                Eliminate
                              </button>
                              <Link
                                className="text-primary-600 hover:text-primary-900"
                                to={`/contestants/${contestant._id}`}
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'streetfoods' && (
              <div className="space-y-6">
                {showStreetFoodForm && (
                  <StreetFoodForm
                    streetfood={editingStreetFood}
                    onSubmit={editingStreetFood ? handleUpdateStreetFood : handleCreateStreetFood}
                    onCancel={handleCancelStreetFoodForm}
                    loading={loading}
                  />
                )}
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Street Food Management</h2>
                  <button
                    onClick={() => {
                      setEditingStreetFood(null);
                      setShowStreetFoodForm(true);
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Add New Food
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {streetfoods.map((food) => (
                    <div key={food._id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex flex-col items-center mb-4">
                        <img
                          src={food.imageUrl}
                          alt={food.name}
                          className="mb-2 w-12 h-12 object-cover"
                        />
                        <h3 className="text-lg font-semibold text-gray-900 text-center">{food.name}</h3>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-medium">₦{Number(food.price).toLocaleString(undefined)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Votes:</span>
                          <span className="font-medium">{food.votePower}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                          onClick={() => handleEditStreetFood(food)}
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this street food item?')) {
                              try {
                                setLoading(true);
                                await deleteStreetfood(food._id); // wait for API to finish
                                await fetchData();
                              } catch (err) {
                                console.error('Error deleting street food:', err);
                              } finally {
                                setLoading(false);
                              }
                            }
                          }}
                          className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Registration Open</div>
                        <div className="text-sm text-gray-500">Allow new contestant registrations</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={
                          season?.acceptance
                        }
                          onChange={async () => {
                            const acceptance = !season.acceptance;
                            await handleUpdateSeason(season._id, {
                              acceptance
                            });
                           }}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                  <h2 className="text-2xl font-bold text-gray-900">Season Management</h2>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Season</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Season Name</label>
                        <input
                          type="text"
                          name='title'
                          id='title'
                          value={newSeasonData.title || ''}
                          onChange={handleChange}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />

                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Registration Fee</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                          <input
                            type="number"
                            name='registrationFee'
                            id='registrationFee'
                            onChange={handleChange}
                            value={newSeasonData.registrationFee || 0}
                            className="pl-8 w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />

                        </div>
                      </div> 
                      <div>
                        {/* Date input to edit applicationDeadline */}
                        <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                        <input
                          type="date"
                          name='applicationDeadLine'
                          id='applicationDeadLine'
                          onChange={handleChange}
                          value={newSeasonData.applicationDeadLine || ''}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />

                      </div>

                      {/* Update Button */}
                      <div className="md:col-span-2">
                       <button
                        onClick={() => handleUpdateSeason(season._id, newSeasonData)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Update Season
                      </button>
                      </div>
                    </div>
                  </div>

                  {/* Stage Progression UI */}
                  <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Competition Stages</h3>

                    {/* Stage Indicator */}
                    <div className="flex items-center justify-between mb-6">
                      {['audition', 'group', 'semi', 'final'].map((stage, index, arr) => {
                        const isActive = season?.status === stage;
                        const isCompleted = season?.status === "completed";
                        return (
                          <div key={stage} className="flex-1 flex items-center">
                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                              isActive ? 'bg-primary-600' :
                              isCompleted ? 'bg-green-500' :
                              'bg-gray-300'
                            }`}>
                              {index + 1}
                            </div>
                            {index !== arr.length - 1 && (
                              <div className={`flex-1 h-1 ${
                                isCompleted ? 'bg-green-500' :
                                isActive ? 'bg-primary-600' :
                                'bg-gray-200'
                              }`}></div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Label below steps */}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Audition</span>
                      <span>Group</span>
                      <span>Semi</span>
                      <span>Final</span>
                    </div>

                    {/* Advance Button */}
                    <div className="mt-6">
                      <button
                        onClick={async() => updateSeasonStage().then(() => fetchData())}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Advance Stage
                      </button>

                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;