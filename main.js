document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = "https://opentdb.com/api.php?amount=15&category=23&difficulty=medium&type=multiple";
  
    const questionElement = document.getElementById("question");
    const answerButton = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");
    const resetButton = document.getElementById("reset-btn");
    const timerElement = document.getElementById("timer"); // Added timer element
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
  
    // Function to shuffle the answers (incorrect and correct)
    function shuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    }
  
    function startQuiz() {
      currentQuestionIndex = 0;
      score = 0;
      nextButton.style.display = "none";
      resetButton.style.display = "none";
      nextButton.innerHTML = "Next";
      resetButton.innerHTML = "Reset";
      timerElement.style.display = "none"; // Show the timer
      showInstructions();
      startTimer(); // Start the timer
    }
  
    function showInstructions() {
      questionElement.innerHTML = "Welcome to the Quiz! Click Next to start.";
      answerButton.innerHTML = "";
  
      nextButton.style.display = "block";
      nextButton.addEventListener("click", showNextQuestion);
    }
  
    function showNextQuestion() {
      clearTimeout(timer); // Clear any existing timer
  
      const result = resultsArray[currentQuestionIndex];
      const question = result.question;
      const correctAnswer = result.correct_answer;
      const incorrectAnswers = result.incorrect_answers;
  
      questionElement.innerHTML = `${currentQuestionIndex}. ${question}`;
  
      // Combine correct and incorrect answers, then shuffle them
      const allAnswers = [correctAnswer, ...incorrectAnswers];
      const shuffledAnswers = shuffle(allAnswers);
  
      // Clear previous answer buttons
      answerButton.innerHTML = "";
  
      // Create buttons for each answer
      shuffledAnswers.forEach((answer) => {
        const button = document.createElement("button");
        button.innerHTML = answer;
        button.classList.add("btn");
  
        // Add click event listener to check the answer
        button.addEventListener("click", () => checkAnswer(button, answer, correctAnswer));
  
        answerButton.appendChild(button);
      });
  
      // Start the timer for 15 seconds
      startTimer();
      nextButton.style.display = "none";
      timerElement.style.display = "flex";
    }
  
    function checkAnswer(button, selectedAnswer, correctAnswer) {
      clearTimeout(timer); // Clear the timer
  
      // Disable all buttons after an answer is clicked
      disableButtons();
  
      if (selectedAnswer === correctAnswer) {
        // Correct answer: turn the button green
        button.classList.add("correct");
        score++;
      } else {
        // Wrong answer: turn the button red
        button.classList.add("wrong");
  
        // Show the correct answer after a brief delay
        setTimeout(() => {
          revealCorrectAnswer(correctAnswer);
        }, 1000); // Adjust the delay (in milliseconds) as needed
      }
  
      // Show the next button
      nextButton.style.display = "block";
    }
  
    function revealCorrectAnswer(correctAnswer) {
      const buttons = document.getElementsByClassName("btn");
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].innerHTML === correctAnswer) {
          // Highlight the correct answer
          buttons[i].classList.add("correct");
        }
      }
      // Disable buttons after revealing the correct answer
      disableButtons();
      // Show the next button
      nextButton.style.display = "block";
    }
  
    function disableButtons() {
      // Disable all buttons
      const buttons = document.getElementsByClassName("btn");
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
      }
    }
  
    function enableButtons() {
      // Enable all buttons
      const buttons = document.getElementsByClassName("btn");
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
      }
    }
  
    function nextQuestion() {
      // Move to the next question or end the quiz
      currentQuestionIndex++;
      if (currentQuestionIndex < resultsArray.length) {
        showNextQuestion();
        // Enable buttons for the new question
        enableButtons();
        // Hide the next button again
        nextButton.style.display = "none";
      } else {
        endQuiz();
      }
    }
  
    function endQuiz() {
      // Display the score page with additional information
      questionElement.innerHTML = `Your score: ${score} out of ${resultsArray.length}`;
      answerButton.innerHTML = "";
      timerElement.style.display = "none"; // Hide the timer
      // Optionally, you can provide additional information or a call-to-action on the score page.
      answerButton.innerHTML = `You completed the quiz!`;
  
      // Show the reset button
      nextButton.style.display = "none";
      resetButton.style.display = "block";
    }
  
    function resetQuiz() {
      clearTimeout(timer); // Clear any existing timer
      startQuiz();
    }
  
    // Timer logic
    function startTimer() {
      let timeLeft = 15; // Initial time in seconds
  
      timer = setInterval(function() {
        timerElement.innerText = ` ${timeLeft}`;
  
        if (timeLeft <= 0) {
          // Time is up, reveal the correct answer
          revealCorrectAnswer(resultsArray[currentQuestionIndex].correct_answer);
          clearInterval(timer);
        }
  
        timeLeft--;
      }, 1000); // Update every second
    }
  
    // Attach the event listeners for the next and reset buttons
    nextButton.addEventListener("click", nextQuestion);
    resetButton.addEventListener("click", resetQuiz);
  
    let resultsArray;  // Moved the declaration outside the fetch block
  
    // Make a GET request using the fetch function
    fetch(apiUrl)
      .then((response) => {
        // Check if the request was successful (status code 200)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        // Parse the JSON response
        return response.json();
      })
      .then((data) => {
        // Handle the data from the API response
        resultsArray = data.results;  // Assign to the global variable
        startQuiz();
      })
      .catch((error) => {
        // Handle errors that may occur during the fetch
        console.error("Fetch error:", error);
      });
  });
  