const userId = localStorage.getItem('userId');

// 1. Profile Data Load Cheyadam
async function initProfile() {
    try {
        const response = await fetch(`/api/user/profile/${userId}`);
        const data = await response.json();

        // Database logic check
        const displayName = data.name || localStorage.getItem('userName') || "K. Hansitha Devi"; //
        document.getElementById('userName').innerText = displayName;

        document.getElementById('userEmail').innerText = data.email;
        document.getElementById('userPhone').innerText = data.phone;
        
        // Stats update
        document.getElementById('countCompleted').innerText = `${data.stats.completed} Tasks`;
        document.getElementById('productivityPercent').innerText = `${data.stats.productivity}%`;
        document.getElementById('countRemaining').innerText = `${data.stats.remaining} Tasks`;
    } catch (err) { console.error(err); }
}

// 2. Modal Controls
const modal = document.getElementById('editProfileModal');
document.getElementById('openEditModal').onclick = () => {
    document.getElementById('inputName').value = document.getElementById('userName').innerText;
    document.getElementById('inputPhone').value = document.getElementById('userPhone').innerText;
    modal.style.display = 'block';
};

function closeModal() {
    modal.style.display = 'none';
}

// 3. Backend Update (Save Changes)
document.getElementById('saveProfile').onclick = async () => {
    const updatedUser = {
        username: document.getElementById('inputName').value,
        phone: document.getElementById('inputPhone').value
    };

    try {
        const res = await fetch(`/api/user/profile/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser)
        });

        if (res.ok) {
            const data = await res.json();
            // Update local storage so dashboard also updates
            localStorage.setItem('userName', data.username);
            closeModal();
            initProfile(); // Reload UI
        }
    } catch (err) {
        alert("Update failed!");
    }
};

// Start
initProfile();