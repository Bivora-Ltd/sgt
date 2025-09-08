import { useRef, useState, useEffect } from 'react';
import { Upload, User, Instagram, Zap, CheckCircle } from 'lucide-react';
import { PERFORMANCE_TYPES } from '../../utils/constants.js';
import { registerContestant } from '../../api/contestants.js';
import { FaNairaSign } from 'react-icons/fa6';
import { getCurrentSeason } from '../../api/seasons.js';
import PaystackPayment from '../PaystackPayment.jsx';
import { verifyPayment } from '../../api/payment.js';
import { PiWarningCircle } from 'react-icons/pi';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    instagram: '',
    tiktok: '',
    performance_type: '',
    description: '',
    profile: null,
    phone: ''
  });

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPaystack, setShowPaystack] = useState(false);
  const [season, setSeason] = useState({});
  const [loading, setLoading] = useState(true);
  const [formDataObj, setFormDataObj] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    try {
      const croppedImage = await getCroppedImg(imagePreview, croppedAreaPixels);
      setImagePreview(croppedImage);

      // Convert base64 -> File so it works with FormData
      const res = await fetch(croppedImage);
      const blob = await res.blob();
      const file = new File([blob], formData.profile.name, { type: blob.type });

      setFormData(prev => ({ ...prev, profile: file }));
      setShowCropper(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (e) {
      console.error(e);
    }
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData(prev => ({ ...prev, profile: file }));
        setShowCropper(true); // show crop UI immediately
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelCrop = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, profile: null }));
    setShowCropper(false);

    // ✅ clear file input so user can re-select same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.performance_type) newErrors.performance_type = 'Please select a performance type';
    if (!formData.description.trim()) newErrors.description = 'Please describe your act';
    if (!formData.profile) newErrors.profile = 'Please upload a profile image';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('email', formData.email);
    fd.append('instagram', formData.instagram);
    fd.append('tiktok', formData.tiktok);
    fd.append('performance_type', formData.performance_type);
    fd.append('description', formData.description);
    fd.append('phone', formData.phone);
    fd.append('profile', formData.profile);
    setFormDataObj(fd);
    setShowPaystack(true);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-primary-600 to-secondary-600 min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Welcome to Street's Got Talent, {formData.name}! Your registration has been submitted successfully.
            You'll receive a confirmation email shortly with next steps.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              <strong>Registration Fee:</strong>₦{Number(season?.registrationFee).toLocaleString(undefined)}<br />
              <strong>Performance Type:</strong> {formData.performance_type}<br />
            </p>
          </div>
          <button
            onClick={() => {
              setSuccess(false);
              setFormData({
                name: '',
                email: '',
                instagram: '',
                tiktok: '',
                performance_type: '',
                description: '',
                profile: null,
                phone: ''
              });
              setImagePreview(null);
            }}
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Register Another Contestant
          </button>
        </div>
      </div>
    );
  }

  if (!season?.acceptance) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <PiWarningCircle className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration closed!</h2>
          <p className="text-gray-600 mb-6">
            Registration is not available at the moment.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              <strong>Contact us:</strong>xpat@streetgottalent.com<br />
            </p>
          </div>
          {/* <button
            onClick={() => {
              setSuccess(false);
              setFormData({
                name: '',
                email: '',
                instagram: '',
                tiktok: '',
                performance_type: '',
                description: '',
                profile: null,
                phone: ''
              });
              setImagePreview(null);
            }}
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Register Another Contestant
          </button> */}
        </div>
      </div>
    );
  }

  if (showPaystack && formDataObj) {
    return (
      <PaystackPayment
        amount={season.registrationFee}
        email={formData.email}
        currency={"NGN"}
        onSuccess={async response => {
          setLoading(true);
          let result = await verifyPayment(response.reference, {
            name: formData.name,
            paymentFor: "registration",
            channel: "web",
            currency: "NGN",
            contestantId: null
          });
          if (!result.success) {
            alert(result.message || 'Registration failed');
            setShowPaystack(false);
            setLoading(false);
            return;
          }
          result = await registerContestant(formDataObj);
          if (!result.success) {
            alert(result.message || 'Registration failed');
            setShowPaystack(false);
            setLoading(false);
            return;
          }
          setSuccess(true);
          setShowPaystack(false);
          setLoading(false);
        }}
        onClose={() => {
          setShowPaystack(false);
        }}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">

      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-[90%] max-w-md">
            <div className="relative w-full h-80">
              <Cropper
                image={imagePreview}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}   // 👈 enforce ratio (square: 1/1, portrait: 4/5, etc.)
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={handleCancelCrop}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-primary-600 text-white rounded"
                onClick={handleCropConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">Register for Street's Got Talent</h1>
          <p className="text-primary-100 mt-2">Join the most exciting street talent competition in the world!</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6" encType="multipart/form-data">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2 text-primary-600" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Performance Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${errors.name ? 'border-red-300' : ''
                    }`}
                  placeholder="Enter your performance name"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${errors.email ? 'border-red-300' : ''
                    }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone number *
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${errors.phone ? 'border-red-300' : ''
                    }`}
                  placeholder="08123456789"
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Instagram className="h-5 w-5 mr-2 text-primary-600" />
              Social Media
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="username - without '@' "
                />
              </div>
              <div>
                <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700 mb-2">
                  TikTok Handle
                </label>
                <input
                  type="text"
                  id="tiktok"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="username - without '@' "
                />
              </div>
            </div>
          </div>

          {/* Performance Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary-600" />
              Performance Details
            </h2>
            <div>
              <label htmlFor="performance_type" className="block text-sm font-medium text-gray-700 mb-2">
                Performance Type *
              </label>
              <select
                id="performance_type"
                name="performance_type"
                value={formData.performance_type}
                onChange={handleChange}
                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${errors.performance_type ? 'border-red-300' : ''
                  }`}
              >
                <option value="">Select your performance type</option>
                {PERFORMANCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.performance_type && <p className="text-red-600 text-sm mt-1">{errors.performance_type}</p>}
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Describe Your Act *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${errors.description ? 'border-red-300' : ''
                  }`}
                placeholder="Tell us about your performance style, experience, and what makes you unique..."
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Upload className="h-5 w-5 mr-2 text-primary-600" />
              Profile Image
            </h2>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="profile" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 10MB)</p>
                  </div>
                )}
                <input
                  id="profile"
                  name="profile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />
              </label>
            </div>
            {errors.profile && <p className="text-red-600 text-sm mt-1">{errors.profile}</p>}
          </div>

          {/* Registration Fee */}
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaNairaSign className="h-5 w-5 text-primary-600 mr-2" />
                <span className="font-medium text-primary-900">Registration Fee</span>
              </div>
              <span className="text-2xl font-bold text-primary-600">₦{Number(season?.registrationFee).toLocaleString(undefined)}</span>
            </div>
            <p className="text-primary-700 text-sm mt-2">
              One-time registration fee to join the competition. Payment will be processed after form submission.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Processing Registration...
              </div>
            ) : (
              "Register for Street's Got Talent"
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By registering, you agree to our Terms of Service and Privacy Policy.
            All registration fees are non-refundable.
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;