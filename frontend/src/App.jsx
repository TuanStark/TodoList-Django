import { useState, useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import client, { getAuthToken, removeAuthToken } from './lib/apolloClient';
import Login from './components/Login';
import './App.css';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentProjectId, setCurrentProjectId] = useState(null);

    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        removeAuthToken();
        setIsAuthenticated(false);
        setCurrentProjectId(null);
        client.resetStore();
    };

    if (loading) {
        return <div className="loading-screen">Loading...</div>;
    }

    return (
        <ApolloProvider client={client}>
            <div className="app">
                <header className="app-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1 className="app-title">
                                Mini Jira
                            </h1>
                            <p className="app-subtitle">
                                Simple Project Management
                            </p>
                        </div>

                        {isAuthenticated && (
                            <div className="header-right">
                                <button onClick={handleLogout} className="logout-button">
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <main className="app-main">
                    {!isAuthenticated ? (
                        <Login onLoginSuccess={handleLoginSuccess} />
                    ) : currentProjectId ? (
                        <ProjectDetail
                            projectId={currentProjectId}
                            onBack={() => setCurrentProjectId(null)}
                        />
                    ) : (
                        <ProjectList onProjectSelect={setCurrentProjectId} />
                    )}
                </main>
            </div>
        </ApolloProvider>
    );
}

export default App;
