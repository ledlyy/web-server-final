/* -------- STATE -------- */
let idx = 0;
let score = 0;
let quizData = [];

/* -------- DOM -------- */
const container  = document.getElementById('quiz-container');
const shuffleBtn = document.getElementById('shuffle-btn');

/* -------- INIT -------- */
(async function init() {
  try {
    const res = await fetch('q.json');
    quizData = await res.json();

    // 1. Read query param and clamp
    const params = new URLSearchParams(window.location.search);
    const qParam = parseInt(params.get('q'), 10);
    if (!isNaN(qParam) && qParam >= 1 && qParam <= quizData.length) {
      idx = qParam - 1;
    }

    // 2. Shuffle handler resets idx and score, updates URL, then renders
    shuffleBtn.addEventListener('click', () => {
      shuffleArray(quizData);
      idx   = 0;
      score = 0;
      updateURL(idx);
      renderQuestion();
    });

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

  // Update URL so bookmarking/linking stays in sync
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

  // Show explanation
  const expDiv = document.createElement('div');
  expDiv.className = 'explanation';
  expDiv.textContent = explanation;
  btn.closest('.card').appendChild(expDiv);

  // Next / Score button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'next-btn';
  nextBtn.textContent = idx < quizData.length - 1 ? 'Next Question' : 'See Score';
  nextBtn.addEventListener('click', () => {
    idx++;
    renderQuestion();
  });
  btn.closest('.card').appendChild(nextBtn);
}

/* -------- UTILITIES -------- */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Update the browser URL to ?q=currentQuestionIndex+1 without reloading
function updateURL(questionIndex) {
  const newUrl = `${window.location.pathname}?q=${questionIndex + 1}`;
  history.replaceState(null, '', newUrl);
}
