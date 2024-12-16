let searchTimeout = null;

function displayUsers(users) {
    const usersGrid = document.getElementById('users-grid');
    usersGrid.innerHTML = '';

    if (users.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'No users found';
        usersGrid.appendChild(noResults);
        return;
    }

    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'stat-card user-card';
        userCard.dataset.userId = user._id;

        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';

        const username = document.createElement('h3');
        username.textContent = user.username;
        userInfo.appendChild(username);

        const userStats = document.createElement('div');
        userStats.className = 'user-stats';

        const quizzesStat = document.createElement('div');
        quizzesStat.className = 'stat';
        
        const quizzesLabel = document.createElement('span');
        quizzesLabel.className = 'label';
        quizzesLabel.textContent = 'Quizzes Taken:';
        
        const quizzesValue = document.createElement('span');
        quizzesValue.className = 'value';
        quizzesValue.textContent = user.quizzesTaken || 0;

        quizzesStat.appendChild(quizzesLabel);
        quizzesStat.appendChild(quizzesValue);

        const scoreStat = document.createElement('div');
        scoreStat.className = 'stat';
        
        const scoreLabel = document.createElement('span');
        scoreLabel.className = 'label';
        scoreLabel.textContent = 'Average Score:';
        
        const scoreValue = document.createElement('span');
        scoreValue.className = 'value';
        scoreValue.textContent = `${user.averageScore || 0}%`;

        scoreStat.appendChild(scoreLabel);
        scoreStat.appendChild(scoreValue);

        userStats.appendChild(quizzesStat);
        userStats.appendChild(scoreStat);
        userInfo.appendChild(userStats);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'card-actions';

        const banButton = document.createElement('button');
        banButton.className = 'btn-danger';
        banButton.textContent = 'Ban User';
        banButton.onclick = () => banUser(user._id);

        actionsDiv.appendChild(banButton);
        userCard.appendChild(userInfo);
        userCard.appendChild(actionsDiv);
        usersGrid.appendChild(userCard);
    });
}

async function searchUsers(searchTerm) {
    try {
        const response = await fetch(`/api/users/search?term=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error('Search failed');
        
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error searching users:', error);
    }
}

async function banUser(userId) {
    if (!confirm('Are you sure you want to ban this user?')) {
        return;
    }
    
    try {
        const response = await fetch(`/admin/api/users/${userId}/ban`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        if (response.status === 401) {
            alert('You have to be an admin!');
            window.location.href = '/login';
            return;
        }
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to ban user');
        }
        
        const userCard = document.querySelector(`[data-user-id="${userId}"]`);
        if (userCard) {
            userCard.remove();
        }

        alert('User has been banned successfully');
        
    } catch (error) {
        console.error('Error banning user:', error);
        if (error.message === 'Failed to ban user') {
            alert('Failed to ban user. Please try again.');
        } else {
            alert(error.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.ban-user-btn').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.dataset.userId;
            banUser(userId);
        });
    });

    const searchInput = document.getElementById('user-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            if (searchTimeout) clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => searchUsers(e.target.value), 300);
        });
    }

    searchUsers('');
}); 