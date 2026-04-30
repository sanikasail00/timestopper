const API_URL = '/api/tasks';
const PROJECTS_API_URL = '/api/projects';

// DOM Elements
const displayHours = document.getElementById('display-hours');
const displayMinutes = document.getElementById('display-minutes');
const displaySeconds = document.getElementById('display-seconds');
const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');
const taskTitleInput = document.getElementById('task-title');
const taskColorInput = document.getElementById('task-color');
const taskProjectSelect = document.getElementById('task-project');
const tasksList = document.getElementById('tasks-list');

// Dashboard Elements
const statTotalTime = document.getElementById('stat-total-time');
const statCompletedTasks = document.getElementById('stat-completed-tasks');

// Edit Modal Elements
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-task-form');
const btnCloseModal = document.getElementById('btn-close-modal');
const editTaskProjectSelect = document.getElementById('edit-task-project');

// Manual Add Elements
const manualAddModal = document.getElementById('manual-add-modal');
const btnManualAdd = document.getElementById('btn-manual-add');
const btnCloseManual = document.getElementById('btn-close-manual');
const manualAddForm = document.getElementById('manual-add-form');
const manualTaskProjectSelect = document.getElementById('manual-task-project');

// Projects Elements
const projectsModal = document.getElementById('projects-modal');
const btnManageProjects = document.getElementById('btn-manage-projects');
const btnCloseProjects = document.getElementById('btn-close-projects');
const addProjectForm = document.getElementById('add-project-form');
const projectsListDiv = document.getElementById('projects-list');

// State
let timerInterval = null;
let startTime = null;
let elapsedSeconds = 0;
let tasks = [];
let projects = [];
let currentFilter = 'all';

// --- Utility & Dashboard Logic ---

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return {
        hours: h.toString().padStart(2, '0'),
        minutes: m.toString().padStart(2, '0'),
        seconds: s.toString().padStart(2, '0')
    };
}

function updateDashboard() {
    let totalSeconds = 0;
    let completedCount = 0;
    tasks.forEach(t => {
        totalSeconds += t.elapsed_time;
        if(t.status === 'completed') completedCount++;
    });
    
    const { hours, minutes, seconds } = formatTime(totalSeconds);
    statTotalTime.textContent = `${hours}:${minutes}:${seconds}`;
    statCompletedTasks.textContent = completedCount;
}

// --- Timer Logic ---

function updateDisplay() {
    const { hours, minutes, seconds } = formatTime(elapsedSeconds);
    displayHours.textContent = hours;
    displayMinutes.textContent = minutes;
    displaySeconds.textContent = seconds;
}

btnStart.addEventListener('click', () => {
    if (!taskTitleInput.value.trim()) {
        taskTitleInput.focus();
        taskTitleInput.classList.add('shake');
        setTimeout(() => taskTitleInput.classList.remove('shake'), 500);
        return;
    }

    startTime = new Date();
    btnStart.classList.add('hidden');
    btnStop.classList.remove('hidden');
    taskTitleInput.disabled = true;

    timerInterval = setInterval(() => {
        elapsedSeconds++;
        updateDisplay();
    }, 1000);
});

btnStop.addEventListener('click', async () => {
    clearInterval(timerInterval);
    const endTime = new Date();
    
    const newTask = {
        title: taskTitleInput.value.trim(),
        color: taskColorInput.value,
        projectId: taskProjectSelect.value || null,
        start_time: startTime,
        end_time: endTime,
        elapsed_time: elapsedSeconds,
        status: 'completed'
    };

    // Reset UI immediately
    btnStop.classList.add('hidden');
    btnStart.classList.remove('hidden');
    taskTitleInput.disabled = false;
    taskTitleInput.value = '';
    taskProjectSelect.value = '';
    elapsedSeconds = 0;
    updateDisplay();

    await createTask(newTask);
});

// --- API Logic: Tasks ---

