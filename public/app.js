document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const tasksList = document.getElementById('tasksList');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskModal = document.getElementById('taskModal');
    const closeBtns = document.querySelectorAll('.close-btn, .close-btn-secondary');
    const taskForm = document.getElementById('taskForm');
    const modalTitle = document.getElementById('modalTitle');
    const statusFilter = document.getElementById('statusFilter');
    
    const totalTasksCount = document.getElementById('totalTasksCount');
    const totalTimeLogged = document.getElementById('totalTimeLogged');

    // Form inputs
    const taskIdInput = document.getElementById('taskId');
    const titleInput = document.getElementById('taskTitle');
    const descInput = document.getElementById('taskDescription');
    const timeInput = document.getElementById('taskTime');
    const statusInput = document.getElementById('taskStatus');

    let tasks = [];
    const API_URL = '/api/tasks';

    // Initialize
    fetchTasks();

    // Event Listeners
    addTaskBtn.addEventListener('click', openAddModal);
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            closeModal();
        }
    });

    taskForm.addEventListener('submit', handleTaskSubmit);
    statusFilter.addEventListener('change', renderTasks);

    // Functions
    async function fetchTasks() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch tasks');
            tasks = await response.json();
            renderTasks();
            updateStats();
        } catch (error) {
            console.error('Error:', error);
            tasksList.innerHTML = `<div class="empty-state">Failed to load tasks. Please try again.</div>`;
        }
    }

    function renderTasks() {
        const filterValue = statusFilter.value;
        const filteredTasks = filterValue === 'all' 
            ? tasks 
            : tasks.filter(task => task.status === filterValue);

        if (filteredTasks.length === 0) {
            tasksList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-clipboard-list" style="font-size: 3rem; margin-bottom: 1rem; color: #475569;"></i>
                    <p>No tasks found. Create a new task to get started!</p>
                </div>`;
            return;
        }

        tasksList.innerHTML = filteredTasks.map(task => `
            <div class="task-card ${task.status}">
                <div class="task-header">
                    <h3 class="task-title">${escapeHTML(task.title)}</h3>
                    <span class="status-badge status-${task.status}">${formatStatus(task.status)}</span>
                </div>
                <p class="task-desc">${escapeHTML(task.description || 'No description provided.')}</p>
                <div class="task-footer">
                    <div class="task-time">
                        <i class="fa-regular fa-clock"></i>
                        <span>${formatTime(task.timeSpent)}</span>
                    </div>
                    <div class="task-actions">
                        <button class="icon-btn edit-btn" onclick="editTask('${task._id}')" title="Edit">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="icon-btn delete delete-btn" onclick="deleteTask('${task._id}')" title="Delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function updateStats() {
        totalTasksCount.textContent = tasks.length;
        
        const totalMinutes = tasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0);
        totalTimeLogged.textContent = formatTime(totalMinutes);
    }

    async function handleTaskSubmit(e) {
        e.preventDefault();
        
        const taskData = {
            title: titleInput.value.trim(),
            description: descInput.value.trim(),
            timeSpent: parseInt(timeInput.value) || 0,
            status: statusInput.value
        };

        const id = taskIdInput.value;
        
        try {
            let response;
            if (id) {
                // Update
                response = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });
            } else {
                // Create
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });
            }

            if (!response.ok) throw new Error('Failed to save task');
            
            closeModal();
            fetchTasks(); // Refresh list
        } catch (error) {
            console.error('Error saving task:', error);
            alert('Failed to save task. Please try again.');
        }
    }

    window.editTask = (id) => {
        const task = tasks.find(t => t._id === id);
        if (!task) return;

        modalTitle.textContent = 'Edit Task';
        taskIdInput.value = task._id;
        titleInput.value = task.title;
        descInput.value = task.description || '';
        timeInput.value = task.timeSpent || 0;
        statusInput.value = task.status;

        taskModal.classList.add('show');
    };

    window.deleteTask = async (id) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete task');
            
            fetchTasks(); // Refresh list
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task.');
        }
    };

    function openAddModal() {
        taskForm.reset();
        taskIdInput.value = '';
        modalTitle.textContent = 'Add New Task';
        statusInput.value = 'pending';
        taskModal.classList.add('show');
        titleInput.focus();
    }

    function closeModal() {
        taskModal.classList.remove('show');
    }

    // Helpers
    function formatTime(minutes) {
        if (!minutes) return '0m';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        if (h === 0) return `${m}m`;
        if (m === 0) return `${h}h`;
        return `${h}h ${m}m`;
    }

    function formatStatus(status) {
        if (status === 'in-progress') return 'In Progress';
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
