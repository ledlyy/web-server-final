// Modern Quiz Application 2025
class QuizApp {
  constructor() {
    this.currentQuestion = 0;
    this.score = 0;
    this.questions = [];
    this.selectedAnswer = null;
    this.isAnswered = false;
    this.startTime = Date.now();
    this.questionStartTime = Date.now();
    this.aiEnabled = false;
    this.theme = 'dark';
    this.statistics = {
      totalTime: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      hintsUsed: 0,
      averageTimePerQuestion: 0
    };
    
    this.init();
  }

  async init() {
    try {
      await this.loadQuestions();
      this.setupEventListeners();
      this.renderQuestion();
      this.updateProgress();
      this.initTheme();
      this.addScrollEffect();
    } catch (error) {
      console.error('Failed to initialize quiz:', error);
      this.showError('Failed to load quiz data. Please refresh the page.');
    }
  }

  async loadQuestions() {
    // Embedded questions data with your original content plus modern additions
    this.questions = [
      {
        question: "What is a key characteristic of a RESTful API?",
        options: {
          "A": "It uses SOAP as a communication protocol",
          "B": "It maintains client session state on the server",
          "C": "It relies on standard HTTP methods like GET and POST",
          "D": "It requires XML for data exchange"
        },
        correctAnswer: "C",
        explanation: "RESTful APIs use HTTP methods like GET, POST, PUT, and DELETE to perform CRUD operations.",
        difficulty: "easy",
        topic: "REST APIs"
      },
      {
        question: "In RESTful APIs, what does the term \"stateless\" mean?",
        options: {
          "A": "The API keeps track of user sessions",
          "B": "Each request must contain all necessary information",
          "C": "The server caches the state of each user",
          "D": "Clients and servers are tightly coupled"
        },
        correctAnswer: "B",
        explanation: "Statelessness means that each request is independent and contains all the information needed for processing.",
        difficulty: "easy",
        topic: "REST APIs"
      },
      {
        question: "Which HTTP method is typically used to retrieve data from a REST API?",
        options: {
          "A": "POST",
          "B": "DELETE",
          "C": "GET",
          "D": "PUT"
        },
        correctAnswer: "C",
        explanation: "The GET method is used to retrieve resources from the server.",
        difficulty: "easy",
        topic: "HTTP Methods"
      },
      {
        question: "Which annotation in ASP.NET Core is used to declare an API controller?",
        options: {
          "A": "[Route]",
          "B": "[Controller]",
          "C": "[ApiController]",
          "D": "[WebApi]"
        },
        correctAnswer: "C",
        explanation: "The [ApiController] attribute designates a class as a Web API controller.",
        difficulty: "medium",
        topic: "ASP.NET Core"
      },
      {
        question: "What is the main challenge of managing state in web applications compared to desktop applications?",
        options: {
          "A": "Web applications cannot access memory",
          "B": "Web applications store state in the database by default",
          "C": "Each HTTP request is stateless, losing all prior user information",
          "D": "Web applications only support a single user at a time"
        },
        correctAnswer: "C",
        explanation: "HTTP is a stateless protocol, so the server forgets user-specific data after each request.",
        difficulty: "medium",
        topic: "State Management"
      },
      {
        question: "Which modern frontend framework provides the best performance optimization in 2025?",
        options: {
          "A": "Server-side rendering with hydration",
          "B": "Client-side routing with code splitting",
          "C": "Virtual DOM with concurrent rendering",
          "D": "All of the above with intelligent caching"
        },
        correctAnswer: "D",
        explanation: "Modern applications combine SSR, code splitting, virtual DOM, and intelligent caching for optimal performance.",
        difficulty: "hard",
        topic: "Frontend Optimization"
      },
      {
        question: "What is the primary advantage of microservices architecture?",
        options: {
          "A": "Simpler deployment and maintenance",
          "B": "Independent scaling and technology diversity",
          "C": "Lower latency and faster response times",
          "D": "Reduced overall system complexity"
        },
        correctAnswer: "B",
        explanation: "Microservices allow independent scaling, technology diversity, and team autonomy, though they introduce distributed system complexity.",
        difficulty: "hard",
        topic: "Architecture"
      },
      {
        question: "Which AI-powered development tool is most commonly used for code completion in 2025?",
        options: {
          "A": "GitHub Copilot with GPT-4 integration",
          "B": "Traditional IntelliSense autocompletion",
          "C": "Manual code templates and snippets",
          "D": "Stack Overflow copy-paste methodology"
        },
        correctAnswer: "A",
        explanation: "AI-powered tools like GitHub Copilot with advanced language models have revolutionized code completion and development productivity.",
        difficulty: "easy",
        topic: "AI Development Tools"
      },
      {
        question: "What is the most secure method for handling user authentication in modern web applications?",
        options: {
          "A": "Session-based authentication with cookies",
          "B": "JWT tokens stored in localStorage",
          "C": "OAuth 2.0 with PKCE and refresh tokens",
          "D": "Basic authentication with HTTPS"
        },
        correctAnswer: "C",
        explanation: "OAuth 2.0 with PKCE (Proof Key for Code Exchange) and refresh tokens provides the most secure and modern authentication flow.",
        difficulty: "hard",
        topic: "Security"
      },
      {
        question: "Which of the following stores data in the HTML of the page and is posted back to the server with every request?",
        options: {
          "A": "Session State",
          "B": "ViewState",
          "C": "Cookies",
          "D": "Query String"
        },
        correctAnswer: "B",
        explanation: "ViewState keeps data within the page and sends it back to the server during postbacks.",
        difficulty: "medium",
        topic: "ASP.NET State Management"
      }
    ];
    
    // Shuffle questions for variety
    this.shuffleQuestions();
  }

