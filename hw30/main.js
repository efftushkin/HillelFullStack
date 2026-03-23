console.log('#11. JavaScript homework example file')

/*
 * #1
 *
 * Написати функцію, яка приймає рядок як вхідний параметр і перевіряє, чи є цей рядок валідною електронною адресою за допомогою регулярного виразу.
 * Функція повертає true, якщо електронна адреса валідна, і false в іншому випадку.
 *
 */

function isValidEmail(email) {
  // Regular expression for validating email addresses
  // Pattern: username@domain.extension
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

console.log('isValidEmail("example@example.com")', isValidEmail('example@example.com')) // Повинно вивести: true
console.log('isValidEmail("invalid-email")', isValidEmail('invalid-email'))       // Повинно вивести: false

/*
 * #2
 *
 * Написати функцію, яка приймає рядок як вхідний параметр і перевіряє, чи є цей рядок валідним URL веб-сайту за допомогою регулярного виразу.
 * Функція повертає true, якщо URL валідний, і false в іншому випадку.
 *
 */

/*

*/

function isValidUrl(url) {
  // Regular expression for validating URLs
  // Pattern: protocol://domain.extension with optional path
  const urlRegex = /^(https?:\/\/)([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(\/[^\s]*)?$/
  return urlRegex.test(url)
}

console.log('isValidUrl("https://www.example.com")', isValidUrl('https://www.example.com')) // Повинно вивести: true
console.log('isValidUrl("http://www.example.com")', isValidUrl('http://www.example.com')) // Повинно вивести: true
console.log('isValidUrl("invalid-url")', isValidUrl('invalid-url'))             // Повинно вивести: false

// Експорт функції для використання та тестування
export { isValidEmail, isValidUrl }
