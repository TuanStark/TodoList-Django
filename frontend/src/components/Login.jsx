import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN, CREATE_USER } from '../graphql/queries';
import { setAuthToken } from '../lib/apolloClient';

export default function Login({ onLoginSuccess }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [login, { loading: loginLoading }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            if (data.tokenAuth?.token) {
                setAuthToken(data.tokenAuth.token);
                if (onLoginSuccess) onLoginSuccess();
            }
        },
        onError: (error) => {
            setErrorMsg(error.message || 'Login failed');
        }
    });

    const [register, { loading: registerLoading }] = useMutation(CREATE_USER, {
        onCompleted: (data) => {
            if (data.createUser?.success) {
                setSuccessMsg('Account created successfully! Please log in.');
                setIsRegistering(false);
                setPassword('');
            } else {
                setErrorMsg(data.createUser?.message || 'Registration failed');
            }
        },
        onError: (error) => {
            setErrorMsg(error.message || 'Registration failed');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (isRegistering) {
            register({
                variables: {
                    email,
                    password,
                    firstName,
                    lastName
                }
            });
        } else {
            login({ variables: { email, password } });
        }
    };

    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setErrorMsg('');
        setSuccessMsg('');
    };

    const loading = loginLoading || registerLoading;

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
                <p>{isRegistering ? 'Sign up to get started' : 'Sign in to continue to Mini Jira'}</p>

                {errorMsg && <div className="error-message">{errorMsg}</div>}
                {successMsg && <div className="success-message">{successMsg}</div>}

                <form onSubmit={handleSubmit}>
                    {isRegistering && (
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="John"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="login-button">
                        {loading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                        <button onClick={toggleMode} className="link-button">
                            {isRegistering ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
