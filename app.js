// Quiz data
const quizData = [
  {
    question: "The Letter 'Z' is used to represent",
    options: ["Natural Numbers", "Whole Numbers", "Integers", "Negative Numbers"],
    correct: 2
  },
  {
    question: "0 (Zero) is",
    options: ["The Additive Identity", "The Multiplicative Identity", "Neither Positive Nor Negative", "Both a and c"],
    correct: 3
  },
  {
    question: "The Absolute Value of -33 is",
    options: ["33", "-33", "0", "3"],
    correct: 0
  },
  {
    question: "Associative Property holds good for",
    options: ["Subtraction", "Addition", "Division", "Both a and c"],
    correct: 1
  },
  {
    question: "The Additive Inverse of 66 is",
    options: ["6", "-6", "-66", "66"],
    correct: 2
  },
  {
    question: "0 _ -3 (Choose correct symbol)",
    options: ["<", ">", "=", "None of the above"],
    correct: 1
  },
  {
    question: "-3 _ 3 (Choose correct symbol)",
    options: ["<", ">", "=", "None of the above"],
    correct: 0
  },
  {
    question: "-93 - (-93) equals",
    options: ["0", "+93", "-93", "None of the above"],
    correct: 0
  },
  {
    question: "+74 + (-73) equals",
    options: ["-1", "-74", "+1", "+74"],
    correct: 2
  },
  {
    question: "Integers consists of:",
    options: ["Positive Numbers", "Zero (0)", "Negative Numbers", "All of the above"],
    correct: 3
  },
  {
    question: "Which property does NOT hold for subtraction of integers?",
    options: ["Closure", "Commutative", "Associative", "Both b and c"],
    correct: 3
  },
  {
    question: "The sum of an integer and its additive inverse is always",
    options: ["1", "-1", "0", "The integer itself"],
    correct: 2
  },
  {
    question: "On a number line, which direction do negative integers extend?",
    options: ["Right of zero", "Left of zero", "Above zero", "Below zero"],
    correct: 1
  },
  {
    question: "What is the result of (-15) + (+15)?",
    options: ["30", "-30", "0", "15"],
    correct: 2
  },
  {
    question: "The absolute value of any integer is always",
    options: ["Positive", "Negative", "Zero", "Non-negative"],
    correct: 3
  }
];

// Quiz state
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let quizCompleted = false;
let quizStarted = false;

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const questionContainer = document.getElementById('questionContainer');
const quizResult = document.getElementById('quizResult');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const currentScoreElement = document.getElementById('currentScore');
const finalScoreElement = document.getElementById('finalScore');
const scoreMessage = document.getElementById('scoreMessage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Navigation functionality
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const offsetTop = element.offsetTop - 80; // Account for fixed navbar
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

// Mobile menu toggle
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    const sectionId = href.substring(1);
    scrollToSection(sectionId);
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

// Tab functionality for properties
document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.getAttribute('data-tab');
    
    // Remove active class from all buttons and panels
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // Add active class to clicked button and corresponding panel
    button.classList.add('active');
    document.getElementById(tabId).classList.add('active');
  });
});

