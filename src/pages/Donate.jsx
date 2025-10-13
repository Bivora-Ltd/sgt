import { useState } from 'react';
import { Heart, CreditCard, Users, Trophy, Star } from 'lucide-react';
import PaystackPayment from '../components/PaystackPayment.jsx';
import { verifyPayment } from '../api/payment.js';

const currencyConfig = {
  NGN: { symbol: '₦', min: 1000 },
  USD: { symbol: '$', min: 2 },
  GHS: { symbol: '₵', min: 15 },
  ZAR: { symbol: 'R', min: 20 }
};


const Donate = () => {
  const impactStats = [
    { number: '50+', label: 'Contestants Supported', icon: Users },
    { number: '₦5m+', label: 'Prize Money Funded', icon: Trophy },
    { number: '500+', label: 'Community Votes', icon: Heart },
    { number: '25', label: 'Success Stories', icon: Star }
  ];

  const [currency, setCurrency] = useState('NGN');
  const [amount, setAmount] = useState(currencyConfig['NGN'].min);
  const [showPaystack, setShowPaystack] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFanForm, setShowFanForm] = useState(false);
  const [fanName, setFanName] = useState('');
  const [fanEmail, setFanEmail] = useState('');

  const handleCurrencyChange = (e) => {
    const selected = e.target.value;
    setCurrency(selected);
    setAmount(currencyConfig[selected].min);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value); // don’t clamp here
  };


  const handleDonate = (e) => {
    e.preventDefault();
    if (Number(amount) < currencyConfig[currency].min) {
      alert(`Minimum donation for ${currency} is ${currencyConfig[currency].symbol}${currencyConfig[currency].min}`);
      return;
    }

    setShowFanForm(true);
  };


  if (showPaystack) {
    return (
      <PaystackPayment
        amount={amount}
        email={fanEmail}
        currency={currency}
        metadata={{
          paymentFor: "donation",
          name: fanName,
          email: fanEmail,
          amount,
          channel: "web",
          currency: "NGN"
        }}
        onSuccess={async response => {
          setLoading(true);
          const result = await verifyPayment(response.reference, {
            paymentFor: "donation",
            channel: "web",
            currency,
            amount,
            name: fanName || 'Anonymous',
            email: fanEmail
          });
          if (!result.success) {
            alert("Payment verification failed. Please contact support.");
            setShowPaystack(false);
            setLoading(false);
            return;
          }
          setShowPaystack(false);
          setDonationSuccess(true);
          setLoading(false);
        }}
        onClose={() => {
          setShowPaystack(false);
          setLoading(false);
          setAmount(currencyConfig[currency].min);
          setCurrency('NGN');
          setFanName('');
          setFanEmail('');
        }}
      />

    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-secondary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Support Street Talent
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
              Your donation helps us provide a platform where street performers can showcase their talents,
              connect with fans, and build sustainable careers doing what they love.
            </p>

            {/* Donation Form */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Custom Donation</h3>
                <p className="text-gray-600 mb-6">
                  Enter any amount that feels right for you.
                </p>
                <form onSubmit={handleDonate}>
                  <div className="flex items-center justify-center space-x-4 mb-6">

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                        {currencyConfig[currency].symbol}
                      </span>
                      <input
                        type="number"
                        min={currencyConfig[currency].min}
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder={currencyConfig[currency].min}
                        className="pl-8 pr-4 py-3 w-32 text-center text-xl font-semibold rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <select
                        className="px-8 py-3 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-lg font-semibold"
                        value={currency}
                        onChange={handleCurrencyChange}
                      >
                        <option value="NGN">₦ NGN</option>
                        <option value="USD">$ USD</option>
                        <option value="GHS">₵ GHS</option>
                        <option value="ZAR">R ZAR</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 transform hover:scale-105"
                    disabled={loading}
                  >
                    <CreditCard className="h-5 w-5 mr-2 inline" />
                    {loading ? "Processing..." : "Donate Now"}
                  </button>
                </form>
              </div>
            </div>
            <div className="inline-flex items-center text-primary-600 bg-white bg-opacity-20 rounded-full px-6 py-3 backdrop-blur-sm">
              <Heart className="h-5 w-5 mr-2 text-red-300" />
              Every donation makes a difference
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Impact Stats */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Impact So Far</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <IconComponent className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {donationSuccess && (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                Your donation has been received. You are helping street performers shine and build their dreams!
              </p>
              <button
                onClick={() => {
                  setDonationSuccess(false);
                  setAmount(currencyConfig[currency].min);
                  setCurrency('NGN');
                }}
                className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Make Another Donation
              </button>
            </div>
          </div>
        )}

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
                  onClick={() => setShowFanForm(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}


        {/* How Donations Help */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">How Your Donation Helps</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-200 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Talent Development</h4>
              <p className="text-gray-600">We’ve always had the talent, but never the chance. Your support means we can finally learn, grow, and prove that where we come from doesn’t define where we’re going.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-200 rounded-full mb-4">
                <Trophy className="h-8 w-8 text-secondary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Future Building</h4>
              <p className="text-gray-600">Donations here go into education, tools, and opportunities that turn raw talent into lasting success.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-200 rounded-full mb-4">
                <Heart className="h-8 w-8 text-accent-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Xpatainment Records</h4>
              <p className="text-gray-600">Every great street star needs a stage beyond the street. With your support, we can sign and groom the most promising talents, giving them a chance to record, distribute, and share their music with the world.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;