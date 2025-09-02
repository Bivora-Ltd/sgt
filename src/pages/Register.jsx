import RegistrationForm from '../components/registration/RegistrationForm.jsx';

const Register = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join Street's Got Talent
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every star begins with a step. 🌟
            This is where raw talent meets opportunity.
            Sign up today, take the stage, and let your story inspire millions.
          </p>
        </div>

        <RegistrationForm />

        <div className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Happens Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
                <span className="text-xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Registration Confirmation</h3>
              <p className="text-gray-600 text-sm">System confirms your payment and registration details.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-100 rounded-full mb-4">
                <span className="text-xl font-bold text-secondary-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Profile Goes Live</h3>
              <p className="text-gray-600 text-sm">Once confirmed, your profile appears on the contestants page, and you receive a confirmation email.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-100 rounded-full mb-4">
                <span className="text-xl font-bold text-accent-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Start Competing</h3>
              <p className="text-gray-600 text-sm">Fans can discover and vote for your talent!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;