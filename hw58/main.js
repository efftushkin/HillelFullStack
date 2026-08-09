import { createHash, pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';

console.log('#57. JavaScript homework example file');

/*
 *
 * #1
 *
 * Технічне завдання для розробки функції "generateHash"
 *
 * Задача:
 * Розробити функцію, що використовує криптографічний алгоритм SHA-256 для генерації хешу з заданого рядка. Функція має бути реалізована так, щоб її можна було легко тестувати, забезпечувати точність та безпеку генерації хешу.
 *
 * Функціональні вимоги:
 * 1. Вхідні параметри:
 *  - `input`: Рядок, який потрібно хешувати.
 *
 * 2. Вихідні дані:
 *  - Функція повертає хеш заданого рядка у форматі шістнадцяткового рядка.
 *
 * 3. Безпека:
 *  - Використання криптографічно стійкого алгоритму SHA-256.
 *
 * Технічні вимоги:
 * - Використання сучасних можливостей JavaScript (ES6+), включаючи модулі ESM для легкої інтеграції та тестування.
 * - Функція має бути написана таким чином, щоб вона могла бути експортована та використана в інших частинах програми або тестових сценаріях.
 * - Забезпечення документації коду з описом параметрів, процесу роботи та прикладами використання.
 * - Підготовка функції для можливості легкого мокування та тестування за допомогою JEST.
 *
 */

/**
 * Generates a SHA-256 hash of the given string.
 *
 * @param {string} input - The string to hash.
 * @returns {string} The resulting SHA-256 hash, encoded as a hexadecimal string.
 *
 * @example
 * const hash = generateHash('Hello, World!');
 * // => 'dffd6021bb2bd5b0afda...'
 */
function generateHash(input) {
  return createHash('sha256').update(input).digest('hex');
}

// console.log(generateHash('Hello, World!'))

/*
 *
 * #2
 *
 * Технічне завдання для розробки функції "generatePasswordHash"
 *
 * Задача:
 * Розробити функцію, що використовує PBKDF2 алгоритм для генерації хешу паролю з використанням солі. Функція повинна забезпечити високий рівень безпеки збережених паролів і бути легкою для тестування та інтеграції в більші системи.
 *
 * Функціональні вимоги:
 * 1. Вхідні параметри:
 *  - `password`: Рядок пароля, який потрібно захешувати.
 *  - `salt`: Сіль, яка використовується для генерації хешу, має бути у форматі рядка.
 *  - `iterations`: Кількість ітерацій хешування (дефолтне значення 10000).
 *  - `keylen`: Довжина ключа у байтах (дефолтне значення 64).
 *  - `digest`: Алгоритм хешування (дефолтне значення 'sha512').
 *
 * 2. Вихідні дані:
 *  - Функція повертає хеш заданого пароля у форматі шістнадцяткового рядка.
 *
 * 3. Безпека:
 *  - Використання алгоритму PBKDF2 для забезпечення стійкості до атак брутфорсом і rainbow tables.
 *
 * Технічні вимоги:
 * - Використання сучасних можливостей JavaScript (ES6+), включаючи модулі ESM для легкої інтеграції та тестування.
 * - Код має бути чистим, добре структурованим, з логічною структурою та зрозумілими назвами змінних та функцій.
 * - Підготовка функції для легкої інтеграції у тести, використовуючи JEST для мокування залежностей і перевірки поведінки функції.
 *
 */

/**
 * Derives a password hash using the PBKDF2 algorithm.
 *
 * @param {string} password - The plain-text password to hash.
 * @param {string} salt - The salt used to randomize the derived hash.
 * @param {number} [iterations=10000] - Number of PBKDF2 iterations to apply.
 * @param {number} [keylen=64] - Length, in bytes, of the derived key.
 * @param {string} [digest='sha512'] - HMAC digest algorithm used by PBKDF2.
 * @returns {string} The derived password hash, encoded as a hexadecimal string.
 *
 * @example
 * const salt = randomBytes(16).toString('hex');
 * const hash = generatePasswordHash('superSecret123', salt);
 */
function generatePasswordHash(password, salt, iterations = 10000, keylen = 64, digest = 'sha512') {
  return pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
}

// Застосування функції
// const password = 'superSecret123'
// const salt = randomBytes(16).toString('hex')
// const hash = generatePasswordHash(password, salt)

/*
 *
 * #3
 *
 * Технічне завдання для розробки функції "verifyPassword"
 *
 * Задача:
 * Розробити функцію, яка перевіряє відповідність введеного пароля збереженому хешу, використовуючи алгоритм PBKDF2. Функція повинна підтверджувати або спростовувати відповідність на основі переданих параметрів солі, ітерацій, довжини ключа та алгоритму хешування.
 *
 * Функціональні вимоги:
 * 1. Вхідні параметри:
 *  - `inputPassword`: Рядок, введений користувачем як пароль.
 *  - `storedHash`: Рядок, що містить збережений хеш паролю.
 *  - `salt`: Рядок, який представляє сіль, використану для генерації збереженого хешу.
 *  - `iterations`: Кількість ітерацій хешування (дефолтне значення 10000).
 *  - `keylen`: Довжина ключа у байтах (дефолтне значення 64).
 *  - `digest`: Алгоритм хешування (дефолтне значення 'sha512').
 *
 * 2. Результат:
 *  - Функція повертає булеве значення: `true`, якщо хеш введеного паролю співпадає з збереженим хешем; `false` — в інших випадках.
 *
 * 3. Безпека:
 *  - Використання надійних криптографічних методів для забезпечення захисту відомостей про паролі.
 *
 * Технічні вимоги:
 * - Використання сучасних можливостей JavaScript (ES6+), зокрема модулів ECMAScript для імпорту та експорту функцій.
 * - Чистий, добре структурований код з логічною структурою та зрозумілими назвами змінних і функцій.
 * - Підготовка функції для легкої інтеграції у тести, використовуючи JEST для мокування залежностей і перевірки поведінки функції.
 *
 */

/**
 * Verifies a plain-text password against a previously stored PBKDF2 hash.
 *
 * Recomputes the hash for `inputPassword` using the same salt, iterations,
 * key length and digest that produced `storedHash`, then compares the two
 * hashes with a timing-safe comparison to avoid leaking information through
 * response-time differences.
 *
 * @param {string} inputPassword - The plain-text password provided by the user.
 * @param {string} storedHash - The previously stored password hash (hexadecimal string).
 * @param {string} salt - The salt originally used to produce `storedHash`.
 * @param {number} [iterations=10000] - Number of PBKDF2 iterations used to produce `storedHash`.
 * @param {number} [keylen=64] - Length, in bytes, of the derived key.
 * @param {string} [digest='sha512'] - HMAC digest algorithm used to produce `storedHash`.
 * @returns {boolean} `true` if `inputPassword` matches `storedHash`, otherwise `false`.
 *
 * @example
 * const isCorrect = verifyPassword(inputPassword, hash, salt);
 */
function verifyPassword(
  inputPassword,
  storedHash,
  salt,
  iterations = 10000,
  keylen = 64,
  digest = 'sha512',
) {
  const inputHash = pbkdf2Sync(inputPassword, salt, iterations, keylen, digest);
  const storedHashBuffer = Buffer.from(storedHash, 'hex');

  if (inputHash.length !== storedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(inputHash, storedHashBuffer);
}

// Застосування функції
// const inputPassword = 'superSecret123'
// const isCorrect = verifyPassword(inputPassword, hash, salt)
// console.log(isCorrect ? 'Пароль вірний.' : 'Пароль невірний.')

export { generateHash, generatePasswordHash, verifyPassword };
