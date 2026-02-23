import { curriedAdd } from './curriedAdd.js';

console.log('='.repeat(50));
console.log('Testing curriedAdd Homework');
console.log('='.repeat(50));
console.log('');

// Test 1: Basic test case from the homework
console.log('Test 1: curriedAdd(1)(2)(3)');
const result1 = curriedAdd(1)(2)(3);
console.log('Expected: 6');
console.log('Result:', result1);
console.log('Passed:', result1 === 6 ? '✓' : '✗');
console.log('');

// Test 2: Step-by-step currying (from homework example)
console.log('Test 2: Step-by-step currying');
const addFirst = curriedAdd(1);
const addSecond = addFirst(2);
const result2 = addSecond(3);
console.log('Expected: 6');
console.log('Result:', result2);
console.log('Passed:', result2 === 6 ? '✓' : '✗');
console.log('');

// Test 3: Different numbers
console.log('Test 3: curriedAdd(5)(10)(15)');
const result3 = curriedAdd(5)(10)(15);
console.log('Expected: 30');
console.log('Result:', result3);
console.log('Passed:', result3 === 30 ? '✓' : '✗');
console.log('');

// Test 4: With zeros
console.log('Test 4: curriedAdd(0)(0)(0)');
const result4 = curriedAdd(0)(0)(0);
console.log('Expected: 0');
console.log('Result:', result4);
console.log('Passed:', result4 === 0 ? '✓' : '✗');
console.log('');

// Test 5: With negative numbers
console.log('Test 5: curriedAdd(-5)(10)(-3)');
const result5 = curriedAdd(-5)(10)(-3);
console.log('Expected: 2');
console.log('Result:', result5);
console.log('Passed:', result5 === 2 ? '✓' : '✗');
console.log('');

// Test 6: With decimal numbers
console.log('Test 6: curriedAdd(1.5)(2.5)(3)');
const result6 = curriedAdd(1.5)(2.5)(3);
console.log('Expected: 7');
console.log('Result:', result6);
console.log('Passed:', result6 === 7 ? '✓' : '✗');
console.log('');

// Test 7: Large numbers
console.log('Test 7: curriedAdd(100)(200)(300)');
const result7 = curriedAdd(100)(200)(300);
console.log('Expected: 600');
console.log('Result:', result7);
console.log('Passed:', result7 === 600 ? '✓' : '✗');
console.log('');

// Test 8: Reusing intermediate functions
console.log('Test 8: Reusing intermediate functions');
const add10 = curriedAdd(10);
const add10and20 = add10(20);
const result8a = add10and20(5);
const result8b = add10and20(15);
console.log('add10(20)(5) Expected: 35, Result:', result8a, 'Passed:', result8a === 35 ? '✓' : '✗');
console.log('add10(20)(15) Expected: 45, Result:', result8b, 'Passed:', result8b === 45 ? '✓' : '✗');
console.log('');

// Summary
const allTests = [
  result1 === 6,
  result2 === 6,
  result3 === 30,
  result4 === 0,
  result5 === 2,
  result6 === 7,
  result7 === 600,
  result8a === 35,
  result8b === 45
];

const passedTests = allTests.filter(test => test).length;
const totalTests = allTests.length;

console.log('='.repeat(50));
console.log(`Summary: ${passedTests}/${totalTests} tests passed`);
console.log('='.repeat(50));

