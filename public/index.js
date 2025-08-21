// index.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dataUploadSection = document.getElementById('dataUpload');
    const quizContainer = document.getElementById('quizContainer');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.querySelector('.options');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const explanationContainer = document.querySelector('.explanation');
    const explanationText = document.getElementById('explanation-text');
    const aiToggle = document.getElementById('aiToggle');
    const aiChat = document.querySelector('.ai-chat-modal');
    const aiClose = document.getElementById('closeChatBtn');
    const aiInput = document.getElementById('chatInput');
    const aiSendBtn = document.getElementById('sendChatBtn');
    const aiMessages = document.getElementById('chatMessages');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const jsonPaste = document.getElementById('jsonPaste');
    const pasteBtn = document.getElementById('pasteBtn');
    const quizTimer = document.getElementById('quizTimer');
    const resultsModal = document.getElementById('resultsModal');
    const finalScore = document.getElementById('finalScore');
    const finalTime = document.getElementById('finalTime');
    const closeResultsBtn = document.querySelector('#resultsModal .close-button');
    const hideScoreToggle = document.getElementById('hideScoreToggle');
    const startNewQuizBtn = document.getElementById('startNewQuizBtn');
    const reviewAnswersBtn = document.getElementById('reviewAnswersBtn');
    const correctCountElem = document.getElementById('correctCount');
    const wrongCountElem = document.getElementById('wrongCount');
    const resultDetailsContainer = document.getElementById('resultDetailsContainer');
    const reviewQuizSection = document.getElementById('reviewQuizSection');

    // Quiz State
    let currentQuestion = 0;
    let userAnswers = [];
    let questions = [];
    let quizStartTime;
    let timerInterval;

    // --- Data Loading Logic ---
    function loadQuizData(data) {
        if (!Array.isArray(data) || data.length === 0) {
            console.error("Invalid JSON format. Please provide an array of questions.");
            return;
        }
        questions = data;
        userAnswers = new Array(questions.length).fill(null);
        dataUploadSection.style.display = 'none';
        quizContainer.style.display = 'block';
        quizStartTime = Date.now();
        startTimer();
        loadQuestion();
    }

    // Drag and drop handler
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('active');
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('active');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('active');
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.json')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    loadQuizData(data);
                } catch (error) {
                    alert("Geçersiz JSON dosyası!");
                    console.error("Error parsing JSON file:", error);
                }
            };
            reader.readAsText(file);
        } else {
            alert("Lütfen bir JSON dosyası bırakın.");
        }
    });

    // File input handler
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith('.json')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    loadQuizData(data);
                } catch (error) {
                    alert("Geçersiz JSON dosyası!");
                    console.error("Error parsing JSON file:", error);
                }
            };
            reader.readAsText(file);
        } else {
            alert("Lütfen bir JSON dosyası seçin.");
        }
    });

    // Paste handler
    pasteBtn.addEventListener('click', () => {
        try {
            const data = JSON.parse(jsonPaste.value);
            loadQuizData(data);
        } catch (error) {
            alert("Geçersiz JSON formatı!");
            console.error("Error parsing JSON from paste:", error);
        }
    });

    // --- Quiz Logic ---
    function loadQuestion() {
        if (questions.length === 0) {
            console.warn("No questions loaded.");
            return;
        }
        
        const q = questions[currentQuestion];
        questionText.textContent = q.question;
        
        optionsContainer.innerHTML = '';
        
        for (const [key, value] of Object.entries(q.options)) {
            const option = document.createElement('div');
            option.classList.add('option');
            if (userAnswers[currentQuestion] === key) {
                option.classList.add('selected');
            }
            option.textContent = `${key}. ${value}`;
            option.dataset.key = key;
            option.addEventListener('click', () => selectOption(key, option));
            optionsContainer.appendChild(option);
        }
        
        updateProgress();
        updateNavigationButtons();
        explanationContainer.style.display = 'none';
    }
    
    function selectOption(key, element) {
        document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');
        userAnswers[currentQuestion] = key;
    }
    
    function updateProgress() {
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    }
    
    function updateNavigationButtons() {
        prevBtn.disabled = currentQuestion === 0;
        nextBtn.disabled = currentQuestion === questions.length - 1;
        submitBtn.style.display = currentQuestion === questions.length - 1 ? 'block' : 'none';
        nextBtn.style.display = currentQuestion === questions.length - 1 ? 'none' : 'block';
    }
    
    function prevQuestion() {
        if (currentQuestion > 0) {
            currentQuestion--;
            loadQuestion();
        }
    }
    
    function nextQuestion() {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            loadQuestion();
        }
    }
    
    function calculateScore() {
        let correctCount = 0;
        let wrongCount = 0;
        for (let i = 0; i < questions.length; i++) {
            if (userAnswers[i] === questions[i].correctAnswer) {
                correctCount++;
            } else {
                wrongCount++;
            }
        }
        return { correctCount, wrongCount };
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }
    
    function startTimer() {
        let totalSeconds = 0;
        timerInterval = setInterval(() => {
            totalSeconds++;
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            quizTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    function submitQuiz() {
        stopTimer();
        const { correctCount, wrongCount } = calculateScore();
        const timeTaken = quizTimer.textContent;

        if (hideScoreToggle.checked) {
            finalScore.textContent = '***';
            correctCountElem.textContent = '***';
            wrongCountElem.textContent = '***';
        } else {
            finalScore.textContent = `${correctCount} / ${questions.length}`;
            correctCountElem.textContent = correctCount;
            wrongCountElem.textContent = wrongCount;
        }
        finalTime.textContent = timeTaken;
        
        resultsModal.style.display = 'flex';
    }
    
    function showResults() {
        quizContainer.style.display = 'none';
        resultsModal.style.display = 'none';
        reviewQuizSection.style.display = 'block';
        
        const reviewList = document.getElementById('reviewList');
        reviewList.innerHTML = '';

        questions.forEach((q, index) => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.innerHTML = `
                <div class="result-question">${index + 1}. ${q.question}</div>
                <div class="result-answer">
                    Your Answer: 
                    <span class="user-answer ${userAnswers[index] === q.correctAnswer ? 'correct' : 'incorrect'}">
                        ${userAnswers[index] ? q.options[userAnswers[index]] : 'Cevapsız'}
                        <i class="fas ${userAnswers[index] === q.correctAnswer ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    </span>
                    <br>
                    <span class="correct-answer">
                        Correct Answer: ${q.options[q.correctAnswer]}
                    </span>
                </div>
            `;
            reviewList.appendChild(resultItem);
        });
    }

    function resetQuiz() {
        currentQuestion = 0;
        userAnswers = [];
        questions = [];
        quizContainer.style.display = 'none';
        dataUploadSection.style.display = 'block';
        resultsModal.style.display = 'none';
        reviewQuizSection.style.display = 'none';
        quizTimer.textContent = '00:00';
    }

    // Event listeners
    prevBtn.addEventListener('click', prevQuestion);
    nextBtn.addEventListener('click', nextQuestion);
    submitBtn.addEventListener('click', submitQuiz);
    closeResultsBtn.addEventListener('click', () => {
        resultsModal.style.display = 'none';
    });
    startNewQuizBtn.addEventListener('click', resetQuiz);
    reviewAnswersBtn.addEventListener('click', showResults);
    
    // AI Chat listeners (unchanged)
    aiToggle.addEventListener('click', toggleAIChat);
    aiClose.addEventListener('click', toggleAIChat);
    aiSendBtn.addEventListener('click', sendAIMessage);
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendAIMessage();
        }
    });

    function toggleAIChat() {
      aiChat.classList.toggle('open');
    }

    function sendAIMessage() {
      const message = aiInput.value.trim();
      if (message) {
        addMessage(message, 'user');
        // Simple AI response for now, to be replaced with a real API call
        setTimeout(() => {
          const aiResponse = `Hi! I'm your study assistant. You asked: "${message}". What would you like to know more about?`;
          addMessage(aiResponse, 'ai');
        }, 1000);
        aiInput.value = '';
      }
    }

    function addMessage(text, sender) {
      const messageElement = document.createElement('div');
      messageElement.className = `message ${sender}-message`;
      messageElement.textContent = text;
      aiMessages.appendChild(messageElement);
      aiMessages.scrollTop = aiMessages.scrollHeight;
    }
});
