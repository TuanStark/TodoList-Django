import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_PROJECTS, CREATE_PROJECT } from '../graphql/queries';

export default function ProjectList({ onProjectSelect }) {
    const { loading, error, data, refetch } = useQuery(GET_ALL_PROJECTS);
    const [createProject] = useMutation(CREATE_PROJECT, {
        onCompleted: () => {
            refetch();
            setShowCreateForm(false);
            setNewProjectName('');
            setNewProjectDesc('');
        }
    });

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDesc, setNewProjectDesc] = useState('');

    const handleCreateProject = (e) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;

        createProject({
            variables: {
                name: newProjectName,
                description: newProjectDesc
            }
        });
    };

    if (loading) return <div className="loading-container"><div className="loading-spinner"></div><p>Loading projects...</p></div>;
    if (error) return <div className="error-container"><h3>Error</h3><p>{error.message}</p><button onClick={() => refetch()} className="retry-button">Try Again</button></div>;

    return (
        <div className="project-list">
            <div className="project-list-header">
                <h2>📋 Projects ({data?.allProjects?.length || 0})</h2>
                <div className="header-actions">
                    <button onClick={() => setShowCreateForm(true)} className="create-button">
                        + New Project
                    </button>
                    <button onClick={() => refetch()} className="refresh-button">
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {showCreateForm && (
                <div className="create-project-form">
                    <h3>Create New Project</h3>
                    <form onSubmit={handleCreateProject}>
                        <input
                            type="text"
                            placeholder="Project Name"
                            value={newProjectName}
                            onChange={e => setNewProjectName(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Description (optional)"
                            value={newProjectDesc}
                            onChange={e => setNewProjectDesc(e.target.value)}
                        />
                        <div className="form-actions">
                            <button type="submit" className="save-btn">Create</button>
                            <button type="button" onClick={() => setShowCreateForm(false)} className="cancel-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {(!data?.allProjects?.length && !showCreateForm) ? (
                <div className="empty-container">
                    <h3>📁 No Projects Yet</h3>
                    <p>Create your first project to get started!</p>
                    <button onClick={() => setShowCreateForm(true)} className="create-button">
                        Create Project
                    </button>
                </div>
            ) : (
                <div className="project-grid">
                    {data?.allProjects.map((project) => (
                        <div
                            key={project.id}
                            className="project-card"
                            onClick={() => onProjectSelect(project.id)}
                        >
                            <div className="project-card-header">
                                <h3 className="project-name">{project.name}</h3>
                                <span className="task-count">{project.taskCount} tasks</span>
                            </div>
                            <p className="project-description">
                                {project.description || 'No description provided'}
                            </p>
                            <div className="project-card-footer">
                                <span className="project-owner">
                                    👤 {project.owner?.fullName || project.owner?.email || 'Unknown'}
                                </span>
                                <span className="project-date">
                                    📅 {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
