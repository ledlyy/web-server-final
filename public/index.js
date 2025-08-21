
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
            const response = await fetch('data/questions.json');
            questions = await response.json();
            
            // Initialize user answers array
            userAnswers = new Array(questions.length).fill(null);
            
            // Load the first question
            loadQuestion(currentQuestion);
        } catch (error) {
            console.error('Error loading questions:', error);
            questionText.textContent = 'Sorular yüklenirken bir hata oluştu.';
        }
    }
    
    // Load a question
    function loadQuestion(index) {
        const question = questions[index];
        
        // Update question text
        questionText.textContent = question.question;
        
        // Update badges
        const badges = document.querySelector('.badges');
        badges.innerHTML = `
            <span class="badge difficulty-${question.difficulty}">${getDifficultyText(question.difficulty)}</span>
            <span class="badge topic">${question.topic}</span>
        `;
        
        // Update options
        optionsContainer.innerHTML = '';
        for (const [key, value] of Object.entries(question.options)) {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.dataset.option = key;
            
            // Check if this option was previously selected
            if (userAnswers[index] === key) {
                optionElement.classList.add('selected');
            }
            
            optionElement.innerHTML = `
                <span class="option-key">${key}</span>
                <span class="option-text">${value}</span>
            `;
            
            optionElement.addEventListener('click', () => selectOption(key));
            optionsContainer.appendChild(optionElement);
        }
        
        // Update progress
        const progress = ((index + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Soru ${index + 1}/${questions.length}`;
        
        // Update navigation buttons
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === questions.length - 1;
        
        // Show/hide submit button
        if (index === questions.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
        
        // Hide explanation
        explanationContainer.style.display = 'none';
    }
    
    // Get difficulty text in Turkish
    function getDifficultyText(difficulty) {
        const difficultyMap = {
            'easy': 'Kolay',
            'medium': 'Orta',
            'hard': 'Zor'
        };
        return difficultyMap[difficulty] || difficulty;
    }
    
    // Select an option
    function selectOption(option) {
        // Remove selected class from all options
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selected class to clicked option
        const selectedOption = document.querySelector(`.option[data-option="${option}"]`);
        selectedOption.classList.add('selected');
        
        // Save user's answer
        userAnswers[currentQuestion] = option;
        
        // Show explanation
        showExplanation(option);
    }
    
    // Show explanation
    function showExplanation(selectedOption) {
        const question = questions[currentQuestion];
        explanationText.textContent = question.explanation;
        explanationContainer.style.display = 'block';
        
        // Mark correct/incorrect answers
        document.querySelectorAll('.option').forEach(opt => {
            const optionValue = opt.dataset.option;
            if (optionValue === question.correctAnswer) {
                opt.classList.add('correct');
            } else if (optionValue === selectedOption && selectedOption !== question.correctAnswer) {
                opt.classList.add('incorrect');
            }
        });
    }
    
    // Navigate to next question
    function nextQuestion() {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            loadQuestion(currentQuestion);
        }
    }
    
    // Navigate to previous question
    function prevQuestion() {
        if (currentQuestion > 0) {
            currentQuestion--;
            loadQuestion(currentQuestion);
        }
    }
    
    // Submit quiz
    function submitQuiz() {
        // Calculate score
        let score = 0;
        userAnswers.forEach((answer, index) => {
            if (answer === questions[index].correctAnswer) {
                score++;
            }
        });
        
        // Display results
        questionText.textContent = `Sınav Tamamlandı! Skorunuz: ${score}/${questions.length}`;
        optionsContainer.innerHTML = '';
        explanationContainer.style.display = 'none';
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'none';
        
        // Show detailed results
        const resultsHTML = `
            <div class="results">
                <h3>Detaylı Sonuçlar</h3>
                ${questions.map((question, index) => `
                    <div class="result-item ${userAnswers[index] === question.correctAnswer ? 'correct' : 'incorrect'}">
                        <p><strong>Soru ${index + 1}:</strong> ${question.question}</p>
                        <p>Verdiğiniz Cevap: ${userAnswers[index] ? question.options[userAnswers[index]] : 'Cevaplanmadı'}</p>
                        <p>Doğru Cevap: ${question.options[question.correctAnswer]}</p>
                    </div>
                `).join('')}
            </div>
        `;
        
        optionsContainer.innerHTML = resultsHTML;
    }
    
    // AI Assistant functions
    function toggleAIChat() {
        aiChat.style.display = aiChat.style.display === 'none' ? 'block' : 'none';
    }
    
    function sendAIMessage() {
        const message = aiInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            
            // Simulate AI response
            setTimeout(() => {
                let response = '';
                if (message.toLowerCase().includes('merhaba') || message.toLowerCase().includes('selam')) {
                    response = 'Merhaba! Sınavla ilgili nasıl yardımcı olabilirim?';
                } else if (message.toLowerCase().includes('ipucu') || message.toLowerCase().includes('yardım')) {
                    response = 'İpucu: Soruyu dikkatlice okuyun ve tüm seçenekleri gözden geçirin. Zorlanıyorsanız, eleme yöntemini deneyin.';
                } else {
                    response = 'Bu konuda daha fazla bilgi için ders notlarınızı gözden geçirmenizi öneririm. Başka bir sorunuz var mı?';
                }
                addMessage(response, 'ai');
            }, 1000);
            
            // Clear input
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
    
    // Event listeners
    prevBtn.addEventListener('click', prevQuestion);
    nextBtn.addEventListener('click', nextQuestion);
    submitBtn.addEventListener('click', submitQuiz);
    aiToggle.addEventListener('click', toggleAIChat);
    aiClose.addEventListener('click', toggleAIChat);
    aiSendBtn.addEventListener('click', sendAIMessage);
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendAIMessage();
        }
    });
    
    // Initialize the quiz
    initQuiz();
});