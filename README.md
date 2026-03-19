# HillelFullStack

This repository contains homework assignments for the Fullstack JavaScript course from Hillel.

## Course Structure

This repository will be continuously updated with homework assignments as the course progresses.

### Completed Assignments

#### HW1 - Basic HTML
- **Location**: `hw1/`
- **Description**: Introduction to HTML basics
- **Topics**: Basic HTML tags and document structure
- **File**: `index.html`

#### HW2 - Multi-page Website
- **Location**: `hw2/`
- **Description**: Multi-page website about Amanita Design's Samorost game series
- **Topics**: HTML structure, navigation, forms, semantic markup
- **Pages**:
  - Home (`index.html`)
  - About (`about.html`)
  - Articles - Samorost 1, 2, 3 (`samorost1.html`, `samorost2.html`, `samorost3.html`)
  - Gallery (`gallery.html`)
  - Contacts (`contacts.html`)

#### HW3 - Styled Website
- **Location**: `hw3/`
- **Description**: Enhanced version of HW2 with CSS styling
- **Topics**: CSS fundamentals, flexbox, responsive design, gradients
- **Features**:
  - Modern styling with gradients and shadows
  - Responsive navigation
  - Styled image gallery
  - Form styling
- **Stylesheet**: `styles/main.css`

#### HW4 - CSS Selectors
- **Location**: `hw4/`
- **Description**: Demonstration of CSS selector types and specificity (in Ukrainian)
- **Topics**: CSS selectors, specificity weights, selector types
- **Features**:
  - Tag selectors
  - Class selectors
  - ID selectors
  - Attribute selectors
  - Specificity calculation examples

#### HW6 - HTML Table Layout
- **Location**: `hw6/`
- **Description**: Creating a Mondrian-style composition using HTML tables
- **Topics**: HTML tables, colspan, rowspan, CSS layout
- **Features**:
  - Complex table structure with merged cells
  - Mondrian-inspired color scheme (yellow, red, blue, black)
  - Precise sizing with CSS classes
  - Centered layout with flexbox
- **Files**: `index.html`, `style.css`

#### HW7 - CSS Box Model Experiments
- **Location**: `hw7/`
- **Description**: Comprehensive CSS box model experiments with interactive demonstrations (in Ukrainian)
- **Topics**: Box model, positioning, display properties, float, overflow
- **Exercises**:
  - Block and inline elements (`02-block-inline.html`)
  - Normalize.css demonstration (`03-normalize.html`)
  - Reset.css demonstration (`03-reset.html`)
  - CSS properties: display and box-sizing (`04-css-properties.html`)
  - Float and clear techniques (`05-float-clear.html`)
  - Overflow property (`06-overflow.html`)
  - Positioning: static, relative, absolute, fixed, sticky (`07-positioning.html`)
- **Features**:
  - Interactive navigation hub (`index.html`)
  - Detailed explanations in Ukrainian
  - Visual demonstrations of each concept
  - Comparison of normalize.css vs reset.css

#### HW8 - Float Layout Practice
- **Location**: `hw8/`
- **Description**: Practical exercises with CSS float layouts (in Ukrainian)
- **Topics**: Float positioning, clearfix, layout techniques
- **Layout Variants**:
  1. One block left, one block right
  2. One block left, multiple blocks right
  3. Two blocks left, two blocks right
  4. Three blocks right (two stacked)
  5. Three blocks centered (two stacked)
- **Features**:
  - Clearfix technique implementation
  - Color-coded blocks for visual clarity
  - Responsive block sizing
  - Margin and spacing control
- **Files**: `float-layout.html`, `styles.css`

#### HW18 - JavaScript Basics: Variables and Data Types
- **Location**: `hw18/`
- **Description**: Introduction to JavaScript fundamentals (in Ukrainian)
- **Topics**: Variables, data types, type conversion, BigInt
- **Exercises**:
  1. Creating variables with different data types (number, string, boolean, array, object)
  2. Formatting numbers with `toFixed()` method
  3. Working with BigInt data type
- **Features**:
  - Practical examples of JavaScript primitives
  - Type conversion demonstrations
  - BigInt arithmetic operations
- **File**: `main.js`

#### HW19 - JavaScript Functions
- **Location**: `hw19/`
- **Description**: Introduction to JavaScript functions (in Ukrainian)
- **Topics**: Function declaration, parameters, return values, Math methods, BigInt operations
- **Exercises**:
  1. `getRandomInt(min, max)` - Generate random integers in a range using `Math.random()` and `Math.floor()`
  2. `greetByName(msg, name)` - String concatenation function for personalized greetings
  3. `sumBigIntegers(numStr1, numStr2)` - Convert strings to BigInt and perform addition
- **Features**:
  - Practical function implementations
  - Working with Math object methods
  - String to BigInt conversion
  - Understanding uniform distribution in random number generation
- **Files**: `getRandomInt.js`, `greetByName.js`, `sumBigIntegers.js`

