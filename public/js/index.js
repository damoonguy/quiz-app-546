// Client-side JS for uploading, taking, saving quizzes + other functionality
const searchQuizzes = async (searchTerm) => {
    try {
      const response = await fetch(`/api/quizzes/search?term=${searchTerm}`);
      console.log(response)
      const data = await response.json()
      console.log(data)
      displayQuizzes(data.quizzes);
    } catch (error) {
      console.error('Error searching quizzes:', error);
    }
  };
  
const startQuiz = async (id) => {
    const res = await fetch(`/quiz/${id}`)
    return;
}

  const displayQuizzes = (quizzes) => {
    const quizContainer = document.getElementById('quiz-grid');
    console.log(quizContainer)
    quizContainer.innerHTML = '';
    

    for (let i in quizzes) {
      const quiz = quizzes[i]
      console.log(quiz)
      const quizCard = document.createElement('div');
      quizCard.className = 'quiz-card';

      const title = document.createElement('h3');
      title.innerText = quiz.title;
      quizCard.appendChild(title);

      const description = document.createElement('p');
      description.innerText = quiz.description;
      quizCard.appendChild(description);

      const metaDiv = document.createElement('div');
      metaDiv.className = 'quiz-meta';

      const questionSpan = document.createElement('span');
      questionSpan.innerText = `Questions: ${quiz.questionCount}`;
      metaDiv.appendChild(questionSpan);
      
      quizCard.appendChild(metaDiv);

      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'quiz-actions';

      const startButton = document.createElement('button');
      startButton.className = 'btn-primary';
      startButton.textContent = 'Start Quiz';
      startButton.addEventListener('click', () => startQuiz(quiz._id.toString()));

      const saveButton = document.createElement('button');
      saveButton.className = 'btn-secondary';
      saveButton.textContent = 'Save for Later';
      saveButton.addEventListener('click', () => saveForLater(quiz._id));

      actionsDiv.appendChild(startButton);
      actionsDiv.appendChild(saveButton);
      quizCard.appendChild(actionsDiv);

      quizContainer.appendChild(quizCard);
    };
  };
  

  
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

        alert('Quiz saved successfully, please refresh the page!');
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
            method: 'DELETE',
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
        

        const performSearch = async (query) => {
            try {
                const searchTerm = query.trim();
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

                for (let i in quizzes) {
                    const quiz = quizzes[i]
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
                };
            } catch (error) {
                console.error('Search error:', error);
                alert('Failed to search quizzes');
            }
        };
        
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            const query = document.getElementById('quiz-search').value
            searchQuizzes(query);
        });
    }
});