async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        tasks = await response.json();
        renderTasks();
        updateDashboard();
    } catch (err) {
        console.error('Error fetching tasks:', err);
        tasksList.innerHTML = '<div class="error">Failed to load tasks.</div>';
    }
}

async function createTask(taskData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        const newTask = await response.json();
        
        // Populate project manually if needed for immediate display
        if (newTask.project && typeof newTask.project === 'string') {
             newTask.project = projects.find(p => p._id === newTask.project) || null;
        }
        
        tasks.unshift(newTask);
        renderTasks();
        updateDashboard();
    } catch (err) {
        console.error('Error creating task:', err);
    }
}

async function updateTask(id, updates) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        const updated = await response.json();
        
        const index = tasks.findIndex(t => t._id === id);
        if (index !== -1) {
            tasks[index] = updated;
            renderTasks();
            updateDashboard();
        }
    } catch (err) {
        console.error('Error updating task:', err);
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        tasks = tasks.filter(t => t._id !== id);
        renderTasks();
        updateDashboard();
    } catch (err) {
        console.error('Error deleting task:', err);
    }
}

// --- API Logic: Projects ---

async function fetchProjects() {
    try {
        const response = await fetch(PROJECTS_API_URL);
        projects = await response.json();
        populateProjectSelects();
    } catch (err) {
        console.error('Error fetching projects:', err);
    }
}

