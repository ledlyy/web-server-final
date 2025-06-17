/* -------- STATE -------- */
let idx = 0;
let score = 0;
let quizData = [];

/* -------- DOM -------- */
const container  = document.getElementById('quiz-container');
const shuffleBtn = document.getElementById('shuffle-btn');
const dbSelect   = document.getElementById('db-select');

/* -------- INIT -------- */
(async function init() {
  try {
    await loadQuizData(dbSelect.value);

    dbSelect.addEventListener('change', async () => {
      await loadQuizData(dbSelect.value);
    });

    shuffleBtn.addEventListener('click', () => {
      shuffleArray(quizData);
      idx = 0;
      score = 0;
      updateURL(idx);
      renderQuestion();
    });

    renderQuestion();
  } catch (err) {
    container.innerHTML = `
      <p style="text-align:center">
        ❌ Could not load the quiz database.<br>
        Run the page through a local server.
      </p>`;
    console.error(err);
  }
})();

/* -------- LOAD QUIZ DATA -------- */
async function loadQuizData(filename) {
  const res = await fetch(filename);
  quizData = await res.json();

  // Read and validate query param
  const params = new URLSearchParams(window.location.search);
  const qParam = parseInt(params.get('q'), 10);
  idx = (!isNaN(qParam) && qParam >= 1 && qParam <= quizData.length) ? qParam - 1 : 0;

  score = 0;
  renderQuestion();
}

/* -------- RENDERERS -------- */
function renderQuestion() {
  if (idx >= quizData.length) {
    return renderScore();
  }

  updateURL(idx);

  const { question, options } = quizData[idx];
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `<div class="question">${idx + 1}. ${question}</div>`;

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
  const buttons = [...document.querySelectorAll('.option')];
  buttons.forEach(b => b.disabled = true);

  if (selected === correct) {
    btn.classList.add('correct');
    score++;
  } else {
    btn.classList.add('incorrect');
    const correctBtn = buttons.find(b => b.textContent.startsWith(correct));
    if (correctBtn) correctBtn.classList.add('correct');
  }

  const card = btn.closest('.card');

  // Explanation
  const expDiv = document.createElement('div');
  expDiv.className = 'explanation';
  expDiv.textContent = explanation;
  card.appendChild(expDiv);

  // Navigation buttons
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-buttons';

  // Previous
  if (idx > 0) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'prev-btn';
    prevBtn.textContent = 'Previous';
    prevBtn.addEventListener('click', () => {
      idx--;
      renderQuestion();
    });
    navWrapper.appendChild(prevBtn);
  }

  // Next / Score
  const nextBtn = document.createElement('button');
  nextBtn.className = 'next-btn';
  nextBtn.textContent = idx < quizData.length - 1 ? 'Next Question' : 'See Score';
  nextBtn.addEventListener('click', () => {
    idx++;
    renderQuestion();
  });
  navWrapper.appendChild(nextBtn);

  card.appendChild(navWrapper);
}

/* -------- UTILITIES -------- */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function updateURL(questionIndex) {
  const newUrl = `${window.location.pathname}?q=${questionIndex + 1}`;
  history.replaceState(null, '', newUrl);
}