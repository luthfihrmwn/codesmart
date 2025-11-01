// Simplified SVM Implementation for Module Recommendation
// This is a simplified version for educational purposes

class SVMRecommendation {
    constructor() {
        // Define score boundaries for each module level
        this.boundaries = {
            fundamental: { min: 0, max: 45 },
            intermediate: { min: 46, max: 65 },
            advance: { min: 66, max: 100 }
        };
    }

    // Calculate pretest score
    calculateScore(answers, questions) {
        let correctAnswers = 0;
        const totalQuestions = questions.length;

        answers.forEach((answer, index) => {
            if (questions[index] && answer === questions[index].correctAnswer) {
                correctAnswers++;
            }
        });

        // Calculate percentage score
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        return score;
    }

    // Recommend module based on score using SVM-like classification
    recommendModule(score) {
        // SVM-like decision function
        // In a real SVM, this would use support vectors and kernel functions
        // Here we use simple boundary classification

        if (score >= this.boundaries.fundamental.min && score <= this.boundaries.fundamental.max) {
            return {
                level: 'fundamental',
                moduleName: 'Fundamental JavaScript',
                score: score,
                message: 'Mulai dari dasar untuk membangun fondasi yang kuat!',
                nextLevel: 'intermediate',
                scoreNeeded: this.boundaries.intermediate.min
            };
        } else if (score >= this.boundaries.intermediate.min && score <= this.boundaries.intermediate.max) {
            return {
                level: 'intermediate',
                moduleName: 'Intermediate JavaScript',
                score: score,
                message: 'Tingkatkan skill Anda ke level menengah!',
                nextLevel: 'advance',
                scoreNeeded: this.boundaries.advance.min
            };
        } else if (score >= this.boundaries.advance.min && score <= this.boundaries.advance.max) {
            return {
                level: 'advance',
                moduleName: 'Advance JavaScript',
                score: score,
                message: 'Selamat! Anda siap untuk materi advanced!',
                nextLevel: null,
                scoreNeeded: null
            };
        } else {
            // Default to fundamental if score is invalid
            return {
                level: 'fundamental',
                moduleName: 'Fundamental JavaScript',
                score: score,
                message: 'Mulai dari dasar untuk membangun fondasi yang kuat!',
                nextLevel: 'intermediate',
                scoreNeeded: this.boundaries.intermediate.min
            };
        }
    }

    // Get learning path suggestion
    getLearningPath(score) {
        const recommendation = this.recommendModule(score);
        const path = [];

        // Build learning path based on score
        if (score <= this.boundaries.fundamental.max) {
            path.push('fundamental');
            path.push('intermediate (Terkunci - Score minimal: 46)');
            path.push('advance (Terkunci - Score minimal: 66)');
        } else if (score <= this.boundaries.intermediate.max) {
            path.push('fundamental (Sudah dikuasai)');
            path.push('intermediate');
            path.push('advance (Terkunci - Score minimal: 66)');
        } else {
            path.push('fundamental (Sudah dikuasai)');
            path.push('intermediate (Sudah dikuasai)');
            path.push('advance');
        }

        return {
            recommendation: recommendation,
            learningPath: path
        };
    }

    // Analyze pretest results in detail
    analyzeResults(answers, questions) {
        const score = this.calculateScore(answers, questions);
        const recommendation = this.recommendModule(score);

        // Analyze by difficulty
        const difficultyAnalysis = {
            easy: { correct: 0, total: 0 },
            medium: { correct: 0, total: 0 },
            hard: { correct: 0, total: 0 }
        };

        answers.forEach((answer, index) => {
            const question = questions[index];
            if (question) {
                const difficulty = question.difficulty;
                difficultyAnalysis[difficulty].total++;

                if (answer === question.correctAnswer) {
                    difficultyAnalysis[difficulty].correct++;
                }
            }
        });

        // Calculate percentage for each difficulty
        Object.keys(difficultyAnalysis).forEach(difficulty => {
            const analysis = difficultyAnalysis[difficulty];
            analysis.percentage = analysis.total > 0
                ? Math.round((analysis.correct / analysis.total) * 100)
                : 0;
        });

        return {
            score: score,
            totalQuestions: questions.length,
            correctAnswers: answers.filter((ans, idx) => ans === questions[idx].correctAnswer).length,
            recommendation: recommendation,
            difficultyAnalysis: difficultyAnalysis,
            strengths: this.identifyStrengths(difficultyAnalysis),
            weaknesses: this.identifyWeaknesses(difficultyAnalysis)
        };
    }

    // Identify strengths based on difficulty analysis
    identifyStrengths(difficultyAnalysis) {
        const strengths = [];

        if (difficultyAnalysis.easy.percentage >= 80) {
            strengths.push('Pemahaman konsep dasar sangat baik');
        }
        if (difficultyAnalysis.medium.percentage >= 70) {
            strengths.push('Mampu menangani konsep menengah dengan baik');
        }
        if (difficultyAnalysis.hard.percentage >= 60) {
            strengths.push('Menguasai konsep-konsep advanced');
        }

        return strengths.length > 0 ? strengths : ['Terus semangat belajar!'];
    }

    // Identify weaknesses based on difficulty analysis
    identifyWeaknesses(difficultyAnalysis) {
        const weaknesses = [];

        if (difficultyAnalysis.easy.percentage < 60) {
            weaknesses.push('Perlu memperkuat pemahaman konsep dasar');
        }
        if (difficultyAnalysis.medium.percentage < 50) {
            weaknesses.push('Perlu lebih banyak latihan untuk konsep menengah');
        }
        if (difficultyAnalysis.hard.percentage < 40) {
            weaknesses.push('Konsep advanced memerlukan pembelajaran lebih lanjut');
        }

        return weaknesses.length > 0 ? weaknesses : [];
    }
}

// Create global SVM instance
const svmRecommendation = new SVMRecommendation();
