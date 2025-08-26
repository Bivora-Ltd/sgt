import { useState, useEffect } from 'react';

const StreetFoodForm = ({
  streetfood,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [vote_power, setVote_power] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (streetfood) {
      setName(streetfood.name || '');
      setPrice(streetfood.price || '');
      setVote_power(streetfood.votePower || '');
      setImagePreview(streetfood.imageUrl || '');
    } else {
      setName('');
      setPrice('');
      setVote_power('');
      setImage(null);
      setImagePreview('');
    }
  }, [streetfood]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !vote_power || (!image && !imagePreview)) {return};
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('vote_power', vote_power);
    formData.append('image', image);
    onSubmit(formData);
  };

  return (
    <form
      className="bg-white rounded-lg shadow-md p-6 max-w-md w-full mx-auto"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
        {streetfood ? 'Edit Street Food' : 'Add New Street Food'}
      </h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
        <input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          min={0}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Vote Power</label>
        <input
          type="number"
          value={vote_power}
          onChange={e => setVote_power(e.target.value)}
          min={1}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-3 w-24 h-24 object-cover rounded"
          />
        )}
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
        >
          {loading ? 'Saving...' : streetfood ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default StreetFoodForm;