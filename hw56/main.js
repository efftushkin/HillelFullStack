console.log('#56. JavaScript homework example file');

/*
 *
 * #1
 *
 * Technical specification for the "asyncOperationDemo" function
 *
 * Task:
 * Develop a function that illustrates the use of Node.js asynchronous APIs: process.nextTick, setImmediate, and setTimeout.
 * The function should demonstrate the execution order of asynchronous operations within the Node.js event loop and document the process through systematic logging.
 *
 * Functional requirements:
 * 1. Input parameters:
 *  - `callback`: A callback function invoked after each asynchronous operation with the corresponding operation identifier.
 *
 * 2. Asynchronous code operations:
 *  - Use `process.nextTick` to demonstrate immediate asynchronous execution right after the current operation.
 *  - Use `setImmediate` to demonstrate scheduling execution for the next iteration of the event loop.
 *  - Use `setTimeout` with a `0` delay to demonstrate execution after all scheduled `immediate` callbacks and before the next iterations of the event loop.
 *
 * 3. Logging:
 *  - Log "First call" at the start of the function execution.
 *  - Log "Executed nextTick", "Executed setImmediate", and "Executed setTimeout" during the execution of the corresponding asynchronous operations.
 *  - Log "Last call" after initiating all asynchronous operations, but before they complete.
 *  - Use the callback to pass the result of each asynchronous operation.
 *  - Log "Execution completed: [operation]" after each asynchronous action.
 *
 * Technical requirements:
 * - Use modern JavaScript (ES6+) features, including async/await where appropriate.
 * - Proper handling of asynchronous processes and exceptions to ensure correct behavior.
 * - Code should be clean, well-structured, with a logical flow and clear variable/function names.
 * - Prepare the function for easy integration into tests, e.g. using JEST for mocking dependencies and verifying behavior.
 *
 */

function asyncOperationDemo(callback) {
  console.log('First call');

  process.nextTick(() => {
    console.log('Executed nextTick');
    callback('nextTick');
  });

  setImmediate(() => {
    console.log('Executed setImmediate');
    callback('setImmediate');
  });

  setTimeout(() => {
    console.log('Executed setTimeout');
    callback('setTimeout');
  }, 0);

  console.log('Last call');
}

asyncOperationDemo(operation => {
  console.log(`Execution completed: ${operation}`);
});

export { asyncOperationDemo };
