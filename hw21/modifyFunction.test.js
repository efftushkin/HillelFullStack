import { originalFunction, modifyFunction } from './modifyFunction.js';

console.log('='.repeat(50));
console.log('Testing modifyFunction Homework');
console.log('='.repeat(50));
console.log('');

// Test 1: Basic test case from the homework
console.log('Test 1: Basic example from homework');
const modifiedFunc = modifyFunction(originalFunction, 3);
const original4 = originalFunction(4);
const modified4 = modifiedFunc(4);

console.log('Original function output for 4:', original4);
console.log('Expected: 16');
console.log('Passed:', original4 === 16 ? '✓' : '✗');
console.log('');

console.log('Modified function output for 4:', modified4);
console.log('Expected: 48 (16 * 3)');
console.log('Passed:', modified4 === 48 ? '✓' : '✗');
console.log('');

// Test 2: Different multiplier
console.log('Test 2: Different multiplier (5)');
const modifiedFunc2 = modifyFunction(originalFunction, 5);
const result2 = modifiedFunc2(2);
console.log('Modified function output for 2:', result2);
console.log('Expected: 40 (8 * 5)');
console.log('Passed:', result2 === 40 ? '✓' : '✗');
console.log('');

// Test 3: Multiplier of 1
console.log('Test 3: Multiplier of 1 (no change)');
const modifiedFunc3 = modifyFunction(originalFunction, 1);
const result3 = modifiedFunc3(5);
console.log('Modified function output for 5:', result3);
console.log('Expected: 20 (20 * 1)');
console.log('Passed:', result3 === 20 ? '✓' : '✗');
console.log('');

// Test 4: Multiplier of 0
console.log('Test 4: Multiplier of 0');
const modifiedFunc4 = modifyFunction(originalFunction, 0);
const result4 = modifiedFunc4(10);
console.log('Modified function output for 10:', result4);
console.log('Expected: 0 (40 * 0)');
console.log('Passed:', result4 === 0 ? '✓' : '✗');
console.log('');

// Test 5: Negative multiplier
console.log('Test 5: Negative multiplier (-2)');
const modifiedFunc5 = modifyFunction(originalFunction, -2);
const result5 = modifiedFunc5(3);
console.log('Modified function output for 3:', result5);
console.log('Expected: -24 (12 * -2)');
console.log('Passed:', result5 === -24 ? '✓' : '✗');
console.log('');

// Test 6: Custom function
console.log('Test 6: Custom function (square)');
const squareFunc = (x) => x * x;
const modifiedSquare = modifyFunction(squareFunc, 2);
const result6 = modifiedSquare(5);
console.log('Modified square function output for 5:', result6);
console.log('Expected: 50 (25 * 2)');
console.log('Passed:', result6 === 50 ? '✓' : '✗');
console.log('');

// Summary
const allTests = [
  original4 === 16,
  modified4 === 48,
  result2 === 40,
  result3 === 20,
  result4 === 0,
  result5 === -24,
  result6 === 50
];

const passedTests = allTests.filter(test => test).length;
const totalTests = allTests.length;

console.log('='.repeat(50));
console.log(`Summary: ${passedTests}/${totalTests} tests passed`);
console.log('='.repeat(50));

