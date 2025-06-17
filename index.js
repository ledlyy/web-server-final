// Global variables
let currentIndex = 0;
let score = 0;
let questions = [];

// DOM reference
const container = document.getElementById('quiz-container');

// Load questions from q.json
async function loadQuizData() {
  try {
    const response = await fetch('q.json');
    questions = await response.json();
    showQuestion();
  } catch (err) {
    container.innerHTML = `<p>Failed to load quiz data. Please check q.json.</p>`;
    console.error(err);
  }
}

// Display a single question
function showQuestion() {
  if (currentIndex >= questions.length) {
    return showFinalScore();
  }

  const questionObj = questions[currentIndex];
  const card = document.createElement('div');
  card.className = 'card';

  const questionText = document.createElement('div');
  questionText.className = 'question';
  questionText.textContent = `${currentIndex + 1}. ${questionObj.question}`;
  card.appendChild(questionText);

  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'options';

  for (const [key, value] of Object.entries(questionObj.options)) {
    const button = document.createElement('button');
    button.className = 'option';
    button.textContent = `${key}: ${value}`;
    button.addEventListener('click', () => handleAnswer(button, key, questionObj.correctAnswer));
    optionsContainer.appendChild(button);
  }

  card.appendChild(optionsContainer);
  container.innerHTML = '';
  container.appendChild(card);
}

// Handle user's answer
function handleAnswer(button, selectedKey, correctKey) {
  const buttons = document.querySelectorAll('.option');
  buttons.forEach(btn => btn.disabled = true);

  if (selectedKey === correctKey) {
    button.classList.add('correct');
    score++;
  } else {
    button.classList.add('incorrect');
    const correctBtn = Array.from(buttons).find(btn => btn.textContent.startsWith(correctKey));
    if (correctBtn) correctBtn.classList.add('correct');
  }

  setTimeout(() => {
    currentIndex++;
    showQuestion();
  }, 1200);
}

// Show final score
function showFinalScore() {
  container.innerHTML = `
    <div class="card" id="score-container">
      <p>Quiz completed!</p>
      <p>Your score: ${score} out of ${questions.length}</p>
    </div>
  `;
}

// Initialize the quiz
loadQuizData();