// Number line interactions
document.querySelectorAll('.number').forEach(number => {
  number.addEventListener('mouseenter', () => {
    const value = number.getAttribute('data-value');
    number.style.transform = 'scale(1.2)';
    
    // Add a tooltip effect
    if (!number.querySelector('.tooltip')) {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = `Integer: ${value}`;
      tooltip.style.cssText = `
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem;
        border-radius: 5px;
        font-size: 0.8rem;
        white-space: nowrap;
        z-index: 10;
        pointer-events: none;
      `;
      number.style.position = 'relative';
      number.appendChild(tooltip);
    }
  });
  
  number.addEventListener('mouseleave', () => {
    number.style.transform = 'scale(1)';
    const tooltip = number.querySelector('.tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  });
});

// Quiz functionality - completely rewritten for proper functionality
function initializeQuiz() {
  currentQuestion = 0;
  score = 0;
  userAnswers = Array(quizData.length).fill(null);
  quizCompleted = false;
  quizStarted = true;
  
  // Show quiz container and hide results
  questionContainer.classList.remove('hidden');
  quizResult.classList.add('hidden');
  
  // Display first question
  displayQuestion();
  updateProgress();
  updateScore();
}

function displayQuestion() {
  if (currentQuestion >= quizData.length) {
    finishQuiz();
    return;
  }

  const question = quizData[currentQuestion];
  
  // Update question text
  document.getElementById('question').textContent = question.question;
  
  // Clear and rebuild options
  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option';
    optionElement.textContent = option;
    optionElement.setAttribute('data-index', index);
    
    // Check if this option was previously selected
    if (userAnswers[currentQuestion] === index) {
      optionElement.classList.add('selected');
    }
    
    // Add click event listener
    optionElement.addEventListener('click', () => {
      if (!quizCompleted) {
        selectOption(index);
      }
    });
    
    optionsContainer.appendChild(optionElement);
  });
  
  // Update button states
  updateButtonStates();
  
  // If quiz is completed, show answer results
  if (quizCompleted) {
    showAnswerResults();
  }
}

function selectOption(selectedIndex) {
  if (quizCompleted) return;
  
  // Remove previous selection from all options
  document.querySelectorAll('.option').forEach(opt => {
    opt.classList.remove('selected');
  });
  
  // Add selection to clicked option
  const selectedOption = document.querySelector(`[data-index="${selectedIndex}"]`);
  if (selectedOption) {
    selectedOption.classList.add('selected');
  }
  
  // Store the answer
  userAnswers[currentQuestion] = selectedIndex;
  
  // Update button states
  updateButtonStates();
}

function updateButtonStates() {
  // Update Previous button
  prevBtn.disabled = currentQuestion === 0;
  
  // Update Next button
  if (currentQuestion === quizData.length - 1) {
    nextBtn.textContent = 'Finish Quiz';
  } else {
    nextBtn.textContent = 'Next Question';
  }
  
  // Enable/disable Next button based on whether an answer is selected
  if (quizCompleted) {
    nextBtn.disabled = false;
  } else {
    nextBtn.disabled = userAnswers[currentQuestion] === null;
  }
}

function showAnswerResults() {
  const question = quizData[currentQuestion];
  const userAnswer = userAnswers[currentQuestion];
  const correctAnswer = question.correct;
  
  document.querySelectorAll('.option').forEach((option, index) => {
    option.classList.remove('selected', 'correct', 'incorrect');
    
    if (index === correctAnswer) {
      option.classList.add('correct');
    } else if (index === userAnswer && index !== correctAnswer) {
      option.classList.add('incorrect');
    }
    
    // Disable clicking
    option.style.pointerEvents = 'none';
  });
}

function nextQuestion() {
  if (!quizCompleted && userAnswers[currentQuestion] === null) {
    alert('Please select an answer before proceeding.');
    return;
  }
  
  if (currentQuestion < quizData.length - 1) {
    currentQuestion++;
    displayQuestion();
    updateProgress();
  } else {
    finishQuiz();
  }
}

function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    displayQuestion();
    updateProgress();
  }
}

function finishQuiz() {
  if (!quizCompleted) {
    // Calculate final score
    score = 0;
    userAnswers.forEach((answer, index) => {
      if (answer !== null && answer === quizData[index].correct) {
        score++;
      }
    });
    
    quizCompleted = true;
  }
  
  // Hide question container and show results
  questionContainer.classList.add('hidden');
  quizResult.classList.remove('hidden');
  
  // Display final score
  const percentage = Math.round((score / quizData.length) * 100);
  finalScoreElement.textContent = `${score}/${quizData.length} (${percentage}%)`;
  
  // Display appropriate message based on score
  let message = '';
  if (percentage >= 90) {
    message = 'Excellent! You have mastered integers! 🎉';
  } else if (percentage >= 75) {
    message = 'Great job! You have a good understanding of integers. 👏';
  } else if (percentage >= 60) {
    message = 'Good work! You understand the basics of integers. 👍';
  } else if (percentage >= 40) {
    message = 'Keep practicing! You\'re getting there. 💪';
  } else {
    message = 'Don\'t give up! Review the material and try again. 📚';
  }
  
  scoreMessage.textContent = message;
  updateScore();
}

function restartQuiz() {
  // Reset all quiz state
  currentQuestion = 0;
  score = 0;
  userAnswers = Array(quizData.length).fill(null);
  quizCompleted = false;
  quizStarted = true;
  
  // Show question container and hide results
  questionContainer.classList.remove('hidden');
  quizResult.classList.add('hidden');
  
  // Reset and display first question
  displayQuestion();
  updateProgress();
  updateScore();
}

function updateProgress() {
  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  progressFill.style.width = `${progress}%`;
  progressText.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
}

function updateScore() {
  currentScoreElement.textContent = score;
}

// Scroll animations
function handleScrollAnimations() {
  const elements = document.querySelectorAll('.content-card, .operation-card');
  
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < window.innerHeight - elementVisible) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
}

