/**
 * User Pretest Integration
 * CodeSmart LMS - Supabase Backend
 */

// Check authentication
if (!authService.requireAuth()) {
    window.location.href = '/index.html';
}

let currentUser = null;
let currentQuestionIndex = 0;
let userAnswers = [];

// Pretest questions
const pretestQuestions = [
    {
        id: 1,
        question: "Apa output dari: console.log(typeof null)?",
        options: [
            "null",
            "undefined",
            "object",
            "number"
        ],
        correctAnswer: 2,
        category: "fundamental"
    },
    {
        id: 2,
        question: "Apa perbedaan antara '==' dan '===' di JavaScript?",
        options: [
            "Tidak ada perbedaan",
            "== membandingkan nilai, === membandingkan nilai dan tipe data",
            "== lebih cepat dari ===",
            "=== hanya untuk angka"
        ],
        correctAnswer: 1,
        category: "fundamental"
    },
    {
        id: 3,
        question: "Apa output dari: console.log(1 + '1')?",
        options: [
            "2",
            "11",
            "undefined",
            "Error"
        ],
        correctAnswer: 1,
        category: "fundamental"
    },
    {
        id: 4,
        question: "Apa fungsi dari method .map() pada array?",
        options: [
            "Mencari elemen dalam array",
            "Mengubah setiap elemen array dan mengembalikan array baru",
            "Mengurutkan array",
            "Menghapus elemen dari array"
        ],
        correctAnswer: 1,
        category: "intermediate"
    },
    {
        id: 5,
        question: "Apa itu closure dalam JavaScript?",
        options: [
            "Cara untuk menutup browser",
            "Function yang memiliki akses ke variabel outer function",
            "Cara untuk menghentikan loop",
            "Method untuk menutup file"
        ],
        correctAnswer: 1,
        category: "intermediate"
    },
    {
        id: 6,
        question: "Apa output dari: console.log([1, 2] + [3, 4])?",
        options: [
            "[1, 2, 3, 4]",
            "1,23,4",
            "Error",
            "undefined"
        ],
        correctAnswer: 1,
        category: "intermediate"
    },
    {
        id: 7,
        question: "Apa itu Promise dalam JavaScript?",
        options: [
            "Cara untuk membuat janji",
            "Object yang merepresentasikan hasil operasi asynchronous",
            "Method untuk menunggu response",
            "Cara untuk handle error"
        ],
        correctAnswer: 1,
        category: "advance"
    },
    {
        id: 8,
        question: "Apa perbedaan antara async/await dan Promise?",
        options: [
            "Async/await lebih lambat",
            "Promise lebih modern",
            "Async/await adalah syntactic sugar untuk Promise",
            "Tidak ada perbedaan"
        ],
        correctAnswer: 2,
        category: "advance"
    },
    {
        id: 9,
        question: "Apa itu Event Loop dalam JavaScript?",
        options: [
            "Loop biasa seperti for loop",
            "Mekanisme untuk menangani operasi asynchronous",
            "Cara untuk handle event click",
            "Method untuk looping array"
        ],
        correctAnswer: 1,
        category: "advance"
    },
    {
        id: 10,
        question: "Apa output dari: console.log(0.1 + 0.2 === 0.3)?",
        options: [
            "true",
            "false",
            "undefined",
            "Error"
        ],
        correctAnswer: 1,
        category: "fundamental"
    }
];

// Initialize
async function initPretest() {
    try {
        showLoading(true);

        // Get current user
        currentUser = authService.getCurrentUser();

        // Check if already completed pretest
        if (currentUser && currentUser.pretest_score !== null && currentUser.pretest_score !== undefined) {
            // User has already taken pretest, redirect to dashboard
            window.location.href = 'dashboard-new.html';
            return;
        }

        // Set user greeting
        const greetingEl = document.getElementById('userGreeting');
        if (greetingEl) {
            greetingEl.textContent = `Halo, ${currentUser.name}!`;
        }

        showLoading(false);
    } catch (error) {
        console.error('Init pretest error:', error);
        showLoading(false);
    }
}

// Start pretest
function startPretest() {
    document.getElementById('welcomeSection').style.display = 'none';
    document.getElementById('questionSection').style.display = 'block';

    // Initialize answers array
    userAnswers = new Array(pretestQuestions.length).fill(null);

    // Render first question
    renderQuestion(0);
}

