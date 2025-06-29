// Quiz questions pool
const questionsPool = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correctAnswer: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctAnswer: 2
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Fe", "Au", "Cu"],
        correctAnswer: 2
    },
    {
        question: "Which country is home to the kangaroo?",
        options: ["New Zealand", "South Africa", "Australia", "Brazil"],
        correctAnswer: 2
    },
    {
        question: "What is the largest organ in the human body?",
        options: ["Heart", "Brain", "Liver", "Skin"],
        correctAnswer: 3
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correctAnswer: 1
    },
    {
        question: "What is the main component of the Sun?",
        options: ["Helium", "Oxygen", "Hydrogen", "Nitrogen"],
        correctAnswer: 2
    },
    {
        question: "Which is the longest river in the world?",
        options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
        correctAnswer: 1
    },
    {
        question: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Iron", "Diamond", "Platinum"],
        correctAnswer: 2
    },
    {
        question: "Which continent is the largest?",
        options: ["North America", "Africa", "Asia", "Europe"],
        correctAnswer: 2
    }
];

// DOM Elements
const timerElement = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');
const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const prevButton = document.getElementById('prev-btn');
const skipButton = document.getElementById('skip-btn');
const nextButton = document.getElementById('next-btn');
const quizContainer = document.getElementById('quiz-container');
const quizSummary = document.getElementById('quiz-summary');
const totalAttempted = document.getElementById('total-attempted');
const correctAnswers = document.getElementById('correct-answers');
const finalScore = document.getElementById('final-score');
const timeTaken = document.getElementById('time-taken');
const restartButton = document.getElementById('restart-btn');
const modeToggle = document.getElementById('mode-toggle');

// Quiz State
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timeLeft = 300; // 5 minutes in seconds
let timerInterval;
let startTime;

// Initialize the quiz
function initializeQuiz() {
    // Shuffle and select 10 random questions
    currentQuestions = [...questionsPool]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
    
    currentQuestionIndex = 0;
    userAnswers = new Array(10).fill(null);
    timeLeft = 300;
    startTime = new Date();
    
    // Reset UI
    updateQuestionCounter();
    renderQuestion();
    startTimer();
    updateProgressBar();
    
    // Show quiz container, hide summary
    quizContainer.classList.remove('hidden');
    quizSummary.classList.add('hidden');
}

// Timer functions
function startTimer() {
    clearInterval(timerInterval);
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Question rendering
function renderQuestion() {
    // Add fade-out effect
    quizContainer.style.opacity = '0';
    
    setTimeout(() => {
        const question = currentQuestions[currentQuestionIndex];
        questionText.textContent = question.question;
        
        // Clear previous options
        optionsContainer.innerHTML = '';
        
        // Create new option buttons
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => selectOption(index));
            
            if (userAnswers[currentQuestionIndex] === index) {
                button.classList.add('selected');
            }
            
            optionsContainer.appendChild(button);
        });
        
        // Update navigation buttons
        prevButton.disabled = currentQuestionIndex === 0;
        nextButton.textContent = currentQuestionIndex === 9 ? 'Finish Quiz' : 'Next Question';
        
        updateQuestionCounter();
        updateProgressBar();
        
        // Add fade-in effect
        quizContainer.style.opacity = '1';
    }, 300); // Match this delay with CSS transition duration
}

// Option selection
function selectOption(index) {
    userAnswers[currentQuestionIndex] = index;
    const currentQuestion = currentQuestions[currentQuestionIndex];
    
    // Update UI and show feedback
    const options = optionsContainer.children;
    Array.from(options).forEach((option, i) => {
        option.classList.remove('selected', 'correct', 'incorrect');
        if (i === index) {
            option.classList.add('selected');
            // Show correct/incorrect feedback
            if (i === currentQuestion.correctAnswer) {
                option.classList.add('correct');
            } else {
                option.classList.add('incorrect');
                // Show the correct answer
                options[currentQuestion.correctAnswer].classList.add('correct');
            }
        }
    });

    // Disable all options after selection
    Array.from(options).forEach(option => {
        option.disabled = true;
    });

    // Auto-advance to next question after a delay
    setTimeout(() => {
        if (currentQuestionIndex < 9) {
            goToNextQuestion();
        } else {
            finishQuiz();
        }
    }, 1500);
}

// Navigation
function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

function skipQuestion() {
    userAnswers[currentQuestionIndex] = null;
    goToNextQuestion();
}

function goToNextQuestion() {
    if (currentQuestionIndex < 9) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        finishQuiz();
    }
}

// Progress bar
function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / 10) * 100;
    progressBar.style.width = `${progress}%`;
}

function updateQuestionCounter() {
    questionCounter.textContent = `Question ${currentQuestionIndex + 1} of 10`;
}

// Quiz completion
function finishQuiz() {
    clearInterval(timerInterval);
    
    // Calculate results
    const attempted = userAnswers.filter(answer => answer !== null).length;
    const correct = userAnswers.reduce((count, answer, index) => {
        return count + (answer === currentQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
    
    // Calculate time taken
    const endTime = new Date();
    const timeTakenInSeconds = Math.floor((endTime - startTime) / 1000);
    const minutesTaken = Math.floor(timeTakenInSeconds / 60);
    const secondsTaken = timeTakenInSeconds % 60;
    
    // Update summary
    totalAttempted.textContent = attempted;
    correctAnswers.textContent = correct;
    finalScore.textContent = `${Math.round((correct / 10) * 100)}%`;
    timeTaken.textContent = `${minutesTaken}:${secondsTaken.toString().padStart(2, '0')}`;
    
    // Show summary screen
    quizContainer.classList.add('hidden');
    quizSummary.classList.remove('hidden');
}

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Event listeners
prevButton.addEventListener('click', goToPreviousQuestion);
skipButton.addEventListener('click', skipQuestion);
nextButton.addEventListener('click', goToNextQuestion);
restartButton.addEventListener('click', initializeQuiz);
modeToggle.addEventListener('click', toggleDarkMode);

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Start the quiz when the page loads
document.addEventListener('DOMContentLoaded', initializeQuiz);
