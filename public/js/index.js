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