async function createProject(projectData) {
    try {
        const response = await fetch(PROJECTS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        const newProject = await response.json();
        projects.unshift(newProject);
        populateProjectSelects();
        renderProjectsList();
    } catch (err) {
        console.error('Error creating project:', err);
    }
}

async function deleteProject(id) {
    if (!confirm('Delete this project? (Tasks will keep their reference ID but lose project details)')) return;
    try {
        await fetch(`${PROJECTS_API_URL}/${id}`, { method: 'DELETE' });
        projects = projects.filter(p => p._id !== id);
        populateProjectSelects();
        renderProjectsList();
        fetchTasks(); // Refresh tasks to clear populated project if needed
    } catch (err) {
        console.error('Error deleting project:', err);
    }
}

function populateProjectSelects() {
    const selects = [taskProjectSelect, editTaskProjectSelect, manualTaskProjectSelect];
    selects.forEach(select => {
        const currentVal = select.value;
        select.innerHTML = '<option value="">No Project</option>';
        projects.forEach(p => {
            const option = document.createElement('option');
            option.value = p._id;
            option.textContent = p.name;
            select.appendChild(option);
        });
        select.value = currentVal; // Restore selection if still exists
    });
}

// --- Render Logic ---

function renderTasks() {
    tasksList.innerHTML = '';
    
    const filteredTasks = tasks.filter(t => {
        if (currentFilter === 'all') return true;
        return t.status === currentFilter;
    });

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 2rem;">No tasks found.</div>';
        return;
    }

    filteredTasks.forEach(task => {
        const { hours, minutes, seconds } = formatTime(task.elapsed_time);
        const timeString = task.elapsed_time > 0 ? `${hours}:${minutes}:${seconds}` : '--:--:--';
        
        let projectBadge = '';
        if (task.project) {
            projectBadge = `<span class="project-badge" style="border-bottom: 2px solid ${task.project.color}">${task.project.name}</span>`;
        }
        
        const el = document.createElement('div');
        el.className = 'task-item';
        el.style.setProperty('--task-color', task.color || '#3b82f6');
        
        el.innerHTML = `
            <div class="task-info">
                <div class="task-title">${task.title} ${projectBadge}</div>
                <div class="task-meta">
                    <span class="status-badge status-${task.status}">${task.status.replace('_', ' ')}</span>
                    <span>⏱ ${timeString}</span>
                    ${task.description ? `<span title="${task.description}">📝</span>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="action-btn edit-btn" title="Edit" onclick="openEditModal('${task._id}')">
                    ✎
                </button>
                <button class="action-btn delete-btn" title="Delete" onclick="deleteTask('${task._id}')">
                    ×
                </button>
            </div>
        `;
        tasksList.appendChild(el);
    });
}

function renderProjectsList() {
    projectsListDiv.innerHTML = '';
    if (projects.length === 0) {
        projectsListDiv.innerHTML = '<div style="color: var(--text-secondary); text-align: center;">No projects yet.</div>';
        return;
    }
    
    projects.forEach(p => {
        const div = document.createElement('div');
        div.className = 'project-item';
        div.style.setProperty('--project-color', p.color);
        div.innerHTML = `
            <div class="project-info">${p.name}</div>
            <button class="action-btn delete-btn" title="Delete" onclick="deleteProject('${p._id}')" style="width: 28px; height: 28px; font-size: 0.8rem;">×</button>
        `;
        projectsListDiv.appendChild(div);
    });
}

// --- Filtering ---
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        renderTasks();
    });
});

// --- Modal Logic: Edit Task ---
window.openEditModal = (id) => {
    const task = tasks.find(t => t._id === id);
    if (!task) return;

    document.getElementById('edit-task-id').value = task._id;
    document.getElementById('edit-task-title').value = task.title;
    document.getElementById('edit-task-desc').value = task.description || '';
    document.getElementById('edit-task-color').value = task.color || '#3b82f6';
    document.getElementById('edit-task-status').value = task.status;
    document.getElementById('edit-task-project').value = task.project ? task.project._id : '';

    editModal.classList.remove('hidden');
};

btnCloseModal.addEventListener('click', () => editModal.classList.add('hidden'));

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-task-id').value;
    const updates = {
        title: document.getElementById('edit-task-title').value,
        description: document.getElementById('edit-task-desc').value,
        color: document.getElementById('edit-task-color').value,
        status: document.getElementById('edit-task-status').value,
        projectId: document.getElementById('edit-task-project').value || null
    };

    await updateTask(id, updates);
    // After update, refetch tasks to get populated project data
    await fetchTasks();
    editModal.classList.add('hidden');
});

// --- Modal Logic: Manual Add Task ---
btnManualAdd.addEventListener('click', () => {
    document.getElementById('manual-task-title').value = '';
    document.getElementById('manual-task-hours').value = 0;
    document.getElementById('manual-task-minutes').value = 0;
    document.getElementById('manual-task-project').value = '';
    manualAddModal.classList.remove('hidden');
});

btnCloseManual.addEventListener('click', () => manualAddModal.classList.add('hidden'));

manualAddForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const h = parseInt(document.getElementById('manual-task-hours').value) || 0;
    const m = parseInt(document.getElementById('manual-task-minutes').value) || 0;
    const totalSeconds = (h * 3600) + (m * 60);
    
    const newTask = {
        title: document.getElementById('manual-task-title').value.trim(),
        color: document.getElementById('manual-task-color').value,
        projectId: document.getElementById('manual-task-project').value || null,
        elapsed_time: totalSeconds,
        status: 'completed' // Usually manual time implies completed work
    };

    await createTask(newTask);
    await fetchTasks(); // Ensure project populates
    manualAddModal.classList.add('hidden');
});

// --- Modal Logic: Manage Projects ---
btnManageProjects.addEventListener('click', () => {
    renderProjectsList();
    projectsModal.classList.remove('hidden');
});

btnCloseProjects.addEventListener('click', () => projectsModal.classList.add('hidden'));

addProjectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('new-project-name');
    const colorInput = document.getElementById('new-project-color');
    
    if(!nameInput.value.trim()) return;
    
    await createProject({
        name: nameInput.value.trim(),
        color: colorInput.value
    });
    
    nameInput.value = '';
});

// Initial Load Sequence
async function init() {
    await fetchProjects();
    await fetchTasks();
}

init();
