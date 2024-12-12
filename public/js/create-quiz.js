document.addEventListener("DOMContentLoaded", () => {
    const quizSetupForm = document.getElementById("quiz-setup-form");
    const generateQuestionsBtn = document.getElementById("generate-questions-btn");
    const quizForm = document.getElementById("quiz-form");
    const questionsContainer = document.getElementById("questions-container");
  
    // Event listener to generate question inputs
    generateQuestionsBtn.addEventListener("click", () => {
      const numberOfQuestions = parseInt(document.getElementById("number-of-questions").value, 10);
        console.log(numberOfQuestions);
      if (isNaN(numberOfQuestions) || numberOfQuestions <= 0) {
        alert("Please enter a valid number of questions!");
        return;
      }
  
      // Clear any existing questions
      questionsContainer.innerHTML = "";
  
      // Generate input fields for the specified number of questions
      for (let i = 0; i < numberOfQuestions; i++) {
        const questionGroup = document.createElement("div");
        questionGroup.classList.add("question-group");
  
        questionGroup.innerHTML = `
          <h3>Question ${i + 1}</h3>
          <label for="question-${i}">Question</label>
          <input
            type="text"
            id="question-${i}"
            name="questions[${i}][text]"
            placeholder="Enter question text"
            required
          />
          <label>Options (select the correct answer)</label>
          ${[1, 2, 3, 4]
            .map(
              (optionNumber) => `
              <div class="option">
                <input
                  type="text"
                  name="questions[${i}][options][]"
                  placeholder="Option ${optionNumber}"
                  required
                />
                <input
                  type="radio"
                  name="questions[${i}][correctAnswer]"
                  value="${optionNumber - 1}"
                  required
                />
                Correct
              </div>`
            )
            .join("")}
        `;
  
        questionsContainer.appendChild(questionGroup);
      }
  
      // Hide the setup form and show the quiz form
      quizSetupForm.style.display = "none";
      quizForm.style.display = "block";
    });
  });

