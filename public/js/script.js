// Page Navigation System
let currentPage = 'entry-page';
let visitHistory = [];

function showPage(pageId) {
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        visitHistory.push(currentPage);
        currentPage = pageId;
        targetPage.classList.add('active');
    }
}

// Mysterious Questions
const questions = [
    "what is the meaning?",
    "where does it end?",
    "who are you?",
    "why are you here?",
    "what do you want?",
    "is this real?",
    "can you escape?",
    "do you believe?",
    "what is truth?",
    "are you alone?",
    "where is everyone?",
    "what happens next?",
    "is there hope?",
    "do you remember?",
    "when does it start?",
    "how did you get here?",
    "what did you lose?",
    "who is watching?",
    "can you see?",
    "is it over?"
];

const answers = [
    "there is no meaning, only experience",
    "it never ends",
    "you are everyone and no one",
    "you were invited",
    "what everyone wants: to belong",
    "as real as anything else",
    "no one escapes",
    "belief is optional",
    "truth is relative",
    "everyone is alone together",
    "they are here, watching",
    "nothing. everything continues",
    "hope is the first lie",
    "memory is unreliable",
    "it already started",
    "you have always been here",
    "nothing you can name",
    "everyone. no one.",
    "open your eyes",
    "it has just begun"
];

// Entry Page - Click to continue
setTimeout(() => {
    const entryPage = document.getElementById('entry-page');
    if (entryPage) {
        entryPage.addEventListener('click', () => {
            showPage('main-page');
        });
    }
}, 2000);

// Main Page - "that" link
const thatLink = document.getElementById('that-link');
if (thatLink) {
    thatLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Randomly choose between different paths
        const paths = ['access-page', 'redemption-page', 'search-page'];
        const randomPath = paths[Math.floor(Math.random() * paths.length)];
        showPage(randomPath);
    });
}

// Access Page - Logo click
const logo = document.getElementById('logo');
if (logo) {
    logo.addEventListener('click', () => {
        showPage('disclaimer-page');
    });
}

// Disclaimer Page
const applyLink = document.getElementById('apply-link');
const dontLink = document.getElementById('dont-link');

if (applyLink) {
    applyLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('apply-page');
    });
}

if (dontLink) {
    dontLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Close or go back
        if (visitHistory.length > 0) {
            const previousPage = visitHistory.pop();
            currentPage = previousPage;
            showPage(previousPage);
        }
    });
}

// Apply Page
const submitEmail = document.getElementById('submit-email');
const cancelLink = document.getElementById('cancel');
const emailInput = document.getElementById('email-input');

if (submitEmail) {
    submitEmail.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = emailInput ? emailInput.value : '';
        
        if (email && email.includes('@')) {
            // Submit to serverless function
            try {
                const response = await fetch('/api/submit-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (response.ok) {
                    // Success - show final page
                    showPage('final-page');
                    if (emailInput) emailInput.value = '';
                    
                    setTimeout(() => {
                        showPage('void-page');
                    }, 3000);
                } else {
                    // Error handling - subtle indication
                    if (emailInput) {
                        emailInput.style.borderBottomColor = '#ff0000';
                        setTimeout(() => {
                            emailInput.style.borderBottomColor = '#ffffff';
                        }, 1000);
                    }
                }
            } catch (error) {
                console.error('Submission error:', error);
                // On error, still show success (mysterious behavior)
                showPage('final-page');
                setTimeout(() => {
                    showPage('void-page');
                }, 3000);
            }
        } else {
            // Subtle indication
            if (emailInput) {
                emailInput.style.borderBottomColor = '#ff0000';
                setTimeout(() => {
                    emailInput.style.borderBottomColor = '#ffffff';
                }, 1000);
            }
        }
    });
}

if (cancelLink) {
    cancelLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('disclaimer-page');
    });
}

// Redemption Page
const soulLink = document.getElementById('soul-link');
if (soulLink) {
    soulLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('questions-page');
        initializeQuestions();
    });
}

// Questions Page
function initializeQuestions() {
    const container = document.getElementById('questions-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create floating questions
    questions.forEach((question, index) => {
        setTimeout(() => {
            const questionEl = document.createElement('div');
            questionEl.className = 'question';
            questionEl.textContent = question;
            questionEl.style.left = Math.random() * 80 + 10 + '%';
            questionEl.style.top = Math.random() * 80 + 10 + '%';
            
            const answer = answers[index];
            questionEl.addEventListener('click', () => {
                questionEl.textContent = answer;
                questionEl.style.color = '#999999';
            });
            
            container.appendChild(questionEl);
        }, index * 100);
    });
}

const yesLink = document.getElementById('yes-link');
if (yesLink) {
    yesLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('payment-page');
        randomizeCoffeePosition();
    });
}

