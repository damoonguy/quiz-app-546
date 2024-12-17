document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('admin-quiz-search');
    const searchButton = document.getElementById('admin-search-button');

    if (searchButton && searchInput) {
        let debounceTimeout;

        const performSearch = async () => {
            try {
                const searchTerm = searchInput.value.trim();
                const response = await fetch(`/api/admin/quizzes/search?term=${encodeURIComponent(searchTerm)}`);
                
                if (!response.ok) {
                    throw new Error('Search failed');
                }

                const quizzes = await response.json();
                const quizGrid = document.getElementById('admin-quiz-list');
                
                if (!quizGrid) return;
                
                quizGrid.innerHTML = '';

                if (quizzes.length === 0) {
                    const noResults = document.createElement('div');
                    noResults.className = 'no-results';
                    noResults.textContent = 'No quizzes found';
                    quizGrid.appendChild(noResults);
                    return;
                }

                quizzes.forEach(quiz => {
                    const quizCard = document.createElement('div');
                    quizCard.className = 'quiz-card';

                    const title = document.createElement('h3');
                    title.textContent = quiz.title;
                    quizCard.appendChild(title);

                    const metaDiv = document.createElement('div');
                    metaDiv.className = 'quiz-meta';

                    const creatorSpan = document.createElement('span');
                    creatorSpan.textContent = `Created by: ${quiz.creator}`;
                    metaDiv.appendChild(creatorSpan);

                    const categorySpan = document.createElement('span');
                    categorySpan.textContent = `Category: ${quiz.category}`;
                    metaDiv.appendChild(categorySpan);

                    const questionSpan = document.createElement('span');
                    questionSpan.textContent = `Questions: ${quiz.questionCount}`;
                    metaDiv.appendChild(questionSpan);

                    quizCard.appendChild(metaDiv);

                    const statsDiv = document.createElement('div');
                    statsDiv.className = 'quiz-stats';

                    const takenSpan = document.createElement('span');
                    takenSpan.textContent = `Times Taken: ${quiz.timesTaken}`;
                    statsDiv.appendChild(takenSpan);

                    const scoreSpan = document.createElement('span');
                    scoreSpan.textContent = `Avg Score: ${quiz.averageScore}%`;
                    statsDiv.appendChild(scoreSpan);

                    quizCard.appendChild(statsDiv);

                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'action-buttons';

                    const viewButton = document.createElement('button');
                    viewButton.className = 'btn-primary';
                    viewButton.textContent = 'View';
                    viewButton.addEventListener('click', () => viewQuiz(quiz._id));

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'btn-danger';
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => deleteQuiz(quiz._id));

                    actionsDiv.appendChild(viewButton);
                    actionsDiv.appendChild(deleteButton);
                    quizCard.appendChild(actionsDiv);

                    quizGrid.appendChild(quizCard);
                });
            } catch (error) {
                console.error('Search error:', error);
                alert('Failed to search quizzes');
            }
        };

        searchInput.addEventListener('input', () => {
            if (debounceTimeout) clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(performSearch, 300);
        });

        searchButton.addEventListener('click', performSearch);
    }
});

async function viewQuiz(quizId) {
    window.location.href = `/quiz/${quizId}/review`;
}