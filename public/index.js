document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.querySelector('.options');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const explanationContainer = document.querySelector('.explanation');
    const explanationText = document.getElementById('explanation-text');
    const aiToggle = document.getElementById('ai-toggle');
    const aiChat = document.querySelector('.ai-chat');
    const aiClose = document.getElementById('ai-close');
    const aiInput = document.querySelector('.ai-input input');
    const aiSendBtn = document.querySelector('.ai-input .btn');
    const aiMessages = document.querySelector('.ai-messages');
    
    // Quiz State
    let currentQuestion = 0;
    let userAnswers = [];
    let questions = [];
    
    // Initialize the quiz
    async function initQuiz() {
        try {
            // Load questions from JSON file
            // ** DÜZELTME: Dosya yolu artık doğrudan "q.json" olmalıdır çünkü public klasörü kök dizin olarak servis ediliyor. **
            const response = await fetch('q.json');
            
            // Hata kontrolü: Dosya bulunamazsa uyarı ver
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            questions = await response.json();
            
            // Initialize user answers array
            userAnswers = new Array(questions.length).fill(null);
            
            // Display the first question
            loadQuestion();
        } catch (error) {
            console.error("Quiz questions could not be loaded:", error);
            // Kullanıcıya bir hata mesajı gösterilebilir
            if (questionText) {
                questionText.textContent = "Sorular yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
            }
        }
    }

    // Function to load a question
    function loadQuestion() {
        if (questions.length === 0) {
            console.warn("No questions loaded.");
            return;
        }
        
        const q = questions[currentQuestion];
        questionText.textContent = q.question;
        
        // Clear previous options
        optionsContainer.innerHTML = '';
        
        // Create new options
        for (const [key, value] of Object.entries(q.options)) {
            const option = document.createElement('div');
            option.classList.add('option');
            // Check if this option was previously selected
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
        updateExplanation();
    }
    
    // Function to handle option selection
    function selectOption(key, element) {
        // Remove 'selected' class from all options
        document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        // Add 'selected' class to the clicked option
        element.classList.add('selected');
        userAnswers[currentQuestion] = key;
    }
    
    // Function to update progress bar and text
    function updateProgress() {
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    }
    
    // Function to update navigation buttons
    function updateNavigationButtons() {
        prevBtn.disabled = currentQuestion === 0;
        nextBtn.disabled = currentQuestion === questions.length - 1;
        submitBtn.style.display = currentQuestion === questions.length - 1 ? 'block' : 'none';
    }
    
    // Function to update explanation visibility
    function updateExplanation() {
        const answer = userAnswers[currentQuestion];
        const q = questions[currentQuestion];
        if (answer !== null && answer === q.correctAnswer) {
            explanationContainer.style.display = 'block';
            explanationText.textContent = q.explanation;
        } else {
            explanationContainer.style.display = 'none';
        }
    }
    
    // Function to go to the previous question
    function prevQuestion() {
        if (currentQuestion > 0) {
            currentQuestion--;
            loadQuestion();
        }
    }
    
    // Function to go to the next question
    function nextQuestion() {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            loadQuestion();
        }
    }
    
    // Function to submit the quiz and show results
    function submitQuiz() {
        let score = 0;
        for (let i = 0; i < questions.length; i++) {
            if (userAnswers[i] === questions[i].correctAnswer) {
                score++;
            }
        }
        alert(`Quiz finished! You scored ${score} out of ${questions.length}.`);
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevQuestion);
    nextBtn.addEventListener('click', nextQuestion);
    submitBtn.addEventListener('click', submitQuiz);
    
    // Initialize the quiz
    initQuiz();
});
