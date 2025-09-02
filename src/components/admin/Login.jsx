// create the admin login component
// with email and password 
import { useState } from 'react';
import { adminLogin } from '../../api/admin';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        }
        if (name === 'password') {
            setPassword(value);
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }
        setLoading(true);
        const result = await adminLogin(email, password);
        console.log(result);
        setLoading(false);
        if (!result.accessToken) {
            setError('Login failed: ' + result.error);
            return;
        }
        setError(null);
        localStorage.setItem('adminToken', result.accessToken);
        window.location.reload();
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full"
                onSubmit={handleLogin}
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h2>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter admin email"
                    className="w-full mb-4 px-4 py-2 border rounded-lg"
                    required
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter admin password"
                    className="w-full mb-4 px-4 py-2 border rounded-lg"
                    required
                    onChange={handleChange}
                />
                <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-2 bg-primary-600 text-white rounded-lg font-semibold"
                >
                    Login
                </button>
                {loading && <p className="text-center mt-4 text-gray-500">Logging in...</p>}
                {error && <p className="text-center mt-4 text-red-500">{error}</p>}
            </form>
        </div>
    );
}

export default Login;