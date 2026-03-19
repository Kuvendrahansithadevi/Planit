// --- 1. AUTH & USER DATA ---
const currentUserId = localStorage.getItem('userId'); 
const currentUserName = localStorage.getItem('userName');
let selectedDate = new Date(); 
let allTasks = []; 

if (!currentUserId || currentUserId === "undefined") {
    window.location.href = 'login.html';
}

const userDisplay = document.getElementById('userNameDisplay');
if(userDisplay) userDisplay.innerText = `Hello ${currentUserName || 'User'}`;

const miniDayEl = document.getElementById('miniDay');
if(miniDayEl) miniDayEl.innerText = new Date().getDate();

// --- 2. TASK LOGIC (FETCH & FILTER) ---

async function fetchTasks() {
    try {
        const response = await fetch(`/api/tasks/${currentUserId}`);
        allTasks = await response.json();

        renderCalendar();
        renderFilteredTasks(); 
    } catch (err) {
        console.error("Error fetching tasks:", err);
    }
}

function renderFilteredTasks() {
    const dateStr = selectedDate.toDateString();
    const filtered = allTasks.filter(t => new Date(t.dueDate).toDateString() === dateStr);
    
    const pending = filtered.filter(t => t.status === 'pending');
    const completed = filtered.filter(t => t.status === 'completed');

    updateDashboardUI(pending, completed, filtered.length);
}

function updateDashboardUI(pending, completed, totalOnDate) {
    const summaryEl = document.getElementById('taskSummary');
    if(summaryEl) summaryEl.innerText = `You got ${pending.length} tasks for this day.`;

    const progressEl = document.getElementById('progressPercent');
    const totalAll = allTasks.length;
    const completedAll = allTasks.filter(t => t.status === 'completed').length;
    
    if(progressEl) {
        const percent = totalAll > 0 ? Math.round((completedAll / totalAll) * 100) : 0;
        progressEl.innerText = `${percent}%`;
        
        const circle = document.querySelector('.circle-content'); 
        if(circle) {
            circle.style.background = `conic-gradient(#43a886 ${percent * 3.6}deg, #f0f0f0 0deg)`;
        }
    }

    const pendingList = document.getElementById('pendingTasksList');
    if(pendingList) pendingList.innerHTML = pending.length ? pending.map(t => createTaskHTML(t, true)).join('') : '<p>No pending tasks</p>';

    const completedList = document.getElementById('completedTasksList');
    if(completedList) completedList.innerHTML = completed.length ? completed.map(t => createTaskHTML(t, false)).join('') : '<p>No completed tasks</p>';
}

function createTaskHTML(task, isPending) {
    const time = task.dueDate ? new Date(task.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'No time';
    const color = task.priority === 'high' ? '#ff4d4d' : (task.priority === 'medium' ? '#FFD700' : '#43a886');
    
    return `
        <div class="task-item">
            <div class="task-dot" style="background: ${color}"></div>
            <div class="task-info">
                <b contenteditable="true" onblur="handleEdit('${task._id}', this.innerText)">${task.title}</b>
                <span>${time}</span>
            </div>
            <div class="task-actions">
                <button class="action-btn" onclick="handleToggleStatus('${task._id}')">${isPending ? '✔' : '↩'}</button>
                <button class="action-btn" onclick="window.goToEditPage('${task._id}')">✏️</button>
                <button class="action-btn delete-btn" onclick="handleDelete('${task._id}')">🗑️</button>
            </div>
        </div>
    `;
}

// --- 3. ACTIONS (EDIT, DELETE, TOGGLE) ---

// Browser ki ee function kanipinchela window object ki assign chestunnam
window.goToEditPage = function(taskId) {
    const task = allTasks.find(t => t._id === taskId);
    if (!task) return;

    const modal = document.getElementById('addTaskModal');
    const titleInput = document.getElementById('taskTitle');
    const priorityInput = document.getElementById('taskPriority');
    const timeInput = document.getElementById('taskTime');
    const submitBtn = document.getElementById('addTaskBtn');

    if (modal && titleInput) {
        // Modal lo values nimpu
        titleInput.value = task.title;
        if (priorityInput) priorityInput.value = task.priority || 'medium';
        
        if (task.dueDate && timeInput) {
            const d = new Date(task.dueDate);
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            timeInput.value = `${hours}:${minutes}`;
        }

        submitBtn.innerText = "Update Task";
        
        submitBtn.onclick = async (e) => {
            e.preventDefault();
            
            // Time and Date sync cheyadam
            const originalDate = new Date(task.dueDate);
            if (timeInput && timeInput.value) {
                const [h, m] = timeInput.value.split(':');
                originalDate.setHours(h, m);
            }

            // Object structure ni backend ki thaggattu pampali
            const updatedData = {
                title: titleInput.value,
                priority: priorityInput ? priorityInput.value : task.priority,
                dueDate: originalDate.toISOString()
            };

            console.log("Updating with:", updatedData); // Console lo check chey update ayye mundu
            await handleEdit(taskId, updatedData);
            modal.style.display = 'none';
        };

        modal.style.display = 'block';
    }
};

async function handleToggleStatus(taskId) {
    await fetch(`/api/tasks/${taskId}/toggle`, { method: 'PATCH' });
    fetchTasks(); 
}

async function handleDelete(taskId) {
    if(confirm("Are you sure you want to delete this task?")) {
        await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
        fetchTasks();
    }
}

async function handleEdit(taskId, updatedData) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(updatedData) // Ikada 'updatedData' motham pampali
        });

        if (response.ok) {
            console.log("Database Update Success!");
            await fetchTasks(); // Frontend refresh
        } else {
            console.error("Database Update Failed");
        }
    } catch (err) {
        console.error("Error:", err);
    }
}
function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// --- 4. CALENDAR LOGIC (INTERACTIVE) ---

