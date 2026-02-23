import { curriedDomain } from './curriedDomain.js';

console.log('='.repeat(50));
console.log('Testing curriedDomain Homework');
console.log('='.repeat(50));
console.log('');

// Test 1: Basic test case from the homework
console.log('Test 1: curriedDomain("https")("example")("com")');
const result1 = curriedDomain('https')('example')('com');
console.log('Expected: https://example.com');
console.log('Result:', result1);
console.log('Passed:', result1 === 'https://example.com' ? '✓' : '✗');
console.log('');

// Test 2: Step-by-step currying (from homework example)
console.log('Test 2: Step-by-step currying');
const protocolSetter = curriedDomain('https');
const domainNameSetter = protocolSetter('example');
const fullDomain = domainNameSetter('com');
console.log('Expected: https://example.com');
console.log('Result:', fullDomain);
console.log('Passed:', fullDomain === 'https://example.com' ? '✓' : '✗');
console.log('');

// Test 3: HTTP protocol
console.log('Test 3: curriedDomain("http")("mywebsite")("org")');
const result3 = curriedDomain('http')('mywebsite')('org');
console.log('Expected: http://mywebsite.org');
console.log('Result:', result3);
console.log('Passed:', result3 === 'http://mywebsite.org' ? '✓' : '✗');
console.log('');

// Test 4: Different TLD
console.log('Test 4: curriedDomain("https")("google")("net")');
const result4 = curriedDomain('https')('google')('net');
console.log('Expected: https://google.net');
console.log('Result:', result4);
console.log('Passed:', result4 === 'https://google.net' ? '✓' : '✗');
console.log('');

// Test 5: FTP protocol
console.log('Test 5: curriedDomain("ftp")("files")("io")');
const result5 = curriedDomain('ftp')('files')('io');
console.log('Expected: ftp://files.io');
console.log('Result:', result5);
console.log('Passed:', result5 === 'ftp://files.io' ? '✓' : '✗');
console.log('');

// Test 6: Country-specific TLD
console.log('Test 6: curriedDomain("https")("website")("co.uk")');
const result6 = curriedDomain('https')('website')('co.uk');
console.log('Expected: https://website.co.uk');
console.log('Result:', result6);
console.log('Passed:', result6 === 'https://website.co.uk' ? '✓' : '✗');
console.log('');

// Test 7: Reusing intermediate functions
console.log('Test 7: Reusing intermediate functions');
const httpsProtocol = curriedDomain('https');
const github = httpsProtocol('github');
const result7a = github('com');
const result7b = github('io');
console.log('github("com") Expected: https://github.com, Result:', result7a, 'Passed:', result7a === 'https://github.com' ? '✓' : '✗');
console.log('github("io") Expected: https://github.io, Result:', result7b, 'Passed:', result7b === 'https://github.io' ? '✓' : '✗');
console.log('');

// Test 8: Multiple domains with same protocol
console.log('Test 8: Multiple domains with same protocol');
const httpProtocol = curriedDomain('http');
const result8a = httpProtocol('site1')('com');
const result8b = httpProtocol('site2')('org');
console.log('site1.com Expected: http://site1.com, Result:', result8a, 'Passed:', result8a === 'http://site1.com' ? '✓' : '✗');
console.log('site2.org Expected: http://site2.org, Result:', result8b, 'Passed:', result8b === 'http://site2.org' ? '✓' : '✗');
console.log('');

// Summary
const allTests = [
  result1 === 'https://example.com',
  fullDomain === 'https://example.com',
  result3 === 'http://mywebsite.org',
  result4 === 'https://google.net',
  result5 === 'ftp://files.io',
  result6 === 'https://website.co.uk',
  result7a === 'https://github.com',
  result7b === 'https://github.io',
  result8a === 'http://site1.com',
  result8b === 'http://site2.org'
];

const passedTests = allTests.filter(test => test).length;
const totalTests = allTests.length;

console.log('='.repeat(50));
console.log(`Summary: ${passedTests}/${totalTests} tests passed`);
console.log('='.repeat(50));

