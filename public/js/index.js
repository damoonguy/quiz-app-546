// Client-side JS for uploading, taking, saving quizzes + other functionality
const searchQuizzes = async (searchTerm) => {
    try {
      const response = await axios.get(`/api/quizzes/search?term=${searchTerm}`);
      displayQuizzes(response.data);
    } catch (error) {
      console.error('Error searching quizzes:', error);
      showError('Failed to search quizzes');
    }
  };
  
  const displayQuizzes = (quizzes) => {
    const quizContainer = document.getElementById('quiz-list');
    quizContainer.innerHTML = '';
  
    quizzes.forEach(quiz => {
      const quizCard = document.createElement('div');
      quizCard.className = 'quiz-card';

      const title = document.createElement('h3');
      title.textContent = quiz.title;
      quizCard.appendChild(title);

      const description = document.createElement('p');
      description.textContent = quiz.description;
      quizCard.appendChild(description);

      const metaDiv = document.createElement('div');
      metaDiv.className = 'quiz-meta';
      
      const creatorSpan = document.createElement('span');
      creatorSpan.textContent = 'By: ${quiz.creator}';
      metaDiv.appendChild(creatorSpan);

      const questionSpan = document.createElement('span');
      questionSpan.textContent = 'Questions: ${quiz.questionCount}';
      metaDiv.appendChild(questionSpan);
      
      quizCard.appendChild(metaDiv);

      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'quiz-actions';

      const startButton = document.createElement('button');
      startButton.className = 'btn-primary';
      startButton.textContent = 'Start Quiz';
      startButton.addEventListener('click', () => startQuiz(quiz._id));

      const saveButton = document.createElement('button');
      saveButton.className = 'btn-secondary';
      saveButton.textContent = 'Save for Later';
      saveButton.addEventListener('click', () => saveForLater(quiz._id));

      actionsDiv.appendChild(startButton);
      actionsDiv.appendChild(saveButton);
      quizCard.appendChild(actionsDiv);

      quizContainer.appendChild(quizCard);
    });
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('quiz-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            if (searchTimeout) clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => searchQuizzes(e.target.value), 300);
        });
    }
  });
  
  let searchTimeout = null;
  
  async function saveForLater(quizId) {
    try {
        const response = await fetch('/quiz/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quizId })
        });

        if (!response.ok) {
            throw new Error('Failed to save quiz');
        }

        alert('Quiz saved successfully!');
    } catch (error) {
        console.error('Error saving quiz:', error);
        alert('Failed to save quiz');
    }
  }
  
  async function removeSaved(quizId) {
    try {
        const response = await fetch('/quiz/unsave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quizId })
        });

        if (!response.ok) {
            throw new Error('Failed to remove quiz');
        }
        window.location.reload(); // refresh
    } catch (error) {
        console.error('Error removing quiz:', error);
        alert('Failed to remove quiz');
    }
  }
  
  async function deleteQuiz(quizId) {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`/quiz/${quizId}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete quiz');
        }

        window.location.reload();
    } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Failed to delete quiz');
    }
}

  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('quiz-search');
    const searchButton = document.getElementById('search-button');

    if (searchButton && searchInput) {
        let debounceTimeout;

        const performSearch = async () => {
            try {
                const searchTerm = searchInput.value.trim();
                const response = await fetch(`/api/quizzes/search?term=${encodeURIComponent(searchTerm)}`);
                
                if (!response.ok) {
                    throw new Error('Search failed');
                }

                const quizzes = await response.json();
                const quizGrid = document.querySelector('.quiz-grid');
                
                if (!quizGrid) return;
                
                quizGrid.innerHTML = '';

                if (quizzes.length === 0) {
                    quizGrid.innerHTML = '<div class="no-results">No quizzes found</div>';
                    return;
                }

                quizzes.forEach(quiz => {
                    const quizCard = document.createElement('div');
                    quizCard.className = 'quiz-card';
                    quizCard.innerHTML = `
                        <h3>${quiz.title}</h3>
                        <p>${quiz.description}</p>
                        <div class="quiz-meta">
                            <span>Questions: ${quiz.questionCount}</span>
                            <span>Category: ${quiz.category}</span>
                        </div>
                        <div class="quiz-actions">
                            <button class="btn-primary" onclick="window.location.href='/quiz/${quiz._id}'">Take Quiz</button>
                            <button class="btn-secondary" onclick="saveForLater('${quiz._id}')">Save for Later</button>
                        </div>
                    `;
                    quizGrid.appendChild(quizCard);
                });
            } catch (error) {
                console.error('Search error:', error);
                alert('Failed to search quizzes');
            }
        };
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(performSearch, 300);
        });

        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch();
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }
});
