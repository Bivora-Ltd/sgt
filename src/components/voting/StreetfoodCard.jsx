import { ShoppingCart } from 'lucide-react';

const StreetfoodCard = ({ streetfood, onPurchase, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 overflow-hidden">
      <div className="p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">{streetfood.emoji}</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{streetfood.name}</h3>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">${streetfood.price}</div>
              <div className="text-sm text-gray-500">Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">{streetfood.votes}</div>
              <div className="text-sm text-gray-500">Vote{streetfood.votes > 1 ? 's' : ''}</div>
            </div>
          </div>
          <button
            onClick={() => onPurchase(streetfood.id)}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Processing...
              </div>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy & Vote
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreetfoodCard;