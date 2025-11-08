/**
 * Seed Database Script
 * Populates database with sample modules, classes, and assignments
 */

const { query } = require('../config/database');

// Sample data
const modules = [
    {
        name: 'Fundamental JavaScript',
        slug: 'fundamental',
        description: 'Learn the basics of JavaScript programming including variables, data types, operators, control structures, and functions.',
        level: 'fundamental',
        is_active: true
    },
    {
        name: 'Intermediate JavaScript',
        slug: 'intermediate',
        description: 'Master intermediate concepts like arrays, objects, DOM manipulation, events, and asynchronous programming.',
        level: 'intermediate',
        is_active: true
    },
    {
        name: 'Advance JavaScript',
        slug: 'advance',
        description: 'Advanced topics including ES6+, closures, prototypes, design patterns, and modern JavaScript frameworks.',
        level: 'advance',
        is_active: true
    }
];

const learningMaterials = {
    fundamental: [
        {
            class_number: 1,
            title: 'Introduction to JavaScript',
            description: 'Learn what JavaScript is and how to set up your development environment.',
            content: {
                theory: 'JavaScript is a high-level, interpreted programming language that is one of the core technologies of the web.',
                examples: [
                    { title: 'Hello World', code: 'console.log("Hello, World!");' },
                    { title: 'Variables', code: 'let name = "JavaScript";\nconsole.log(name);' }
                ],
                video_url: null
            },
            order_index: 1,
            duration_minutes: 45,
            is_published: true
        },
        {
            class_number: 2,
            title: 'Variables and Data Types',
            description: 'Understanding JavaScript variables, constants, and primitive data types.',
            content: {
                theory: 'JavaScript has dynamic typing and supports several primitive data types: String, Number, Boolean, Undefined, Null, Symbol, and BigInt.',
                examples: [
                    { title: 'String', code: 'let greeting = "Hello";\nlet name = \'JavaScript\';' },
                    { title: 'Number', code: 'let age = 25;\nlet price = 99.99;' },
                    { title: 'Boolean', code: 'let isActive = true;\nlet isCompleted = false;' }
                ],
                video_url: null
            },
            order_index: 2,
            duration_minutes: 60,
            is_published: true
        },
        {
            class_number: 3,
            title: 'Operators and Expressions',
            description: 'Learn about arithmetic, comparison, logical, and assignment operators.',
            content: {
                theory: 'Operators are used to perform operations on variables and values. JavaScript supports arithmetic (+, -, *, /), comparison (==, ===, !=, !==), and logical operators (&&, ||, !).',
                examples: [
                    { title: 'Arithmetic', code: 'let sum = 10 + 5;\nlet product = 10 * 5;' },
                    { title: 'Comparison', code: 'let isEqual = (5 === 5);\nlet isGreater = (10 > 5);' },
                    { title: 'Logical', code: 'let result = (true && false);\nlet result2 = (true || false);' }
                ],
                video_url: null
            },
            order_index: 3,
            duration_minutes: 50,
            is_published: true
        },
        {
            class_number: 4,
            title: 'Control Structures',
            description: 'Master if-else statements, switch cases, and conditional logic.',
            content: {
                theory: 'Control structures allow you to control the flow of your program. Use if-else for conditional execution and switch for multiple conditions.',
                examples: [
                    { title: 'If-Else', code: 'if (age >= 18) {\n  console.log("Adult");\n} else {\n  console.log("Minor");\n}' },
                    { title: 'Switch', code: 'switch(day) {\n  case 1: console.log("Monday"); break;\n  case 2: console.log("Tuesday"); break;\n  default: console.log("Other day");\n}' }
                ],
                video_url: null
            },
            order_index: 4,
            duration_minutes: 55,
            is_published: true
        },
        {
            class_number: 5,
            title: 'Loops and Iteration',
            description: 'Learn for loops, while loops, and array iteration methods.',
            content: {
                theory: 'Loops allow you to execute code multiple times. JavaScript provides for, while, do-while loops, and modern iteration methods like forEach, map, filter.',
                examples: [
                    { title: 'For Loop', code: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}' },
                    { title: 'While Loop', code: 'let i = 0;\nwhile (i < 5) {\n  console.log(i);\n  i++;\n}' },
                    { title: 'ForEach', code: 'let arr = [1, 2, 3];\narr.forEach(num => console.log(num));' }
                ],
                video_url: null
            },
            order_index: 5,
            duration_minutes: 60,
            is_published: true
        }
    ],
    intermediate: [
        {
            class_number: 1,
            title: 'Functions Deep Dive',
            description: 'Master function declarations, expressions, arrow functions, and callbacks.',
            content: {
                theory: 'Functions are reusable blocks of code. JavaScript supports multiple ways to define functions: declarations, expressions, and arrow functions.',
                examples: [
                    { title: 'Function Declaration', code: 'function greet(name) {\n  return `Hello, ${name}`;\n}' },
                    { title: 'Arrow Function', code: 'const greet = (name) => `Hello, ${name}`;' },
                    { title: 'Callback', code: 'function execute(callback) {\n  callback();\n}\nexecute(() => console.log("Done"));' }
                ],
                video_url: null
            },
            order_index: 1,
            duration_minutes: 70,
            is_published: true
        },
        {
            class_number: 2,
            title: 'Arrays and Array Methods',
            description: 'Learn array manipulation, map, filter, reduce, and more.',
            content: {
                theory: 'Arrays are ordered collections. JavaScript provides powerful methods like map (transform), filter (select), and reduce (aggregate).',
                examples: [
                    { title: 'Map', code: 'let nums = [1, 2, 3];\nlet doubled = nums.map(n => n * 2);' },
                    { title: 'Filter', code: 'let nums = [1, 2, 3, 4];\nlet evens = nums.filter(n => n % 2 === 0);' },
                    { title: 'Reduce', code: 'let nums = [1, 2, 3, 4];\nlet sum = nums.reduce((acc, n) => acc + n, 0);' }
                ],
                video_url: null
            },
            order_index: 2,
            duration_minutes: 75,
            is_published: true
        },
        {
            class_number: 3,
            title: 'Objects and JSON',
            description: 'Understanding objects, properties, methods, and JSON data format.',
            content: {
                theory: 'Objects are collections of key-value pairs. JSON (JavaScript Object Notation) is a lightweight data format.',
                examples: [
                    { title: 'Object Literal', code: 'let person = {\n  name: "John",\n  age: 30,\n  greet() { console.log("Hi"); }\n};' },
                    { title: 'JSON', code: 'let json = \'{"name":"John","age":30}\';\nlet obj = JSON.parse(json);' }
                ],
                video_url: null
            },
            order_index: 3,
            duration_minutes: 65,
            is_published: true
        },
        {
            class_number: 4,
            title: 'DOM Manipulation',
            description: 'Learn to interact with HTML elements using JavaScript.',
            content: {
                theory: 'The Document Object Model (DOM) allows JavaScript to access and manipulate HTML elements.',
                examples: [
                    { title: 'Select Element', code: 'let element = document.getElementById("myId");\nlet elements = document.querySelectorAll(".myClass");' },
                    { title: 'Modify Content', code: 'element.textContent = "New Text";\nelement.innerHTML = "<strong>Bold</strong>";' },
                    { title: 'Add Event', code: 'element.addEventListener("click", () => {\n  console.log("Clicked!");\n});' }
                ],
                video_url: null
            },
            order_index: 4,
            duration_minutes: 80,
            is_published: true
        },
        {
            class_number: 5,
            title: 'Asynchronous JavaScript',
            description: 'Master callbacks, promises, and async/await patterns.',
            content: {
                theory: 'Asynchronous programming allows code to run without blocking. Modern JavaScript uses Promises and async/await for cleaner async code.',
                examples: [
                    { title: 'Promise', code: 'let promise = new Promise((resolve, reject) => {\n  setTimeout(() => resolve("Done"), 1000);\n});' },
                    { title: 'Async/Await', code: 'async function fetchData() {\n  let response = await fetch("/api/data");\n  let data = await response.json();\n  return data;\n}' }
                ],
                video_url: null
            },
            order_index: 5,
            duration_minutes: 90,
            is_published: true
        }
    ],
    advance: [
        {
            class_number: 1,
            title: 'ES6+ Features',
            description: 'Explore modern JavaScript features: destructuring, spread, rest, modules.',
            content: {
                theory: 'ES6+ introduced powerful features that make JavaScript more expressive and concise.',
                examples: [
                    { title: 'Destructuring', code: 'let {name, age} = person;\nlet [first, second] = array;' },
                    { title: 'Spread Operator', code: 'let arr2 = [...arr1, 4, 5];\nlet obj2 = {...obj1, newProp: "value"};' },
                    { title: 'Modules', code: 'export const myFunc = () => {};\nimport { myFunc } from "./module.js";' }
                ],
                video_url: null
            },
            order_index: 1,
            duration_minutes: 85,
            is_published: true
        },
        {
            class_number: 2,
            title: 'Closures and Scope',
            description: 'Deep dive into lexical scope, closures, and the scope chain.',
            content: {
                theory: 'Closures allow functions to access variables from an outer function even after the outer function has returned.',
                examples: [
                    { title: 'Closure', code: 'function outer() {\n  let count = 0;\n  return function inner() {\n    count++;\n    return count;\n  };\n}' },
                    { title: 'Module Pattern', code: 'const counter = (() => {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    get: () => count\n  };\n})();' }
                ],
                video_url: null
            },
            order_index: 2,
            duration_minutes: 80,
            is_published: true
        },
        {
            class_number: 3,
            title: 'Prototypes and Inheritance',
            description: 'Understanding prototypal inheritance and the prototype chain.',
            content: {
                theory: 'JavaScript uses prototypal inheritance. Every object has a prototype, and objects inherit properties and methods from their prototype.',
                examples: [
                    { title: 'Prototype', code: 'function Person(name) {\n  this.name = name;\n}\nPerson.prototype.greet = function() {\n  console.log(`Hi, I am ${this.name}`);\n};' },
                    { title: 'Class Syntax', code: 'class Person {\n  constructor(name) {\n    this.name = name;\n  }\n  greet() {\n    console.log(`Hi, I am ${this.name}`);\n  }\n}' }
                ],
                video_url: null
            },
            order_index: 3,
            duration_minutes: 90,
            is_published: true
        },
        {
            class_number: 4,
            title: 'Design Patterns',
            description: 'Learn common JavaScript design patterns: Singleton, Factory, Observer.',
            content: {
                theory: 'Design patterns are reusable solutions to common programming problems.',
                examples: [
                    { title: 'Singleton', code: 'const singleton = (() => {\n  let instance;\n  return {\n    getInstance() {\n      if (!instance) instance = {};\n      return instance;\n    }\n  };\n})();' },
                    { title: 'Observer', code: 'class EventEmitter {\n  constructor() {\n    this.events = {};\n  }\n  on(event, callback) {\n    if (!this.events[event]) this.events[event] = [];\n    this.events[event].push(callback);\n  }\n  emit(event, data) {\n    this.events[event]?.forEach(cb => cb(data));\n  }\n}' }
                ],
                video_url: null
            },
            order_index: 4,
            duration_minutes: 95,
            is_published: true
        },
        {
            class_number: 5,
            title: 'Performance Optimization',
            description: 'Optimize JavaScript performance: debouncing, throttling, memoization.',
            content: {
                theory: 'Performance optimization techniques help create faster, more efficient JavaScript applications.',
                examples: [
                    { title: 'Debounce', code: 'function debounce(func, delay) {\n  let timeout;\n  return function(...args) {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => func(...args), delay);\n  };\n}' },
                    { title: 'Memoization', code: 'function memoize(func) {\n  const cache = {};\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache[key]) return cache[key];\n    cache[key] = func(...args);\n    return cache[key];\n  };\n}' }
                ],
                video_url: null
            },
            order_index: 5,
            duration_minutes: 100,
            is_published: true
        }
    ]
};

const assignments = {
    fundamental: [
        { class_number: 1, title: 'Hello World Program', description: 'Create a simple JavaScript program that prints "Hello World" to the console.', max_score: 100, deadline_days: 7 },
        { class_number: 2, title: 'Variable Declaration Exercise', description: 'Create variables of different types and display them using console.log.', max_score: 100, deadline_days: 7 },
        { class_number: 3, title: 'Calculator Program', description: 'Build a simple calculator using operators (+, -, *, /).', max_score: 100, deadline_days: 7 },
        { class_number: 4, title: 'Grade Checker', description: 'Create a program that checks student grades using if-else statements.', max_score: 100, deadline_days: 7 },
        { class_number: 5, title: 'Number Pattern', description: 'Use loops to create number patterns and print them to the console.', max_score: 100, deadline_days: 7 }
    ],
    intermediate: [
        { class_number: 1, title: 'Function Library', description: 'Create a library of utility functions (greet, calculate, validate).', max_score: 100, deadline_days: 7 },
        { class_number: 2, title: 'Array Manipulation', description: 'Use map, filter, and reduce to process an array of student data.', max_score: 100, deadline_days: 7 },
        { class_number: 3, title: 'Student Management', description: 'Create an object-based student management system with CRUD operations.', max_score: 100, deadline_days: 10 },
        { class_number: 4, title: 'Todo List App', description: 'Build an interactive todo list using DOM manipulation.', max_score: 100, deadline_days: 10 },
        { class_number: 5, title: 'Fetch API Exercise', description: 'Fetch data from a public API and display it on a webpage.', max_score: 100, deadline_days: 10 }
    ],
    advance: [
        { class_number: 1, title: 'ES6+ Refactoring', description: 'Refactor legacy JavaScript code using modern ES6+ features.', max_score: 100, deadline_days: 10 },
        { class_number: 2, title: 'Counter with Closure', description: 'Implement a counter application using closures and the module pattern.', max_score: 100, deadline_days: 10 },
        { class_number: 3, title: 'OOP Project', description: 'Create a class-based application with inheritance and polymorphism.', max_score: 100, deadline_days: 14 },
        { class_number: 4, title: 'Design Pattern Implementation', description: 'Implement Observer and Factory patterns in a real-world scenario.', max_score: 100, deadline_days: 14 },
        { class_number: 5, title: 'Performance Benchmark', description: 'Create a benchmark tool to test debounce, throttle, and memoization.', max_score: 100, deadline_days: 14 }
    ]
};

