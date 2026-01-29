import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROJECT, CREATE_TASK, UPDATE_TASK, DELETE_TASK, GET_USERS } from '../graphql/queries';

export default function ProjectDetail({ projectId, onBack }) {
    const { loading: projectLoading, error: projectError, data: projectData, refetch } = useQuery(GET_PROJECT, {
        variables: { id: projectId },
        pollInterval: 5000,
    });

    const { data: userData } = useQuery(GET_USERS);

    const [createTask] = useMutation(CREATE_TASK, {
        onCompleted: () => {
            refetch();
            setNewTaskTitle('');
            setNewTaskAssignee('');
            setShowTaskForm(false);
        }
    });

    const [updateTask] = useMutation(UPDATE_TASK, {
        onCompleted: () => refetch()
    });

    const [deleteTask] = useMutation(DELETE_TASK, {
        onCompleted: () => refetch()
    });

    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState('TODO');
    const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
    const [newTaskAssignee, setNewTaskAssignee] = useState('');

    if (projectLoading) return <div className="loading-screen">Loading project...</div>;
    if (projectError) return <div className="error-screen">Error: {projectError.message}</div>;
    if (!projectData?.project) return <div className="error-screen">Project not found</div>;

    const { project } = projectData;
    const users = userData?.users || [];

    const handleCreateTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        createTask({
            variables: {
                projectId,
                title: newTaskTitle,
                status: newTaskStatus,
                priority: newTaskPriority,
                assigneeId: newTaskAssignee || null
            }
        });
    };

    const handleUpdateTask = (taskId, fields) => {
        updateTask({
            variables: { id: taskId, ...fields }
        });
    };

    const handleDeleteTask = (taskId) => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask({ variables: { id: taskId } });
        }
    };

    // Group tasks by status
    const tasksByStatus = {
        BACKLOG: [],
        TODO: [],
        DOING: [],
        DONE: []
    };

    project.tasks.forEach(task => {
        if (tasksByStatus[task.status]) {
            tasksByStatus[task.status].push(task);
        }
    });

    return (
        <div className="project-detail">
            <div className="project-header">
                <button onClick={onBack} className="back-button">← Back to Projects</button>
                <div className="project-title-section">
                    <h2>{project.name}</h2>
                    <span className="project-badge">{project.tasks.length} tasks</span>
                </div>
                <p className="project-description">{project.description}</p>
            </div>

            <div className="kanban-board">
                {Object.entries(tasksByStatus).map(([status, tasks]) => (
                    <div key={status} className={`kanban-column status-${status.toLowerCase()}`}>
                        <h3 className="column-header">
                            {status} <span className="count">{tasks.length}</span>
                        </h3>

                        <div className="task-list">
                            {tasks.map(task => (
                                <div key={task.id} className="task-card">
                                    <div className="task-header">
                                        <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                                            {task.priority}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="delete-task-btn"
                                            title="Delete task"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <h4 className="task-title">{task.title}</h4>

                                    <div className="task-meta">
                                        <div className="task-assignee">
                                            <label>Assignee:</label>
                                            <select
                                                value={task.assignee?.id || ''}
                                                onChange={(e) => handleUpdateTask(task.id, { assigneeId: e.target.value || null })}
                                                className="mini-select"
                                            >
                                                <option value="">Unassigned</option>
                                                {users.map(user => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.fullName || user.email}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="task-actions">
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleUpdateTask(task.id, { status: e.target.value })}
                                            className="status-select"
                                        >
                                            <option value="BACKLOG">Backlog</option>
                                            <option value="TODO">To Do</option>
                                            <option value="DOING">Doing</option>
                                            <option value="DONE">Done</option>
                                        </select>
                                    </div>
                                </div>
                            ))}

                            {tasks.length === 0 && (
                                <div className="empty-column">No tasks</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="add-task-container">
                {showTaskForm ? (
                    <form onSubmit={handleCreateTask} className="add-task-form">
                        <h3>New Task</h3>
                        <input
                            type="text"
                            placeholder="Task title..."
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            autoFocus
                            required
                        />
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    value={newTaskStatus}
                                    onChange={(e) => setNewTaskStatus(e.target.value)}
                                >
                                    <option value="BACKLOG">Backlog</option>
                                    <option value="TODO">To Do</option>
                                    <option value="DOING">Doing</option>
                                    <option value="DONE">Done</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Priority</label>
                                <select
                                    value={newTaskPriority}
                                    onChange={(e) => setNewTaskPriority(e.target.value)}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="URGENT">Urgent</option>
                                </select>
                            </div>
                            <div className="form-group full-width">
                                <label>Assignee</label>
                                <select
                                    value={newTaskAssignee}
                                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                                >
                                    <option value="">Unassigned</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.fullName || user.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="save-btn">Create</button>
                            <button type="button" onClick={() => setShowTaskForm(false)} className="cancel-btn">Cancel</button>
                        </div>
                    </form>
                ) : (
                    <button onClick={() => setShowTaskForm(true)} className="add-task-fab">
                        + Add Task
                    </button>
                )}
            </div>
        </div>
    );
}