#### HW20 - JavaScript Advanced: Objects, Loops, and Control Flow
- **Location**: `hw20/`
- **Description**: Comprehensive JavaScript exercises covering objects, methods, loops, and control structures (in Ukrainian)
- **Topics**: Objects, methods, loops (for/while), switch/case, ternary operator, callbacks, logical operators
- **Exercises**:
  1. Create object with properties and methods (`userObj.fullName()`)
  2. `defUpperStr(str)` - Default parameters using logical OR operator
  3. `evenFn(n)` - Generate array of even numbers using `for` loop
  4. `weekFn(n)` - Day of week function using `switch/case` with validation
  5. `ageClassification(n)` - Age classification using ternary operator chains
  6. `oddFn(n)` - Generate array of odd numbers using `while` loop
  7. `mainFunc(a, b, callback)` - Callback functions (`cbRandom`, `cbPow`, `cbAdd`)
- **Features**:
  - Object methods with `this` keyword
  - Type checking and validation
  - Different loop types (for, while)
  - Switch/case statements
  - Ternary operator chains
  - Callback function pattern
  - Logical operators for default values
- **File**: `main.js`

#### HW21 - JavaScript Advanced: Closures, Currying, and Higher-Order Functions
- **Location**: `hw21/`
- **Description**: Advanced JavaScript concepts with closures, currying, and higher-order functions (in Ukrainian)
- **Topics**: Closures, currying, higher-order functions, nested functions, ES6 modules
- **Exercises**:
  1. `curriedAdd(a)(b)(c)` - Curried function for sequential addition of three numbers
  2. `curriedDomain(protocol)(domainName)(tld)` - Build full domain name using currying
  3. `modifyFunction(originalFunc, multiplier)` - Higher-order function to modify behavior
  4. `outerFunction(arg1)(arg2)(arg3)` - Three-level nested functions with multiplication
- **Features**:
  - Deep understanding of closures and scope
  - Currying pattern implementation
  - Higher-order functions
  - Function composition
  - ES6 module exports
  - Comprehensive test files for each exercise
- **Files**: `curriedAdd.js`, `curriedDomain.js`, `modifyFunction.js`, `nestedFunctions.js` (with corresponding `.test.js` files)

#### HW22 - JavaScript Advanced: Closures, Recursion, and Function Methods
- **Location**: `hw22/`
- **Description**: Advanced JavaScript exercises focusing on closures, IIFE, recursion, and function methods (in Ukrainian)
- **Topics**: Closures, IIFE (Immediately Invoked Function Expression), recursion, `apply()`, `bind()`, arrow functions
- **Exercises**:
  1. `counter(n)` - Counter with closure and optional reset functionality
  2. `counterFactory` - Object with methods (`value()`, `increment()`, `decrement()`) using closures
  3. `myPow(a, b, myPrint)` - Recursive power calculation with callback function
  4. `myMax(arr)` - Find maximum value using `Math.max.apply()`
  5. `myDouble(n)` and `myTriple(n)` - Partial application using `bind()`
- **Features**:
  - IIFE pattern for encapsulation
  - Private variables with closures
  - Recursive algorithms (power calculation with negative exponents)
  - Function methods: `apply()` and `bind()`
  - Partial application pattern
  - Arrow function syntax
  - ES6 module exports
- **File**: `main.js`

#### HW23 - JavaScript: Map and Set Data Structures
- **Location**: `hw23/`
- **Description**: JavaScript exercises focusing on ES6 Map and Set data structures (in Ukrainian)
- **Topics**: ES6 classes, Map, Set, data structure operations
- **Exercises**:
  1. `CalorieCalculator` class - Manage product calorie data using Map
     - `addProduct(productName, calories)` - Add product with calorie value
     - `getProductCalories(productName)` - Get calories or 'Product not found'
     - `removeProduct(productName)` - Remove product from collection
  2. `UniqueUsernames` class - Manage unique usernames using Set
     - `addUser(username)` - Add username (automatically ensures uniqueness)
     - `exists(username)` - Check if username exists
     - `count()` - Get count of unique usernames
- **Features**:
  - ES6 Map data structure for key-value storage
  - ES6 Set data structure for unique values
  - Map methods: `set()`, `get()`, `has()`, `delete()`
  - Set methods: `add()`, `has()`, `size`
  - Automatic uniqueness enforcement with Set
  - ES6 class syntax
  - ES6 module exports
- **File**: `main.js`

#### HW24 - JavaScript: Array Methods, Classes, and Constructor Functions
- **Location**: `hw24/`
- **Description**: JavaScript exercises covering array methods, ES6 classes, and constructor functions (in Ukrainian)
- **Topics**: Array methods (`reduce`, `map`), ES6 classes, constructor functions, Date API, validation
- **Exercises**:
  1. `sumArray(numbers)` - Calculate sum of array elements using `reduce()`
  2. `doubleArrayElements(numbers)` - Double each element using `map()`
  3. `SkillsManager` class - Manage skills list with validation
     - `addSkill(skill)` - Add skill with string validation (min 2 characters)
     - `getAllSkills()` - Return all skills
  4. `DateCalculator` constructor function - Date manipulation utility
     - `addDays(days)` - Add days to current date
     - `subtractDays(days)` - Subtract days from current date
     - `getResult()` - Return date in "YYYY-MM-DD" format