async function seedDatabase() {
    console.log('🌱 Starting database seeding...\n');

    try {
        // 1. Insert Modules
        console.log('📚 Creating modules...');
        const moduleIds = {};

        for (const module of modules) {
            const result = await query(
                `INSERT INTO modules (name, slug, description, level, is_active)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (slug) DO UPDATE
                 SET name = EXCLUDED.name, description = EXCLUDED.description
                 RETURNING id, slug`,
                [module.name, module.slug, module.description, module.level, module.is_active]
            );
            moduleIds[module.slug] = result.rows[0].id;
            console.log(`  ✅ Created: ${module.name} (ID: ${result.rows[0].id})`);
        }

        // 2. Insert Learning Materials
        console.log('\n📖 Creating learning materials...');
        let materialCount = 0;

        for (const [moduleSlug, materials] of Object.entries(learningMaterials)) {
            const moduleId = moduleIds[moduleSlug];

            for (const material of materials) {
                await query(
                    `INSERT INTO learning_materials
                     (module_id, class_number, title, description, content, order_index, duration_minutes, is_published)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                     ON CONFLICT (module_id, class_number) DO UPDATE
                     SET title = EXCLUDED.title, content = EXCLUDED.content`,
                    [moduleId, material.class_number, material.title, material.description,
                     JSON.stringify(material.content), material.order_index, material.duration_minutes, material.is_published]
                );
                materialCount++;
            }
            console.log(`  ✅ Created ${materials.length} classes for ${moduleSlug}`);
        }

        // 3. Insert Assignments
        console.log('\n📝 Creating assignments...');
        let assignmentCount = 0;

        for (const [moduleSlug, assignmentList] of Object.entries(assignments)) {
            const moduleId = moduleIds[moduleSlug];

            for (const assignment of assignmentList) {
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + assignment.deadline_days);

                const requirements = JSON.stringify([
                    'Submit your solution in a single JavaScript file',
                    'Include comments explaining your code',
                    'Test your code before submission',
                    'Follow proper naming conventions'
                ]);

                const rubric = JSON.stringify({
                    'Functionality': { points: 40, description: 'Code works correctly' },
                    'Code Quality': { points: 30, description: 'Clean, readable code' },
                    'Comments': { points: 20, description: 'Well-commented code' },
                    'Best Practices': { points: 10, description: 'Follows JS best practices' }
                });

                await query(
                    `INSERT INTO assignments
                     (module_id, class_number, title, description, requirements, rubric, max_score, due_date, is_active)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                    [moduleId, assignment.class_number, assignment.title, assignment.description,
                     requirements, rubric, assignment.max_score, dueDate, true]
                );
                assignmentCount++;
            }
            console.log(`  ✅ Created ${assignmentList.length} assignments for ${moduleSlug}`);
        }

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('✨ Database seeding completed successfully!');
        console.log('='.repeat(50));
        console.log(`📚 Modules created: ${modules.length}`);
        console.log(`📖 Learning materials created: ${materialCount}`);
        console.log(`📝 Assignments created: ${assignmentCount}`);
        console.log('='.repeat(50));

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error seeding database:', error);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run seeding
seedDatabase();
