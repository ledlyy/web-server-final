/* -------- STATE -------- */
let idx = 0;
let score = 0;
let quizData = [];

/* -------- DOM -------- */
const container = document.getElementById('quiz-container');

/* -------- INIT -------- */
(async function init() {
  try {
    const res = await fetch('q.json');
    quizData = await res.json();
    renderQuestion();
  } catch (err) {
    container.innerHTML = `
      <p style="text-align:center">
        ❌ Could not load <strong>q.json</strong>.<br>
        Run the page through a local server.
      </p>`;
    console.error(err);
  }
})();

/* -------- RENDERERS -------- */
function renderQuestion() {
  if (idx >= quizData.length) {
    return renderScore();
  }

  const { question, options } = quizData[idx];

  const card = document.createElement('div');
  card.className = 'card';

  /* Question text */
  card.innerHTML = `<div class="question">${idx + 1}. ${question}</div>`;

  /* Options */
  const opts = document.createElement('div');
  opts.className = 'options';

  Object.entries(options).forEach(([key, text]) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = `${key}: ${text}`;
    btn.addEventListener('click', () => {
      const { correctAnswer, explanation } = quizData[idx];
      handleAnswer(btn, key, correctAnswer, explanation);
    });
    opts.appendChild(btn);
  });

  card.appendChild(opts);
  container.innerHTML = '';
  container.appendChild(card);
}

function renderScore() {
  container.innerHTML = `
    <div class="card" id="score">
      <p style="font-size:1.3rem; font-weight:600; margin-bottom:0.5rem;">
        Quiz finished!
      </p>
      <p>You scored <strong>${score}</strong> / <strong>${quizData.length}</strong>.</p>
    </div>`;
}

/* -------- LOGIC -------- */
function handleAnswer(btn, selected, correct, explanation) {
  // Disable all option buttons
  const buttons = [...document.querySelectorAll('.option')];
  buttons.forEach(b => b.disabled = true);

  // Mark correct/incorrect
  if (selected === correct) {
    btn.classList.add('correct');
    score++;
  } else {
    btn.classList.add('incorrect');
    const correctBtn = buttons.find(b => b.textContent.startsWith(correct));
    if (correctBtn) correctBtn.classList.add('correct');
  }

  // Show explanation
  const expDiv = document.createElement('div');
  expDiv.className = 'explanation';
  expDiv.textContent = explanation;
  btn.closest('.card').appendChild(expDiv);

  // Create & insert Next Question button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'next-btn';
  nextBtn.textContent = idx < quizData.length - 1 ? 'Next Question' : 'See Score';
  nextBtn.addEventListener('click', () => {
    idx++;
    renderQuestion();
  });

  btn.closest('.card').appendChild(nextBtn);
}
