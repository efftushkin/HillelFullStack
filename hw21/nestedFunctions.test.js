import { outerFunction } from './nestedFunctions.js';

// Test 1: Basic test case from the homework
const result1 = outerFunction(2)(3)(4);
console.log('Test 1: outerFunction(2)(3)(4)');
console.log('Expected: 24');
console.log('Result:', result1);
console.log('Passed:', result1 === 24 ? '✓' : '✗');
console.log('');

// Test 2: Multiplication with 1
const result2 = outerFunction(1)(1)(1);
console.log('Test 2: outerFunction(1)(1)(1)');
console.log('Expected: 1');
console.log('Result:', result2);
console.log('Passed:', result2 === 1 ? '✓' : '✗');
console.log('');

// Test 3: Multiplication with 0
const result3 = outerFunction(5)(0)(10);
console.log('Test 3: outerFunction(5)(0)(10)');
console.log('Expected: 0');
console.log('Result:', result3);
console.log('Passed:', result3 === 0 ? '✓' : '✗');
console.log('');

// Test 4: Negative numbers
const result4 = outerFunction(-2)(3)(4);
console.log('Test 4: outerFunction(-2)(3)(4)');
console.log('Expected: -24');
console.log('Result:', result4);
console.log('Passed:', result4 === -24 ? '✓' : '✗');
console.log('');

// Test 5: Decimal numbers
const result5 = outerFunction(2.5)(4)(2);
console.log('Test 5: outerFunction(2.5)(4)(2)');
console.log('Expected: 20');
console.log('Result:', result5);
console.log('Passed:', result5 === 20 ? '✓' : '✗');
console.log('');

// Test 6: Large numbers
const result6 = outerFunction(10)(10)(10);
console.log('Test 6: outerFunction(10)(10)(10)');
console.log('Expected: 1000');
console.log('Result:', result6);
console.log('Passed:', result6 === 1000 ? '✓' : '✗');
console.log('');

// Summary
const allTests = [
  result1 === 24,
  result2 === 1,
  result3 === 0,
  result4 === -24,
  result5 === 20,
  result6 === 1000
];

const passedTests = allTests.filter(test => test).length;
const totalTests = allTests.length;

console.log('='.repeat(40));
console.log(`Summary: ${passedTests}/${totalTests} tests passed`);
console.log('='.repeat(40));
