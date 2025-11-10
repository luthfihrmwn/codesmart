/**
 * Seed Assessor Data Script
 * Populates database with comprehensive sample data for assessor dashboard
 * Includes learning materials, submissions, and additional assignments
 */

const { getClient } = require('../config/database');

// Sample learning materials with varied types
const learningMaterialsData = [
    {
        class_number: 6,
        title: 'Functions and Scope',
        description: 'Deep dive into function declarations, expressions, and scope in JavaScript.',
        content: {
            theory: 'Functions are fundamental building blocks in JavaScript. Understanding scope is crucial for writing maintainable code.',
            examples: [
                { title: 'Function Declaration', code: 'function add(a, b) {\n  return a + b;\n}' },
                { title: 'Function Expression', code: 'const multiply = function(a, b) {\n  return a * b;\n};' },
                { title: 'Arrow Function', code: 'const divide = (a, b) => a / b;' }
            ],
            video_url: 'https://www.youtube.com/watch?v=gigtS_5KOqo',
            resources: [
                { type: 'PDF', url: 'https://example.com/functions-guide.pdf', title: 'Complete Functions Guide' },
                { type: 'Code Example', url: 'https://github.com/examples/js-functions', title: 'Function Examples Repo' }
            ]
        },
        order_index: 6,
        duration_minutes: 75,
        is_published: true
    },
    {
        class_number: 7,
        title: 'Error Handling in JavaScript',
        description: 'Learn how to handle errors gracefully using try-catch blocks and custom errors.',
        content: {
            theory: 'Error handling is essential for building robust applications. JavaScript provides try-catch-finally blocks and allows custom error creation.',
            examples: [
                { title: 'Try-Catch', code: 'try {\n  throw new Error("Something went wrong");\n} catch(error) {\n  console.error(error.message);\n}' },
                { title: 'Custom Error', code: 'class ValidationError extends Error {\n  constructor(message) {\n    super(message);\n    this.name = "ValidationError";\n  }\n}' }
            ],
            video_url: 'https://www.youtube.com/watch?v=cFTFtuEQ-10',
            resources: [
                { type: 'Document', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling', title: 'MDN Error Handling' }
            ]
        },
        order_index: 7,
        duration_minutes: 60,
        is_published: true
    },
    {
        class_number: 8,
        title: 'Working with Strings',
        description: 'Master string manipulation methods, template literals, and regex basics.',
        content: {
            theory: 'Strings are one of the most commonly used data types. JavaScript provides numerous methods for string manipulation.',
            examples: [
                { title: 'Template Literals', code: 'const name = "John";\nconst greeting = `Hello, ${name}!`;' },
                { title: 'String Methods', code: 'const text = "JavaScript";\nconst upper = text.toUpperCase();\nconst sub = text.substring(0, 4);' },
                { title: 'RegEx', code: 'const pattern = /\\d+/g;\nconst result = "abc123xyz456".match(pattern);' }
            ],
            video_url: null,
            resources: [
                { type: 'PPT', url: 'https://example.com/strings-presentation.pptx', title: 'String Manipulation Slides' }
            ]
        },
        order_index: 8,
        duration_minutes: 55,
        is_published: true
    },
    {
        class_number: 9,
        title: 'Array Advanced Techniques',
        description: 'Advanced array operations including sorting, searching, and destructuring.',
        content: {
            theory: 'Beyond basic array methods, JavaScript offers powerful techniques for advanced array manipulation.',
            examples: [
                { title: 'Sorting', code: 'const nums = [3, 1, 4, 1, 5];\nnums.sort((a, b) => a - b);' },
                { title: 'Destructuring', code: 'const [first, second, ...rest] = [1, 2, 3, 4, 5];' },
                { title: 'Finding', code: 'const users = [{id:1, name:"John"}, {id:2, name:"Jane"}];\nconst user = users.find(u => u.id === 2);' }
            ],
            video_url: 'https://www.youtube.com/watch?v=R8rmfD9Y5-c',
            resources: [
                { type: 'Code Example', url: 'https://github.com/examples/array-techniques', title: 'Array Techniques Examples' }
            ]
        },
        order_index: 9,
        duration_minutes: 70,
        is_published: true
    },
    {
        class_number: 10,
        title: 'JavaScript Best Practices',
        description: 'Learn coding standards, naming conventions, and best practices for clean code.',
        content: {
            theory: 'Writing clean, maintainable code is crucial for professional development. Follow industry best practices.',
            examples: [
                { title: 'Naming Conventions', code: '// Use camelCase for variables\nconst userName = "John";\nconst userAge = 25;\n\n// Use PascalCase for classes\nclass UserAccount {}' },
                { title: 'Code Organization', code: '// Group related functions\nconst utils = {\n  formatDate: (date) => {},\n  parseJSON: (str) => {},\n  validate: (data) => {}\n};' }
            ],
            video_url: null,
            resources: [
                { type: 'PDF', url: 'https://example.com/best-practices.pdf', title: 'JavaScript Best Practices Guide' },
                { type: 'Document', url: 'https://github.com/airbnb/javascript', title: 'Airbnb Style Guide' }
            ]
        },
        order_index: 10,
        duration_minutes: 65,
        is_published: true
    },
    {
        class_number: 6,
        title: 'Event Handling',
        description: 'Master DOM events, event listeners, and event delegation.',
        content: {
            theory: 'Events are actions that happen in the browser. JavaScript can detect and respond to these events.',
            examples: [
                { title: 'Click Event', code: 'button.addEventListener("click", (e) => {\n  console.log("Button clicked!");\n});' },
                { title: 'Event Delegation', code: 'parent.addEventListener("click", (e) => {\n  if (e.target.matches(".child")) {\n    console.log("Child clicked");\n  }\n});' }
            ],
            video_url: 'https://www.youtube.com/watch?v=XF1_MlZ5l6M',
            resources: [
                { type: 'PPT', url: 'https://example.com/events-presentation.pptx', title: 'Event Handling Presentation' }
            ]
        },
        order_index: 6,
        duration_minutes: 80,
        is_published: true
    },
    {
        class_number: 7,
        title: 'Local Storage and Session Storage',
        description: 'Learn to store data in the browser using Web Storage API.',
        content: {
            theory: 'Web Storage API provides mechanisms for storing key-value pairs in the browser.',
            examples: [
                { title: 'Local Storage', code: 'localStorage.setItem("user", "John");\nconst user = localStorage.getItem("user");' },
                { title: 'Session Storage', code: 'sessionStorage.setItem("token", "abc123");\nconst token = sessionStorage.getItem("token");' },
                { title: 'Storing Objects', code: 'const data = {name: "John", age: 30};\nlocalStorage.setItem("userData", JSON.stringify(data));' }
            ],
            video_url: null,
            resources: [
                { type: 'Document', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API', title: 'MDN Web Storage API' }
            ]
        },
        order_index: 7,
        duration_minutes: 50,
        is_published: true
    },
    {
        class_number: 8,
        title: 'Form Validation',
        description: 'Implement client-side form validation with JavaScript.',
        content: {
            theory: 'Form validation ensures users provide correct data before submission. Client-side validation improves user experience.',
            examples: [
                { title: 'Email Validation', code: 'const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\nconst isValid = emailRegex.test(email);' },
                { title: 'Form Submission', code: 'form.addEventListener("submit", (e) => {\n  e.preventDefault();\n  if (validateForm()) {\n    submitData();\n  }\n});' }
            ],
            video_url: 'https://www.youtube.com/watch?v=In0nB0ABaUk',
            resources: [
                { type: 'Code Example', url: 'https://github.com/examples/form-validation', title: 'Form Validation Examples' }
            ]
        },
        order_index: 8,
        duration_minutes: 70,
        is_published: true
    },
    {
        class_number: 6,
        title: 'Advanced Async Patterns',
        description: 'Master Promise.all, Promise.race, and concurrent async operations.',
        content: {
            theory: 'Advanced async patterns enable efficient handling of multiple asynchronous operations.',
            examples: [
                { title: 'Promise.all', code: 'const promises = [fetch("/api/1"), fetch("/api/2")];\nconst results = await Promise.all(promises);' },
                { title: 'Promise.race', code: 'const fastest = await Promise.race([slowAPI(), fastAPI()]);' },
                { title: 'Error Handling', code: 'try {\n  const data = await fetchData();\n} catch (error) {\n  handleError(error);\n}' }
            ],
            video_url: 'https://www.youtube.com/watch?v=V_Kr9OSfDeU',
            resources: [
                { type: 'PDF', url: 'https://example.com/async-patterns.pdf', title: 'Async Patterns Guide' }
            ]
        },
        order_index: 6,
        duration_minutes: 90,
        is_published: true
    },
    {
        class_number: 7,
        title: 'JavaScript Modules and Imports',
        description: 'Understanding ES6 modules, imports, exports, and module bundlers.',
        content: {
            theory: 'Modules help organize code into reusable, maintainable pieces. ES6 introduced native module support.',
            examples: [
                { title: 'Named Export', code: '// utils.js\nexport const add = (a, b) => a + b;\nexport const subtract = (a, b) => a - b;' },
                { title: 'Default Export', code: '// user.js\nexport default class User {\n  constructor(name) {\n    this.name = name;\n  }\n}' },
                { title: 'Import', code: 'import User from "./user.js";\nimport { add, subtract } from "./utils.js";' }
            ],
            video_url: null,
            resources: [
                { type: 'Document', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules', title: 'MDN JavaScript Modules' }
            ]
        },
        order_index: 7,
        duration_minutes: 85,
        is_published: true
    },
    {
        class_number: 8,
        title: 'WeakMap and WeakSet',
        description: 'Learn about weak references and memory management in JavaScript.',
        content: {
            theory: 'WeakMap and WeakSet provide weak references to objects, allowing for better memory management.',
            examples: [
                { title: 'WeakMap', code: 'const wm = new WeakMap();\nconst obj = {};\nwm.set(obj, "metadata");' },
                { title: 'Private Data', code: 'const privateData = new WeakMap();\nclass User {\n  constructor(name) {\n    privateData.set(this, {name});\n  }\n}' }
            ],
            video_url: 'https://www.youtube.com/watch?v=hA6M1r64_s0',
            resources: [
                { type: 'PPT', url: 'https://example.com/weakmap-weakset.pptx', title: 'WeakMap and WeakSet Presentation' }
            ]
        },
        order_index: 8,
        duration_minutes: 75,
        is_published: true
    },
    {
        class_number: 9,
        title: 'Generators and Iterators',
        description: 'Understanding generator functions and custom iterators.',
        content: {
            theory: 'Generators are functions that can be paused and resumed, enabling lazy evaluation and custom iteration.',
            examples: [
                { title: 'Generator', code: 'function* numberGenerator() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\nconst gen = numberGenerator();' },
                { title: 'Iterator', code: 'const iterator = {\n  [Symbol.iterator]() {\n    let count = 0;\n    return {\n      next() {\n        return {value: count++, done: count > 5};\n      }\n    };\n  }\n};' }
            ],
            video_url: null,
            resources: [
                { type: 'Code Example', url: 'https://github.com/examples/generators', title: 'Generator Examples' }
            ]
        },
        order_index: 9,
        duration_minutes: 95,
        is_published: true
    },
    {
        class_number: 10,
        title: 'Testing JavaScript Code',
        description: 'Introduction to unit testing with Jest and test-driven development.',
        content: {
            theory: 'Testing ensures code reliability and maintainability. Jest is a popular testing framework for JavaScript.',
            examples: [
                { title: 'Simple Test', code: 'test("adds 1 + 2 to equal 3", () => {\n  expect(add(1, 2)).toBe(3);\n});' },
                { title: 'Async Test', code: 'test("fetches user data", async () => {\n  const data = await fetchUser(1);\n  expect(data.name).toBe("John");\n});' }
            ],
            video_url: 'https://www.youtube.com/watch?v=FgnxcUQ5vho',
            resources: [
                { type: 'PDF', url: 'https://example.com/testing-guide.pdf', title: 'JavaScript Testing Guide' },
                { type: 'Document', url: 'https://jestjs.io/docs/getting-started', title: 'Jest Documentation' }
            ]
        },
        order_index: 10,
        duration_minutes: 100,
        is_published: true
    }
];

// Additional assignments with varied data
const additionalAssignments = [
    {
        module_slug: 'fundamental',
        class_number: 6,
        title: 'Function Workshop',
        description: 'Create a collection of utility functions including array sum, string reverse, and number formatting.',
        requirements: [
            'Implement at least 5 different utility functions',
            'Each function must have clear parameter names',
            'Include JSDoc comments for each function',
            'Provide test cases for each function'
        ],
        rubric: {
            'Functionality': { points: 35, description: 'All functions work correctly' },
            'Code Organization': { points: 25, description: 'Functions are well-organized' },
            'Documentation': { points: 25, description: 'Clear JSDoc comments' },
            'Testing': { points: 15, description: 'Adequate test coverage' }
        },
        max_score: 100,
        deadline_days: 7,
        is_active: true
    },
    {
        module_slug: 'fundamental',
        class_number: 7,
        title: 'Error Handling Exercise',
        description: 'Build a program that handles various error scenarios including invalid input, division by zero, and file operations.',
        requirements: [
            'Use try-catch blocks appropriately',
            'Create at least one custom error class',
            'Handle different error types differently',
            'Log errors with meaningful messages'
        ],
        rubric: {
            'Error Handling': { points: 40, description: 'Proper use of try-catch' },
            'Custom Errors': { points: 30, description: 'Custom error implementation' },
            'Error Messages': { points: 20, description: 'Clear error messages' },
            'Code Quality': { points: 10, description: 'Clean code' }
        },
        max_score: 100,
        deadline_days: 5,
        is_active: true
    },
    {
        module_slug: 'fundamental',
        class_number: 8,
        title: 'String Manipulation Project',
        description: 'Create a text processing application with features like word count, character count, and text transformation.',
        requirements: [
            'Implement word count and character count',
            'Create functions for uppercase, lowercase, and title case',
            'Add a function to remove extra whitespace',
            'Use template literals for output formatting'
        ],
        rubric: {
            'Core Features': { points: 40, description: 'All features implemented' },
            'String Methods': { points: 30, description: 'Proper use of string methods' },
            'User Interface': { points: 20, description: 'Clear output formatting' },
            'Edge Cases': { points: 10, description: 'Handles edge cases' }
        },
        max_score: 100,
        deadline_days: 8,
        is_active: false
    },
    {
        module_slug: 'intermediate',
        class_number: 6,
        title: 'Event-Driven Calculator',
        description: 'Build an interactive calculator using DOM events and event listeners.',
        requirements: [
            'Create a calculator UI with buttons',
            'Handle click events for all operations',
            'Display results in real-time',
            'Support keyboard input'
        ],
        rubric: {
            'Functionality': { points: 40, description: 'Calculator works correctly' },
            'Event Handling': { points: 30, description: 'Proper event management' },
            'UI/UX': { points: 20, description: 'User-friendly interface' },
            'Code Quality': { points: 10, description: 'Clean, maintainable code' }
        },
        max_score: 100,
        deadline_days: 10,
        is_active: true
    },
    {
        module_slug: 'intermediate',
        class_number: 7,
        title: 'Data Persistence App',
        description: 'Create a note-taking application that persists data using localStorage.',
        requirements: [
            'Allow users to create, edit, and delete notes',
            'Store notes in localStorage',
            'Load notes on page refresh',
            'Add timestamps to each note'
        ],
        rubric: {
            'CRUD Operations': { points: 40, description: 'All operations work' },
            'Data Persistence': { points: 30, description: 'Proper localStorage usage' },
            'User Experience': { points: 20, description: 'Smooth user experience' },
            'Error Handling': { points: 10, description: 'Handles errors gracefully' }
        },
        max_score: 100,
        deadline_days: 12,
        is_active: true
    },
    {
        module_slug: 'intermediate',
        class_number: 8,
        title: 'Form Validation System',
        description: 'Build a comprehensive form validation system for a registration form.',
        requirements: [
            'Validate email, password, and phone number',
            'Show real-time validation feedback',
            'Prevent submission if validation fails',
            'Display helpful error messages'
        ],
        rubric: {
            'Validation Logic': { points: 40, description: 'All validations work' },
            'User Feedback': { points: 30, description: 'Clear feedback messages' },
            'Form Handling': { points: 20, description: 'Proper form submission' },
            'UX Design': { points: 10, description: 'Good user experience' }
        },
        max_score: 100,
        deadline_days: 9,
        is_active: true
    },
    {
        module_slug: 'advance',
        class_number: 6,
        title: 'Async Data Aggregator',
        description: 'Create an application that fetches data from multiple APIs concurrently and aggregates the results.',
        requirements: [
            'Fetch data from at least 3 different APIs',
            'Use Promise.all for concurrent requests',
            'Handle API errors gracefully',
            'Display aggregated results in a meaningful way'
        ],
        rubric: {
            'Async Operations': { points: 40, description: 'Proper async handling' },
            'Error Handling': { points: 25, description: 'Robust error handling' },
            'Data Aggregation': { points: 25, description: 'Meaningful data combination' },
            'Code Quality': { points: 10, description: 'Clean, readable code' }
        },
        max_score: 100,
        deadline_days: 14,
        is_active: true
    },
    {
        module_slug: 'advance',
        class_number: 7,
        title: 'Module-Based Application',
        description: 'Build a multi-module application using ES6 modules with proper separation of concerns.',
        requirements: [
            'Create at least 5 separate modules',
            'Use both named and default exports',
            'Implement a module bundler (webpack or rollup)',
            'Document module dependencies'
        ],
        rubric: {
            'Module Organization': { points: 35, description: 'Well-organized modules' },
            'Import/Export': { points: 30, description: 'Proper module usage' },
            'Bundling': { points: 25, description: 'Successful bundling setup' },
            'Documentation': { points: 10, description: 'Clear documentation' }
        },
        max_score: 100,
        deadline_days: 15,
        is_active: false
    },
    {
        module_slug: 'advance',
        class_number: 8,
        title: 'Memory Management Project',
        description: 'Demonstrate advanced memory management techniques using WeakMap and WeakSet.',
        requirements: [
            'Create a caching system using WeakMap',
            'Implement private properties with WeakMap',
            'Use WeakSet for object tracking',
            'Document memory implications'
        ],
        rubric: {
            'WeakMap Usage': { points: 40, description: 'Proper WeakMap implementation' },
            'WeakSet Usage': { points: 30, description: 'Appropriate WeakSet usage' },
            'Design Patterns': { points: 20, description: 'Good design patterns' },
            'Documentation': { points: 10, description: 'Clear explanations' }
        },
        max_score: 100,
        deadline_days: 12,
        is_active: true
    },
    {
        module_slug: 'advance',
        class_number: 10,
        title: 'Full Testing Suite',
        description: 'Create a comprehensive testing suite for a JavaScript application using Jest.',
        requirements: [
            'Write unit tests for at least 10 functions',
            'Include integration tests',
            'Achieve at least 80% code coverage',
            'Use mocks and spies appropriately'
        ],
        rubric: {
            'Test Coverage': { points: 35, description: 'High test coverage' },
            'Test Quality': { points: 35, description: 'Well-written tests' },
            'Mocking': { points: 20, description: 'Proper use of mocks' },
            'Documentation': { points: 10, description: 'Test documentation' }
        },
        max_score: 100,
        deadline_days: 16,
        is_active: true
    }
];

// Sample submission data generator
function generateSubmissions(assignments, users) {
    const submissions = [];
    const statuses = ['pending', 'graded', 'graded', 'graded', 'pending', 'returned'];
    const feedbackTemplates = [
        'Excellent work! Your code is clean and well-structured. Keep up the good work.',
        'Good effort. The functionality is correct, but consider improving code readability with better variable names.',
        'Great implementation! Consider adding more error handling for edge cases.',
        'Well done. The code works, but could benefit from additional comments explaining complex logic.',
        'Impressive solution! Very creative approach to solving the problem.',
        'Good work overall. Minor improvements needed in following naming conventions.',
        'Excellent understanding of the concepts. Code is efficient and maintainable.',
        'Solid submission. Consider refactoring some functions to make them more reusable.',
        'Very good work! The code demonstrates a strong grasp of the material.',
        'Great effort. The solution is functional but could be optimized for better performance.',
        'Outstanding work! Exceeds expectations in all criteria.',
        'Good submission. Pay attention to code formatting and indentation.',
        'Well-structured code with good separation of concerns. Nice work!',
        'Functional but needs improvement in error handling and edge cases.',
        'Excellent documentation and code organization. Keep it up!'
    ];

    const codeExamples = [
        '// Calculator function\nfunction calculate(a, b, operation) {\n  switch(operation) {\n    case "add": return a + b;\n    case "subtract": return a - b;\n    case "multiply": return a * b;\n    case "divide": return b !== 0 ? a / b : "Error";\n    default: return "Invalid operation";\n  }\n}\n\nconsole.log(calculate(10, 5, "add"));',
        '// Array manipulation\nconst students = [\n  {name: "John", grade: 85},\n  {name: "Jane", grade: 92},\n  {name: "Bob", grade: 78}\n];\n\nconst topStudents = students.filter(s => s.grade >= 80);\nconsole.log(topStudents);',
        '// Async data fetching\nasync function getUserData(userId) {\n  try {\n    const response = await fetch(`/api/users/${userId}`);\n    const data = await response.json();\n    return data;\n  } catch(error) {\n    console.error("Error fetching user:", error);\n  }\n}',
        '// Object-oriented programming\nclass Vehicle {\n  constructor(make, model) {\n    this.make = make;\n    this.model = model;\n  }\n  \n  displayInfo() {\n    return `${this.make} ${this.model}`;\n  }\n}\n\nconst car = new Vehicle("Toyota", "Camry");',
        '// Event handling\nconst button = document.querySelector("#submitBtn");\nbutton.addEventListener("click", (e) => {\n  e.preventDefault();\n  const formData = new FormData(form);\n  submitData(formData);\n});'
    ];

    // Create 15-20 submissions
    const submissionCount = 15 + Math.floor(Math.random() * 6);

    for (let i = 0; i < submissionCount; i++) {
        const assignment = assignments[Math.floor(Math.random() * assignments.length)];
        const user = users[Math.floor(Math.random() * users.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // Calculate submission date (random within last 30 days)
        const daysAgo = Math.floor(Math.random() * 30);
        const submittedAt = new Date();
        submittedAt.setDate(submittedAt.getDate() - daysAgo);

        const submission = {
            assignment_id: assignment.id,
            user_id: user.id,
            file_url: `https://storage.example.com/submissions/${user.id}/${assignment.id}/solution.js`,
            file_name: `assignment_${assignment.class_number}_solution.js`,
            submission_text: `Submission for ${assignment.title}`,
            code_content: codeExamples[Math.floor(Math.random() * codeExamples.length)],
            status: status,
            submitted_at: submittedAt
        };

        // Add score and feedback for graded submissions
        if (status === 'graded') {
            const baseScore = 70 + Math.floor(Math.random() * 30); // 70-99
            submission.score = baseScore;
            submission.feedback = feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)];

            // Generate rubric scores
            const rubricScores = {};
            const rubric = assignment.rubric;
            for (const [category, details] of Object.entries(rubric)) {
                const maxPoints = details.points;
                // Score between 70-100% of max points
                const earnedPoints = Math.floor(maxPoints * (0.7 + Math.random() * 0.3));
                rubricScores[category] = earnedPoints;
            }
            submission.rubric_scores = rubricScores;

            // Set graded date (1-5 days after submission)
            const gradedAt = new Date(submittedAt);
            gradedAt.setDate(gradedAt.getDate() + 1 + Math.floor(Math.random() * 5));
            submission.graded_at = gradedAt;
            submission.graded_by = 1; // Assume assessor with ID 1
        }

        submissions.push(submission);
    }

    return submissions;
}

async function seedAssessorData() {
    const client = await getClient();

    try {
        console.log('Starting assessor data seeding...\n');

        await client.query('BEGIN');

        // 1. Get existing modules
        console.log('Fetching existing modules...');
        const modulesResult = await client.query(
            'SELECT id, slug, level FROM modules ORDER BY id'
        );
        const modules = modulesResult.rows;

        if (modules.length === 0) {
            throw new Error('No modules found. Please run seed-database.js first.');
        }

        console.log(`Found ${modules.length} modules: ${modules.map(m => m.slug).join(', ')}\n`);

        // Create module map
        const moduleMap = {};
        modules.forEach(m => moduleMap[m.slug] = m.id);

        // 2. Check and insert learning materials
        console.log('Adding learning materials...');
        const existingMaterialsResult = await client.query(
            'SELECT COUNT(*) as count FROM learning_materials'
        );
        const existingMaterialsCount = parseInt(existingMaterialsResult.rows[0].count);
        console.log(`Existing learning materials: ${existingMaterialsCount}`);

        let materialsAdded = 0;

        // Distribute materials across modules
        const materialsPerModule = Math.ceil(learningMaterialsData.length / modules.length);
        let materialIndex = 0;

        for (const module of modules) {
            const moduleMaterials = learningMaterialsData.slice(
                materialIndex,
                materialIndex + materialsPerModule
            );

            for (const material of moduleMaterials) {
                try {
                    await client.query(
                        `INSERT INTO learning_materials
                         (module_id, class_number, title, description, content, order_index, duration_minutes, is_published)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                         ON CONFLICT (module_id, class_number) DO NOTHING`,
                        [
                            module.id,
                            material.class_number,
                            material.title,
                            material.description,
                            JSON.stringify(material.content),
                            material.order_index,
                            material.duration_minutes,
                            material.is_published
                        ]
                    );
                    materialsAdded++;
                } catch (err) {
                    // Skip if conflict
                    console.log(`  Skipped duplicate: ${material.title} for module ${module.slug}`);
                }
            }

            materialIndex += materialsPerModule;
            if (materialIndex >= learningMaterialsData.length) break;
        }

        console.log(`Added ${materialsAdded} new learning materials\n`);

        // 3. Check and insert additional assignments
        console.log('Adding additional assignments...');
        const existingAssignmentsResult = await client.query(
            'SELECT COUNT(*) as count FROM assignments'
        );
        const existingAssignmentsCount = parseInt(existingAssignmentsResult.rows[0].count);
        console.log(`Existing assignments: ${existingAssignmentsCount}`);

        // Get or create an assessor user for created_by field
        let assessorId = 1;
        const assessorResult = await client.query(
            "SELECT id FROM users WHERE role = 'assessor' LIMIT 1"
        );
        if (assessorResult.rows.length > 0) {
            assessorId = assessorResult.rows[0].id;
        }

        let assignmentsAdded = 0;

        for (const assignment of additionalAssignments) {
            const moduleId = moduleMap[assignment.module_slug];
            if (!moduleId) {
                console.log(`  Warning: Module ${assignment.module_slug} not found, skipping assignment`);
                continue;
            }

            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + assignment.deadline_days);

            try {
                await client.query(
                    `INSERT INTO assignments
                     (module_id, class_number, title, description, requirements, rubric, max_score, due_date, is_active, created_by)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                    [
                        moduleId,
                        assignment.class_number,
                        assignment.title,
                        assignment.description,
                        JSON.stringify(assignment.requirements),
                        JSON.stringify(assignment.rubric),
                        assignment.max_score,
                        dueDate,
                        assignment.is_active,
                        assessorId
                    ]
                );
                assignmentsAdded++;
            } catch (err) {
                console.log(`  Skipped: ${assignment.title} - ${err.message}`);
            }
        }

        console.log(`Added ${assignmentsAdded} new assignments\n`);

        // 4. Get all assignments and users for submissions
        console.log('Preparing submission data...');
        const allAssignmentsResult = await client.query(
            'SELECT id, class_number, title, rubric FROM assignments ORDER BY id'
        );
        const allAssignments = allAssignmentsResult.rows.map(a => ({
            ...a,
            rubric: typeof a.rubric === 'string' ? JSON.parse(a.rubric) : a.rubric
        }));

        const usersResult = await client.query(
            "SELECT id FROM users WHERE role = 'user' AND status = 'active' LIMIT 10"
        );
        const users = usersResult.rows;

        if (users.length === 0) {
            console.log('Warning: No active users found. Skipping submission creation.\n');
        } else {
            // 5. Generate and insert submissions
            console.log('Adding submissions...');
            const existingSubmissionsResult = await client.query(
                'SELECT COUNT(*) as count FROM submissions'
            );
            const existingSubmissionsCount = parseInt(existingSubmissionsResult.rows[0].count);
            console.log(`Existing submissions: ${existingSubmissionsCount}`);

            const submissions = generateSubmissions(allAssignments, users);
            let submissionsAdded = 0;

            for (const submission of submissions) {
                try {
                    await client.query(
                        `INSERT INTO submissions
                         (assignment_id, user_id, file_url, file_name, submission_text, code_content,
                          score, feedback, rubric_scores, status, graded_by, submitted_at, graded_at)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                         ON CONFLICT (assignment_id, user_id) DO NOTHING`,
                        [
                            submission.assignment_id,
                            submission.user_id,
                            submission.file_url,
                            submission.file_name,
                            submission.submission_text,
                            submission.code_content,
                            submission.score || null,
                            submission.feedback || null,
                            submission.rubric_scores ? JSON.stringify(submission.rubric_scores) : null,
                            submission.status,
                            submission.graded_by || null,
                            submission.submitted_at,
                            submission.graded_at || null
                        ]
                    );
                    submissionsAdded++;
                } catch (err) {
                    // Skip duplicates
                    console.log(`  Skipped duplicate submission`);
                }
            }

            console.log(`Added ${submissionsAdded} new submissions\n`);
        }

        // Commit transaction
        await client.query('COMMIT');

        // Print summary
        console.log('='.repeat(60));
        console.log('Assessor data seeding completed successfully!');
        console.log('='.repeat(60));
        console.log('Summary:');
        console.log(`  Learning Materials: ${materialsAdded} added (${existingMaterialsCount + materialsAdded} total)`);
        console.log(`  Assignments: ${assignmentsAdded} added (${existingAssignmentsCount + assignmentsAdded} total)`);
        if (users.length > 0 && typeof submissionsAdded !== 'undefined') {
            console.log(`  Submissions: ${submissionsAdded || 0} added (${existingSubmissionsCount + (submissionsAdded || 0)} total)`);
        }
        console.log('='.repeat(60));

        console.log('\nYou can now view the assessor dashboard with comprehensive data!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('\nError seeding assessor data:', error);
        console.error(error.stack);
        throw error;
    } finally {
        client.release();
    }
}

// Run the seeder
if (require.main === module) {
    seedAssessorData()
        .then(() => {
            console.log('\nSeeding completed. Exiting...');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\nSeeding failed:', error.message);
            process.exit(1);
        });
}

module.exports = { seedAssessorData };