// Render question
function renderQuestion(index) {
    currentQuestionIndex = index;
    const question = pretestQuestions[index];

    const container = document.getElementById('questionsContainer');
    container.innerHTML = `
        <div class="question-container active">
            <div class="question-header">
                <span class="question-number">Pertanyaan ${index + 1} dari ${pretestQuestions.length}</span>
                <span class="question-progress">${Math.round((index / pretestQuestions.length) * 100)}%</span>
            </div>
            <div class="question-text">${question.question}</div>
            <div class="options">
                ${question.options.map((option, optIndex) => `
                    <button class="option ${userAnswers[index] === optIndex ? 'selected' : ''}"
                            onclick="selectAnswer(${optIndex})">
                        ${String.fromCharCode(65 + optIndex)}. ${option}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    // Update navigation buttons
    updateNavigationButtons();
}

// Select answer
function selectAnswer(optionIndex) {
    userAnswers[currentQuestionIndex] = optionIndex;

    // Update UI
    const options = document.querySelectorAll('.option');
    options.forEach((opt, idx) => {
        if (idx === optionIndex) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });
}

// Previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        renderQuestion(currentQuestionIndex - 1);
    }
}

// Next question
function nextQuestion() {
    if (currentQuestionIndex < pretestQuestions.length - 1) {
        renderQuestion(currentQuestionIndex + 1);
    }
}

// Update navigation buttons
function updateNavigationButtons() {
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnFinish = document.getElementById('btnFinish');

    // Previous button
    btnPrev.disabled = currentQuestionIndex === 0;

    // Next/Finish button
    if (currentQuestionIndex === pretestQuestions.length - 1) {
        btnNext.style.display = 'none';
        btnFinish.style.display = 'block';
    } else {
        btnNext.style.display = 'block';
        btnFinish.style.display = 'none';
    }
}

// Finish pretest
async function finishPretest() {
    // Check if all questions answered
    const unanswered = userAnswers.filter(ans => ans === null).length;
    if (unanswered > 0) {
        if (!confirm(`Anda masih memiliki ${unanswered} soal yang belum dijawab. Lanjutkan submit?`)) {
            return;
        }
    }

    try {
        showLoading(true);

        // Calculate score
        const score = calculateScore();

        // Submit to backend
        const response = await apiService.submitPretest({
            answers: userAnswers,
            score: score
        });

        if (response.success) {
            // Update local user data
            currentUser = response.data.user;
            authService.updateUser(currentUser);

            // Show results
            showResults(score, response.data.level);
        } else {
            throw new Error(response.message || 'Failed to submit pretest');
        }

        showLoading(false);
    } catch (error) {
        console.error('Submit pretest error:', error);
        alert('Gagal submit pretest: ' + error.message);
        showLoading(false);
    }
}

// Calculate score using simple scoring
function calculateScore() {
    let correctCount = 0;

    pretestQuestions.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
            correctCount++;
        }
    });

    // Calculate percentage (0-100)
    const score = Math.round((correctCount / pretestQuestions.length) * 100);

    return score;
}

// Show results
function showResults(score, level) {
    // Hide question section
    document.getElementById('questionSection').style.display = 'none';

    // Show results section
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.classList.add('active');

    // Display score
    document.getElementById('scoreDisplay').textContent = score;

    // Display recommendation
    let recommendationTitle = '';
    let recommendationMessage = '';

    if (score <= 45) {
        recommendationTitle = 'Fundamental JavaScript';
        recommendationMessage = 'Anda akan memulai dari dasar untuk membangun fondasi yang kuat dalam JavaScript.';
    } else if (score <= 65) {
        recommendationTitle = 'Intermediate JavaScript';
        recommendationMessage = 'Anda memiliki pemahaman dasar yang baik. Mari tingkatkan skill Anda ke level menengah!';
    } else {
        recommendationTitle = 'Advance JavaScript';
        recommendationMessage = 'Selamat! Anda memiliki pemahaman yang sangat baik. Siap untuk materi advanced!';
    }

    document.getElementById('recommendationTitle').textContent = recommendationTitle;
    document.getElementById('recommendationMessage').textContent = recommendationMessage;

    // Display analysis
    const correctCount = pretestQuestions.filter((q, i) => userAnswers[i] === q.correctAnswer).length;
    const wrongCount = pretestQuestions.length - correctCount;

    document.getElementById('analysisDetails').innerHTML = `
        <div class="analysis-item">✅ Jawaban Benar: <strong>${correctCount} dari ${pretestQuestions.length}</strong></div>
        <div class="analysis-item">❌ Jawaban Salah: <strong>${wrongCount}</strong></div>
        <div class="analysis-item">📊 Persentase: <strong>${score}%</strong></div>
        <div class="analysis-item">🎯 Level: <strong>${level.toUpperCase()}</strong></div>
    `;
}

// Go to dashboard
function goToDashboard() {
    window.location.href = 'dashboard-new.html';
}

// Loading spinner
function showLoading(show) {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

// Auto-init when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPretest);
} else {
    initPretest();
}