// Navbar scroll effect
function handleNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 100) {
    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    navbar.style.boxShadow = '0 2px 20px rgba(147, 112, 219, 0.3)';
  } else {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    navbar.style.boxShadow = '0 2px 20px rgba(147, 112, 219, 0.2)';
  }
}

// Parallax effect for hero section
function handleParallax() {
  const hero = document.querySelector('.hero');
  const scrolled = window.pageYOffset;
  const rate = scrolled * -0.5;
  
  if (hero) {
    hero.style.transform = `translateY(${rate}px)`;
  }
}

// Smooth reveal animations
function initScrollAnimations() {
  const cards = document.querySelectorAll('.content-card, .operation-card');
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
}

// Active navigation link highlighting
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// Intersection Observer for animations
function setupIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.content-card, .operation-card, .type-item').forEach(el => {
    observer.observe(el);
  });
}

// Add ripple effect to buttons
function addRippleEffect(button, event) {
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple 0.6s linear;
    left: ${x}px;
    top: ${y}px;
    width: ${size}px;
    height: ${size}px;
    pointer-events: none;
  `;
  
  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Event Listeners
window.addEventListener('scroll', () => {
  handleScrollAnimations();
  handleNavbarScroll();
  handleParallax();
  updateActiveNavLink();
});

window.addEventListener('resize', () => {
  // Close mobile menu on resize
  navMenu.classList.remove('active');
  hamburger.classList.remove('active');
});

// Add ripple effect to all buttons
document.addEventListener('click', (e) => {
  if (e.target.matches('button, .btn')) {
    addRippleEffect(e.target, e);
  }
});

// Keyboard navigation for quiz
document.addEventListener('keydown', (e) => {
  const quizSection = document.getElementById('quiz');
  const quizRect = quizSection.getBoundingClientRect();
  
  // Only handle keyboard events when quiz is visible
  if (quizRect.top < window.innerHeight && quizRect.bottom > 0 && quizStarted) {
    if (e.key >= '1' && e.key <= '4') {
      const index = parseInt(e.key) - 1;
      const option = document.querySelector(`[data-index="${index}"]`);
      if (option && !quizCompleted) {
        selectOption(index);
      }
    } else if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
      e.preventDefault();
      previousQuestion();
    } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
      e.preventDefault();
      nextQuestion();
    } else if (e.key === 'Enter' && !nextBtn.disabled) {
      e.preventDefault();
      nextQuestion();
    }
  }
});

// Touch gestures for mobile quiz navigation
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const swipeDistance = touchEndX - touchStartX;
  const quizSection = document.getElementById('quiz');
  const quizRect = quizSection.getBoundingClientRect();
  
  // Only handle swipes when quiz is visible
  if (quizRect.top < window.innerHeight && quizRect.bottom > 0 && quizStarted) {
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0 && !prevBtn.disabled) {
        // Swipe right - previous question
        previousQuestion();
      } else if (swipeDistance < 0 && !nextBtn.disabled) {
        // Swipe left - next question
        nextQuestion();
      }
    }
  }
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debouncing to scroll handler
const debouncedScrollHandler = debounce(() => {
  handleScrollAnimations();
  handleNavbarScroll();
  updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);
window.addEventListener('scroll', handleParallax);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize quiz
  initializeQuiz();
  
  // Initialize animations
  initScrollAnimations();
  setupIntersectionObserver();
  
  // Add smooth scroll behavior to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Add loading animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
  
  // Ensure quiz starts properly when page loads
  setTimeout(() => {
    if (quizStarted) {
      displayQuestion();
      updateProgress();
      updateScore();
    }
  }, 200);
});

// Auto-save quiz progress (optional enhancement)
function saveQuizProgress() {
  const quizState = {
    currentQuestion,
    score,
    userAnswers,
    quizCompleted,
    quizStarted
  };
  // Note: localStorage not used as per strict instructions
  // This function is prepared for future enhancement if needed
}

// Quiz validation helper
function validateQuizState() {
  // Ensure quiz state is consistent
  if (currentQuestion < 0) currentQuestion = 0;
  if (currentQuestion >= quizData.length) currentQuestion = quizData.length - 1;
  if (score < 0) score = 0;
  if (score > quizData.length) score = quizData.length;
  if (!Array.isArray(userAnswers)) userAnswers = Array(quizData.length).fill(null);
}

// Call validation periodically to ensure quiz remains functional
setInterval(validateQuizState, 1000);