// Payment Page
const paymentBtns = document.querySelectorAll('.payment-btn');
paymentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const amount = btn.dataset.amount;
        // Glitch effect
        document.body.classList.add('glitch-effect');
        setTimeout(() => {
            document.body.classList.remove('glitch-effect');
            showPage('void-page');
        }, 300);
    });
});

// Random Coffee Widget Position
function randomizeCoffeePosition() {
    setTimeout(() => {
        const coffeeWidget = document.querySelector('.coffee-widget');
        if (coffeeWidget) {
            const randomTop = Math.random() * 60 + 10; // 10-70%
            const randomLeft = Math.random() * 60 + 20; // 20-80%
            coffeeWidget.style.position = 'fixed';
            coffeeWidget.style.top = randomTop + '%';
            coffeeWidget.style.left = randomLeft + '%';
            coffeeWidget.style.transform = 'translate(-50%, -50%)';
        }
    }, 100);
}

// Matrix rain effect (defined before use)
function startMatrixRain() {
    const chars = '01 hell.com ↓ ... --- ...'.split('');
    const interval = setInterval(() => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = Math.random() * window.innerWidth;
        const el = document.createElement('div');
        el.textContent = char;
        el.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: -20px;
            color: #00ff00;
            font-family: monospace;
            font-size: 14px;
            pointer-events: none;
            z-index: 9999;
            animation: matrix-fall 3s linear forwards;
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }, 100);
    
    const matrixStyle = document.createElement('style');
    matrixStyle.textContent = `
        @keyframes matrix-fall {
            to {
                transform: translateY(100vh);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(matrixStyle);
    
    setTimeout(() => {
        clearInterval(interval);
        showPage('secret-2');
    }, 5000);
}

// Search Page
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.toLowerCase().trim();
            
            console.log('Search query:', query); // Debug
            
            // Secret searches
            if (query === 'matrix') {
                console.log('Activating matrix...');
                startMatrixRain();
                searchInput.value = '';
            } else if (query === 'surface') {
                console.log('Opening secret-1...');
                showPage('secret-1');
                searchInput.value = '';
            } else if (query === '666') {
                console.log('Opening secret-3...');
                showPage('secret-3');
                searchInput.value = '';
            }
            // Regular searches
            else if (query === 'redemption') {
                showPage('questions-page');
                initializeQuestions();
            } else if (query === 'hell') {
                showPage('access-page');
            } else if (query === 'answer') {
                showPage('abyss-page');
            } else if (query) {
                // Random mysterious response
                searchInput.value = '';
                searchInput.placeholder = 'no results found';
                setTimeout(() => {
                    searchInput.placeholder = '';
                }, 2000);
            }
        }
    });
} else {
    console.log('Search input not found!');
}

// Void Page
const doItLink = document.getElementById('do-it');
if (doItLink) {
    doItLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('payment-page');
    });
}

// Mysterious title changes
const titles = [
    'void',
    'v o i d',
    '...',
    'parallel web',
    'voided',
    'no access',
    'zeh ell',
    'z v u c k . c o m',
];

let titleIndex = 0;
setInterval(() => {
    document.title = titles[titleIndex];
    titleIndex = (titleIndex + 1) % titles.length;
}, 5000);

// Random glitches
setInterval(() => {
    if (Math.random() > 0.95) {
        document.body.classList.add('glitch-effect');
        setTimeout(() => {
            document.body.classList.remove('glitch-effect');
        }, 300);
    }
}, 10000);

// Subtle cursor hide on certain pages
document.addEventListener('mousemove', () => {
    if (currentPage === 'abyss-page' || currentPage === 'void-page') {
        document.body.style.cursor = 'none';
    } else {
        document.body.style.cursor = 'default';
    }
});

// Console messages
console.log('%c', 'font-size: 1px;');
console.log('%cyou found something', 'color: #666; font-family: monospace;');
console.log('%c', 'font-size: 1px;');
console.log('%cthis is a parallel web', 'color: #333; font-family: monospace; font-size: 10px;');
console.log('%cthere is no public access', 'color: #333; font-family: monospace; font-size: 10px;');
console.log('%c', 'font-size: 1px;');

// Easter egg: type "hell" anywhere
let keyBuffer = '';
let secretBuffer = '';
let morseBuffer = [];
let clickSequence = [];
let lastClickTime = 0;

document.addEventListener('keypress', (e) => {
    keyBuffer += e.key;
    keyBuffer = keyBuffer.slice(-4);
    secretBuffer += e.key;
    secretBuffer = secretBuffer.slice(-20);
    
    if (keyBuffer === 'hell') {
        showPage('access-page');
        keyBuffer = '';
    }
    
    // Secret code 1: "void" - extremely cryptic
    if (secretBuffer.includes('void')) {
        showPage('secret-1');
        secretBuffer = '';
    }
    
    // Secret code 2: "observer" - very hard to guess
    if (secretBuffer.includes('observer')) {
        showPage('secret-2');
        secretBuffer = '';
    }
    
    // Secret code 3: "lucifer" (morse code hint in secret-2)
    if (secretBuffer.includes('lucifer')) {
        showPage('secret-3');
        secretBuffer = '';
    }
    
    // Secret code 4: "nowhere"
    if (secretBuffer.includes('nowhere')) {
        showPage('nowhere');
        secretBuffer = '';
    }
    
    // Secret code 5: "1995" - the original hell.com year
    if (secretBuffer.includes('1995')) {
        document.body.style.filter = 'invert(1)';
        setTimeout(() => {
            document.body.style.filter = 'invert(0)';
        }, 3000);
        secretBuffer = '';
    }
    
    // Secret code 6: "parallel"
    if (secretBuffer.includes('parallel')) {
        document.body.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            document.body.style.transform = 'rotate(0deg)';
        }, 2000);
        secretBuffer = '';
    }
});

// Morse code detector (dot = fast click, dash = slow click)
document.addEventListener('click', (e) => {
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime;
    
    if (timeSinceLastClick < 2000) {
        if (timeSinceLastClick < 300) {
            morseBuffer.push('.');
        } else {
            morseBuffer.push('-');
        }
        
        morseBuffer = morseBuffer.slice(-10);
        
        // SOS in morse: ...---...
        if (morseBuffer.join('') === '...---...') {
            showPage('secret-1');
            morseBuffer = [];
        }
    } else {
        morseBuffer = [];
    }
    
    lastClickTime = currentTime;
});

// Triple click on logo reveals secret
let logoClickCount = 0;
if (logo) {
    logo.addEventListener('click', () => {
        logoClickCount++;
        if (logoClickCount === 3) {
            showPage('secret-2');
            logoClickCount = 0;
        }
        setTimeout(() => {
            logoClickCount = 0;
        }, 1000);
    });
}

// Hold 'Shift' and click warning text 5 times
let warningClickCount = 0;
const warningText = document.querySelector('.warning-text');
if (warningText) {
    warningText.addEventListener('click', (e) => {
        if (e.shiftKey) {
            warningClickCount++;
            if (warningClickCount === 5) {
                showPage('secret-3');
                warningClickCount = 0;
            }
        }
    });
}

// Secret: hover over disclaimer logo for 10 seconds
const disclaimerLogo = document.querySelector('.disclaimer-logo');
let hoverTimer;
if (disclaimerLogo) {
    disclaimerLogo.addEventListener('mouseenter', () => {
        hoverTimer = setTimeout(() => {
            showPage('nowhere');
        }, 10000);
    });
    
    disclaimerLogo.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimer);
    });
}

// Ambient background color shifts (very subtle)
let hue = 0;
setInterval(() => {
    hue = (hue + 0.1) % 10;
    const darkness = Math.floor(hue);
    document.body.style.background = `rgb(${darkness}, 0, 0)`;
}, 5000);

// Random page transitions (rarely)
setInterval(() => {
    if (Math.random() > 0.98 && currentPage !== 'entry-page') {
        const mysteryPages = ['void-page', 'abyss-page'];
        const randomPage = mysteryPages[Math.floor(Math.random() * mysteryPages.length)];
        showPage(randomPage);
        
        // Return after a moment
        setTimeout(() => {
            if (visitHistory.length > 0) {
                const prevPage = visitHistory.pop();
                showPage(prevPage);
            }
        }, 3000);
    }
}, 60000);
