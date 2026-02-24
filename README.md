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