- **Features**:
  - Functional array methods (`reduce`, `map`)
  - ES6 class syntax with constructor and methods
  - Constructor function pattern with `new` keyword
  - Input validation (type checking, length validation)
  - Date API manipulation
  - String formatting with `padStart()`
  - ES6 module exports
- **File**: `main.js`

#### HW25 - JavaScript: DOM Manipulation and Web Storage APIs
- **Location**: `hw25/`
- **Description**: JavaScript exercises focusing on DOM manipulation, cookies, and web storage (in Ukrainian)
- **Topics**: DOM API, cookies, sessionStorage, `document.createElement()`, `encodeURIComponent()`
- **Exercises**:
  1. `createDomElement(tagName, textContent, container)` - Create and append DOM element
     - Creates element with specified tag name
     - Sets text content
     - Appends to container
     - Returns created element reference
  2. `setUserInfoCookie(key, value)` - Set cookie with 10-second expiration
     - Encodes value for safe storage
     - Sets cookie with expiration date
     - Logs success message
  3. `saveUserInfo(key, value)` - Save data to sessionStorage
     - Stores key-value pair in sessionStorage
     - Logs saved data
  4. `getUserInfo(key)` - Retrieve data from sessionStorage
     - Gets value by key from sessionStorage
     - Logs retrieved data
     - Returns the value
- **Features**:
  - DOM manipulation with `document.createElement()` and `appendChild()`
  - Cookie management with expiration dates
  - URL encoding with `encodeURIComponent()`
  - sessionStorage API (`setItem()`, `getItem()`)
  - Date manipulation for cookie expiration
  - ES6 module exports
- **File**: `main.js`

#### HW26 - JavaScript: Event Handling and Event Delegation
- **Location**: `hw26/`
- **Description**: JavaScript exercises focusing on DOM events, event listeners, and event delegation (in Ukrainian)
- **Topics**: Event handling, `addEventListener()`, event delegation, mouse events, ES6 modules
- **Exercises**:
  1. `handleButtonClick(buttonId, message)` - Attach click event handler to button
     - Finds button by ID
     - Adds click event listener
     - Logs custom message on click
  2. `trackMousePosition()` - Track mouse movement across document
     - Listens to `mousemove` event
     - Logs mouse coordinates (clientX, clientY)
     - Returns cleanup function to remove listener
  3. `setupEventDelegation(selector)` - Event delegation for list items
     - Attaches single event listener to parent list
     - Detects clicks on `<li>` elements
     - Logs clicked item text
- **Features**:
  - DOM event handling with `addEventListener()`
  - Event object properties (`clientX`, `clientY`, `target`, `tagName`)
  - Event delegation pattern for performance
  - Event listener cleanup with `removeEventListener()`
  - ES6 modules with `type="module"`
  - Interactive HTML demo page
- **Files**: `main.js`, `index.html`, `style.css`
- **Note**: Use **Live Server** extension for VSCode to avoid CORS errors when working with ES6 modules. Simply right-click on `index.html` and select "Open with Live Server".

#### HW29 - JavaScript: Unit Testing with Jest
- **Location**: `hw29/`
- **Description**: Introduction to unit testing with Jest framework (in Ukrainian)
- **Topics**: Jest testing framework, unit tests, test suites, npm scripts, CommonJS modules
- **Setup**:
  - Initialize npm project (`npm init -y`)
  - Install Jest as dev dependency (`npm install --save-dev jest`)
  - Configure test script in `package.json`: `"test": "jest"`
- **Functions to Test**:
  1. `ageClassification(num)` - Age classification with ternary operators
     - Returns age category based on number ranges
     - Categories: null, Дитинство, Молодість, Зрілість, Старість, Довголіття, Рекорд
  2. `weekFn(cond)` - Day of week function with switch/case
     - Returns Ukrainian day name for numbers 1-7
     - Returns null for invalid inputs
- **Test Coverage**:
  - Comprehensive test suites with `describe()` blocks
  - Multiple test cases with `test()` and `expect()`
  - Edge case testing (boundaries, invalid inputs)
  - Type validation tests (strings, decimals, null, undefined)
  - 30+ test cases total
- **Features**:
  - Jest testing framework setup
  - Test organization with `describe()` and `test()`
  - Assertions with `expect()` and `toBe()`
  - CommonJS module exports (`module.exports`)
  - npm test script execution
  - `__tests__` directory structure
- **Files**: `main.js`, `__tests__/main.test.js`, `package.json`
- **Run Tests**: `npm test`

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)

## Development Tools

- **Augment** - AI-powered coding assistant used for development support and learning

## How to View

### HTML/CSS Assignments (HW1-HW8)
Open any `index.html` or `.html` file in a web browser to view the respective homework assignment.

### JavaScript Assignments (HW18+)
Run JavaScript files using Node.js:
```bash
node hw18/main.js
node hw19/getRandomInt.js
node hw19/greetByName.js
node hw19/sumBigIntegers.js
```

Or open the browser console and copy-paste the code to see the output.

## Author

Sirg [efftushkin] - student at Hillel IT School - Fullstack JavaScript Course