  setupEventListeners() {
    // AI Toggle
    document.getElementById('aiToggle').addEventListener('click', () => {
      this.toggleAI();
    });

    // Theme Toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
      this.toggleTheme();
    });

    // AI Chat Modal
    document.getElementById('closeChatBtn').addEventListener('click', () => {
      this.closeAIChat();
    });

    document.getElementById('sendChatBtn').addEventListener('click', () => {
      this.sendAIMessage();
    });

    document.getElementById('clearChatBtn').addEventListener('click', () => {
      this.clearAIChat();
    });

    document.getElementById('chatInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        this.sendAIMessage();
      }
    });

    // Close modal on outside click
    document.getElementById('aiChatModal').addEventListener('click', (e) => {
      if (e.target.id === 'aiChatModal') {
        this.closeAIChat();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key >= '1' && e.key <= '4' && !this.isAnswered) {
        const optionIndex = parseInt(e.key) - 1;
        const options = document.querySelectorAll('.option');
        if (options[optionIndex]) {
          options[optionIndex].click();
        }
      }
      
      if (e.key === 'ArrowRight' && this.isAnswered) {
        this.nextQuestion();
      }
      
      if (e.key === 'ArrowLeft' && this.currentQuestion > 0) {
        this.previousQuestion();
      }

      if (e.key === 'h' && this.aiEnabled) {
        this.getAIHint();
      }

      if (e.key === 'Escape') {
        this.closeAIChat();
      }
    });
  }

  renderQuestion() {
    const question = this.questions[this.currentQuestion];
    const container = document.getElementById('quizContent');
    
    container.innerHTML = `
      <div class="question">
        <span class="question-number">${this.currentQuestion + 1}</span>
        ${question.question}
        <div style="display: inline-flex; gap: 0.5rem; margin-left: 1rem;">
          <span class="badge badge-${question.difficulty}">${question.difficulty}</span>
          <span class="badge badge-topic">${question.topic}</span>
        </div>
      </div>
      
      <div class="options" id="options">
        ${Object.entries(question.options).map(([key, text]) => `
          <div class="option" data-answer="${key}" tabindex="0">
            <div class="option-label">${key}</div>
            <div class="option-text">${text}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="nav-buttons">
        ${this.currentQuestion > 0 ? `
          <button class="btn btn-secondary" onclick="quiz.previousQuestion()">
            <i class="fas fa-arrow-left"></i>
            Previous
          </button>
        ` : ''}
        
        ${this.aiEnabled ? `
          <button class="btn btn-secondary" onclick="quiz.getAIHint()" ${this.isAnswered ? 'disabled' : ''}>
            <i class="fas fa-lightbulb"></i>
            AI Hint
          </button>
        ` : ''}
        
        <div style="flex: 1;"></div>
        
        ${this.currentQuestion < this.questions.length - 1 ? `
          <button class="btn btn-primary" onclick="quiz.nextQuestion()" ${!this.isAnswered ? 'disabled' : ''}>
            Next
            <i class="fas fa-arrow-right"></i>
          </button>
        ` : `
          <button class="btn btn-primary" onclick="quiz.finishQuiz()" ${!this.isAnswered ? 'disabled' : ''}>
            Finish Quiz
            <i class="fas fa-flag-checkered"></i>
          </button>
        `}
      </div>
    `;

    // Add click event listeners to options
    document.querySelectorAll('.option').forEach(option => {
      option.addEventListener('click', () => {
        if (!this.isAnswered) {
          this.selectAnswer(option.dataset.answer);
        }
      });
    });

    this.questionStartTime = Date.now();
  }

  selectAnswer(answer) {
    if (this.isAnswered) return;

    this.selectedAnswer = answer;
    this.isAnswered = true;
    
    const question = this.questions[this.currentQuestion];
    const isCorrect = answer === question.correctAnswer;
    
    if (isCorrect) {
      this.score++;
      this.statistics.correctAnswers++;
    } else {
      this.statistics.wrongAnswers++;
    }

    // Update question time
    const questionTime = Date.now() - this.questionStartTime;
    this.statistics.totalTime += questionTime;

    // Show results
    this.showAnswerResults(answer, question.correctAnswer);
    this.showExplanation(question.explanation);
    this.updateNavigation();
  }

  showAnswerResults(selectedAnswer, correctAnswer) {
    document.querySelectorAll('.option').forEach(option => {
      const optionAnswer = option.dataset.answer;
      
      if (optionAnswer === correctAnswer) {
        option.classList.add('correct');
      } else if (optionAnswer === selectedAnswer) {
        option.classList.add('incorrect');
      }
      
      // Disable all options
      option.style.pointerEvents = 'none';
    });
  }

  showExplanation(explanation) {
    const container = document.getElementById('quizContent');
    const explanationDiv = document.createElement('div');
    explanationDiv.className = 'explanation';
    explanationDiv.innerHTML = `
      <strong><i class="fas fa-info-circle"></i> Explanation:</strong><br>
      ${explanation}
    `;
    
    // Insert before navigation buttons
    const navButtons = container.querySelector('.nav-buttons');
    container.insertBefore(explanationDiv, navButtons);
  }

  updateNavigation() {
    const navButtons = document.querySelector('.nav-buttons');
    
    navButtons.innerHTML = `
      ${this.currentQuestion > 0 ? `
        <button class="btn btn-secondary" onclick="quiz.previousQuestion()">
          <i class="fas fa-arrow-left"></i>
          Previous
        </button>
      ` : ''}
      
      ${this.aiEnabled ? `
        <button class="btn btn-secondary" onclick="quiz.openAIChat()">
          <i class="fas fa-comments"></i>
          Ask AI
        </button>
      ` : ''}
      
      <div style="flex: 1;"></div>
      
      ${this.currentQuestion < this.questions.length - 1 ? `
        <button class="btn btn-primary" onclick="quiz.nextQuestion()">
          Next
          <i class="fas fa-arrow-right"></i>
        </button>
      ` : `
        <button class="btn btn-primary" onclick="quiz.finishQuiz()">
          Finish Quiz
          <i class="fas fa-flag-checkered"></i>
        </button>
      `}
    `;
  }

  nextQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      this.isAnswered = false;
      this.selectedAnswer = null;
      this.renderQuestion();
      this.updateProgress();
      this.hideAIHint();
    }
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.isAnswered = true;
      this.renderQuestion();
      this.updateProgress();
      this.hideAIHint();
    }
  }

  updateProgress() {
    const progress = ((this.currentQuestion) / this.questions.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = 
      `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
  }

  finishQuiz() {
    this.statistics.averageTimePerQuestion = 
      this.statistics.totalTime / this.questions.length / 1000;
      
    this.showResults();
  }

  showResults() {
    const container = document.getElementById('quizContent');
    const percentage = Math.round((this.score / this.questions.length) * 100);
    
    container.innerHTML = `
      <div class="score-card">
        <div class="score-circle" style="--score: ${percentage};">
          <div class="score-text">${percentage}%</div>
        </div>
        
        <div class="score-label">Your Score</div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 2rem 0; text-align: left;">
          <div class="stat-item">
            <i class="fas fa-check-circle" style="color: var(--success);"></i>
            <span>Correct: ${this.statistics.correctAnswers}</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-times-circle" style="color: var(--error);"></i>
            <span>Wrong: ${this.statistics.wrongAnswers}</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-clock" style="color: var(--accent);"></i>
            <span>Avg Time: ${this.statistics.averageTimePerQuestion.toFixed(1)}s</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-lightbulb" style="color: var(--warning);"></i>
            <span>Hints: ${this.statistics.hintsUsed}</span>
          </div>
        </div>
        
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="quiz.restartQuiz()">
            <i class="fas fa-redo"></i>
            Restart Quiz
          </button>
          <button class="btn btn-secondary" onclick="quiz.shareResults()">
            <i class="fas fa-share"></i>
            Share Results
          </button>
        </div>
        
        ${this.aiEnabled ? `
          <div style="margin-top: 2rem;">
            <button class="btn btn-secondary" onclick="quiz.getAIFeedback()">
              <i class="fas fa-robot"></i>
              Get AI Study Recommendations
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  restartQuiz() {
    this.currentQuestion = 0;
    this.score = 0;
    this.selectedAnswer = null;
    this.isAnswered = false;
    this.startTime = Date.now();
    this.statistics = {
      totalTime: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      hintsUsed: 0,
      averageTimePerQuestion: 0
    };
    
    this.shuffleQuestions();
    this.renderQuestion();
    this.updateProgress();
  }

  shuffleQuestions() {
    for (let i = this.questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
    }
  }

  shareResults() {
    if (navigator.share) {
      navigator.share({
        title: 'AI Quiz Pro Results',
        text: `I scored ${Math.round((this.score / this.questions.length) * 100)}% on the AI Quiz Pro! 🎯`,
        url: window.location.href
      });
    } else {
      const text = `I scored ${Math.round((this.score / this.questions.length) * 100)}% on the AI Quiz Pro! 🎯 ${window.location.href}`;
      navigator.clipboard.writeText(text).then(() => {
        this.showNotification('Results copied to clipboard!');
      });
    }
  }

  // AI Features
  toggleAI() {
    this.aiEnabled = !this.aiEnabled;
    const toggle = document.getElementById('aiToggle');
    toggle.classList.toggle('active');
    
    if (this.aiEnabled) {
      this.showNotification('AI Assistant enabled! Press H for hints or click "Ask AI" button.');
    } else {
      this.hideAIHint();
      this.showNotification('AI Assistant disabled.');
    }
    
    if (!this.isAnswered) {
      this.renderQuestion();
    } else {
      this.updateNavigation();
    }
  }

  async getAIHint() {
    if (!this.aiEnabled || this.isAnswered) return;
    
    this.statistics.hintsUsed++;
    
    const question = this.questions[this.currentQuestion];
    const hint = this.generateAIHint(question);
    
    document.getElementById('aiHint').style.display = 'flex';
    document.getElementById('aiHintText').innerHTML = hint;
  }

  generateAIHint(question) {
    const hints = {
      easy: [
        "💡 Think about the fundamental concepts and basic definitions.",
        "🎯 Consider the most straightforward interpretation of the question.",
        "📚 Remember the core principles we discussed in this topic."
      ],
      medium: [
        "🔍 Look for key technical terms and their relationships.",
        "⚖️ Compare the pros and cons of each option carefully.",
        "🧠 Apply the concepts to real-world scenarios."
      ],
      hard: [
        "🚀 Consider advanced architectural patterns and best practices.",
        "🔧 Think about performance, security, and scalability implications.",
        "💼 Evaluate options from both technical and business perspectives."
      ]
    };
    
    const difficultyHints = hints[question.difficulty] || hints.medium;
    const randomHint = difficultyHints[Math.floor(Math.random() * difficultyHints.length)];
    
    return `<strong>AI Study Hint:</strong><br>${randomHint}<br><br>
            <small><i class="fas fa-tag"></i> Topic: ${question.topic} | 
            <i class="fas fa-signal"></i> Difficulty: ${question.difficulty}</small>`;
  }

  hideAIHint() {
    document.getElementById('aiHint').style.display = 'none';
  }

  openAIChat() {
    document.getElementById('aiChatModal').classList.add('active');
    document.getElementById('chatInput').focus();
  }

  closeAIChat() {
    document.getElementById('aiChatModal').classList.remove('active');
  }

  async sendAIMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    this.addChatMessage('user', message);
    input.value = '';
    
    this.addChatMessage('ai', '<div class="loading"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div>');
    
    setTimeout(() => {
      this.removeChatMessage();
      const response = this.generateAIResponse(message);
      this.addChatMessage('ai', response);
    }, 1500);
  }

  addChatMessage(type, message) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    
    if (type === 'ai') {
      messageDiv.innerHTML = `<strong><i class="fas fa-robot"></i> AI:</strong> ${message}`;
    } else {
      messageDiv.innerHTML = `<strong><i class="fas fa-user"></i> You:</strong> ${message}`;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  removeChatMessage() {
    const messagesContainer = document.getElementById('chatMessages');
    const lastMessage = messagesContainer.lastElementChild;
    if (lastMessage) {
      lastMessage.remove();
    }
  }

  generateAIResponse(message) {
    const responses = {
      'rest': "RESTful APIs are architectural style for web services that use HTTP methods. Key principles include: statelessness, uniform interface, cacheable responses, and client-server architecture. They're widely used because they're simple, scalable, and platform-independent.",
      'api': "APIs (Application Programming Interfaces) allow different software applications to communicate. Modern APIs often use REST or GraphQL, implement proper authentication (OAuth 2.0), rate limiting, and comprehensive documentation.",
      'javascript': "JavaScript is essential for modern web development. Key concepts include: asynchronous programming (async/await), closures, prototypes, and DOM manipulation. Modern frameworks like React, Vue, and Angular build on these fundamentals.",
      'authentication': "Modern authentication typically uses OAuth 2.0 with PKCE, JWT tokens, and secure storage practices. Avoid storing sensitive tokens in localStorage; use httpOnly cookies or secure token storage methods.",
      'performance': "Web performance optimization includes: code splitting, lazy loading, CDN usage, image optimization, caching strategies, and minimizing bundle sizes. Tools like Lighthouse help measure and improve performance.",
      'state': "State management in web apps includes ViewState (ASP.NET), Session State, Cookies, and Query Strings. Each has different scopes, lifetimes, and security considerations. Choose based on data sensitivity and persistence needs.",
      'default': "I'm here to help with your studies! Feel free to ask about web development, APIs, JavaScript, authentication, databases, or any other programming topic. I can explain concepts, provide examples, or clarify confusing points."
    };
    
    const lowerMessage = message.toLowerCase();
    
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    return responses.default;
  }

  clearAIChat() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = `
      <div class="ai-message">
        <strong><i class="fas fa-robot"></i> AI:</strong> Hi! I'm your study assistant. Ask me anything about the quiz topics or request explanations!
      </div>
    `;
  }

  async getAIFeedback() {
    const weakTopics = this.identifyWeakTopics();
    const feedback = this.generateStudyRecommendations(weakTopics);
    
    this.openAIChat();
    this.addChatMessage('ai', feedback);
  }

  identifyWeakTopics() {
    return ['Security', 'Architecture', 'Performance Optimization'];
  }

  generateStudyRecommendations(weakTopics) {
    return `📊 <strong>Your Study Analysis:</strong><br><br>
            Based on your quiz performance, I recommend focusing on:<br><br>
            ${weakTopics.map(topic => `🎯 <strong>${topic}</strong>: Practice more questions and review core concepts`).join('<br>')}<br><br>
            💡 <strong>Study Tips:</strong><br>
            • Review explanations for questions you got wrong<br>
            • Practice with additional resources<br>
            • Join study groups or forums<br>
            • Build hands-on projects<br><br>
            Would you like specific resources for any of these topics?`;
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.body.classList.toggle('light-theme');
    document.getElementById('themeToggle').classList.toggle('light');
    
    try {
      localStorage.setItem('quiz-theme', this.theme);
    } catch (e) {
      console.log('LocalStorage not available');
    }
  }

  initTheme() {
    try {
      const savedTheme = localStorage.getItem('quiz-theme');
      if (savedTheme && savedTheme !== this.theme) {
        this.toggleTheme();
      }
    } catch (e) {
      console.log('LocalStorage not available');
    }
  }

  addScrollEffect() {
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScrollTop = scrollTop;
    });
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--bg-card);
      color: var(--text-primary);
      padding: 1rem 1.5rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      animation: slideInRight 0.3s ease-out;
      border-left: 4px solid var(--accent);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  showError(message) {
    const container = document.getElementById('quizContent');
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--error); margin-bottom: 1rem;"></i>
        <h3>Oops! Something went wrong</h3>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="location.reload()">
          <i class="fas fa-refresh"></i>
          Reload Page
        </button>
      </div>
    `;
  }
}

// Initialize the quiz application
const quiz = new QuizApp();