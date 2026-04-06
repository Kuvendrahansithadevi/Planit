const userId = localStorage.getItem('userId');

async function initProfile() {
    try {
        // 1. User basic info load cheyadam
        const response = await fetch(`/api/user/profile/${userId}`);
        const userData = await response.json();

        document.getElementById('userName').innerText = userData.name || "K. Hansitha Devi";
        document.getElementById('userEmail').innerText = userData.email || "hansithakuvendra@gmail.com";

        // 2. Tasks data load cheyadam (Dashboard logic laage)
        const taskRes = await fetch(`/api/tasks/${userId}`);
        const allTasks = await taskRes.json();

        if (allTasks && allTasks.length > 0) {
            // Manual calculation if stats object is missing
            const completed = allTasks.filter(t => t.status === 'completed').length;
            const remaining = allTasks.filter(t => t.status === 'pending').length;
            const total = allTasks.length;
            const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;

            // UI Update
            document.getElementById('countCompleted').innerText = `${completed} Tasks`;
            document.getElementById('productivityPercent').innerText = `${productivity}%`;
            document.getElementById('countRemaining').innerText = `${remaining} Tasks`;
        } else {
            // Data lekapothe 0 chupinchali
            document.getElementById('countCompleted').innerText = "0 Tasks";
            document.getElementById('productivityPercent').innerText = "0%";
            document.getElementById('countRemaining').innerText = "0 Tasks";
        }

    } catch (err) { 
        console.error("Profile Data Error:", err);
    }
}

// Modal and Edit Button Logic
const modal = document.getElementById('editProfileModal');
const openBtn = document.getElementById('openEditModal');

if(openBtn) {
    openBtn.onclick = () => {
        document.getElementById('inputName').value = document.getElementById('userName').innerText;
        modal.style.display = 'block';
    };
}

function closeModal() {
    modal.style.display = 'none';
}

// Save logic update
document.getElementById('saveProfile').onclick = async () => {
    const updatedUser = { username: document.getElementById('inputName').value };
    try {
        const res = await fetch(`/api/user/profile/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser)
        });
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('userName', data.username);
            closeModal();
            initProfile(); 
        }
    } catch (err) { alert("Update failed!"); }
};

initProfile();