const monthYearDisplay = document.getElementById("monthYear");
const daysBox = document.getElementById("days");
let calendarDate = new Date();

function renderCalendar(){
    if(!monthYearDisplay || !daysBox) return;

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    monthYearDisplay.innerText = months[month] + " " + year;
    daysBox.innerHTML = "";

    for(let i=0; i<firstDay; i++) daysBox.innerHTML += "<div></div>";
    
    for(let day=1; day<=lastDate; day++){
        const isToday = (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) ? 'today' : '';
        const isSelected = (day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) ? 'selected-day' : '';
         
        const currentLoopDate = new Date(year,month,day).toDateString();
        const dayTasks = allTasks.filter(t=>new Date(t.dueDate).toDateString()===currentLoopDate);

        let statusClass="";

        if(dayTasks.length>0){
            const hasPending = dayTasks.some(t=>t.status==='pending');
            statusClass = hasPending ? 'incomplete' : 'completed';
        }
        const dayEl = document.createElement('div');
        dayEl.className = `day ${statusClass} ${isToday} ${isSelected}`;
        dayEl.innerText = day;
        
        dayEl.onclick = () => {
            selectedDate = new Date(year, month, day);
            renderCalendar();
            renderFilteredTasks();
        };
        
        daysBox.appendChild(dayEl);
    }
}

const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");

if (btnPrev) {
    btnPrev.onclick = () => {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        renderCalendar();
    };
}

if (btnNext) {
    btnNext.onclick = () => {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        renderCalendar();
    };
}

setInterval(() => {
    const ft = document.getElementById("fullDate");
    const lt = document.getElementById("liveTime");
    if(ft) ft.innerText = new Date().toDateString();
    if(lt) lt.innerText = new Date().toLocaleTimeString();
}, 1000);

const sliderPrev = document.querySelector('.slider-btn.prev');
const sliderNext = document.querySelector('.slider-btn.next');
const sliderWrapper = document.getElementById('sliderWrapper'); // Ee ID nee HTML lo undali
const slides = document.querySelectorAll('.task-card');

let currentSlide = 0;

if (sliderPrev && sliderNext && sliderWrapper) {
    // Next Button Logic
    sliderNext.onclick = () => {
        currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
        updateSlider();
    };

    // Prev Button Logic - Ikkada infinite loop pettamu
    sliderPrev.onclick = () => {
        currentSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1;
        updateSlider();
    };
}

function updateSlider() {
    if (sliderWrapper) {
        const offset = -currentSlide * 100;
        sliderWrapper.style.transform = `translateX(${offset}%)`;
    }
}

// Initial Load
renderCalendar();
fetchTasks();