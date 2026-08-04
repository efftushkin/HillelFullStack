console.log('#53. JavaScript homework example file');

/*
 *
 * #1
 *
 * Технічне завдання для розробки функції "isDebugMode"
 *
 * Задача:
 * Розробити функцію, яка визначає чи знаходиться додаток у режимі відладки, виходячи зі значення змінної середовища `NODE_ENV`.
 * Функція повинна аналізувати стан середовища і відповідно повертати булеве значення, яке індикує режим відладки.
 * Додатково функція забезпечує логування процесу перевірки для допомоги у розумінні поточного стану виконання та середовища.
 *
 * Функціональні вимоги:
 * 1. Вхідні параметри:
 *  - Не потребує вхідних параметрів.
 *
 * 2. Визначення режиму відладки:
 *  - Функція `isDebugMode()` перевіряє значення змінної середовища `NODE_ENV`.
 *  - Повертає `true`, якщо `NODE_ENV` дорівнює 'development'.
 *  - Повертає `false`, якщо `NODE_ENV` має будь-яке інше значення або не встановлено.
 *
 * 3. Логування:
 *  - Логування поверненого значення у консоль перед завершенням функції.
 *  - Опційно, логування поточного значення `NODE_ENV` для кращого розуміння стану середовища.
 *
 * Технічні вимоги:
 * - Строга перевірка рівності використовуючи оператор `===`.
 * - Запис функції має бути виконаний з використанням стрілкової функції для підтримки сучасних стандартів ES6+.
 * - Код має бути написаний чисто і чітко, з урахуванням потенційних розширень для додаткових перевірок середовища.
 *
 */

const isDebugMode = () => {
  const currentEnv = process.env.NODE_ENV;
  console.log('Current NODE_ENV:', currentEnv);

  const debugMode = currentEnv === 'development';
  console.log('Is debug mode:', debugMode);

  return debugMode;
};

/*
 *
 * #2
 *
 * Технічне завдання для розробки функцій "encodeToBase64", "encodeToHex", "decodeFromBase64", і "decodeFromHex"
 *
 * Задача:
 * Розробити набір функцій, які забезпечують кодування та декодування рядків.
 * Функції повинні дозволяти об'єднувати вхідні параметри у рядок з роздільником та кодувати або декодувати його у формати Base64 і Hex.
 * Ці функції мають бути гнучкими для обробки довільної кількості рядків та забезпечувати чітке логування процесів кодування та декодування.
 *
 * Функціональні вимоги:
 * 1. Вхідні параметри:
 *  - Довільна кількість рядків як параметри функцій.
 *
 * 2. Операції кодування:
 *  - Використання функції `encodeToBase64(...args)`: об'єднання всіх аргументів у рядок з роздільником `:` і кодування його в формат base64.
 *  - Використання функції `encodeToHex(...args)`: об'єднання всіх аргументів у рядок з роздільником `:` і кодування його в шістнадцятковий формат.
 *
 * 3. Операції декодування:
 *  - Використання функції `decodeFromBase64(base64String)`: декодування рядка з формату base64 у звичайний рядок.
 *  - Використання функції `decodeFromHex(hexString)`: декодування рядка з шістнадцяткового формату у звичайний рядок.
 *
 * 4. Логування:
 *  - Логування отриманих даних у консоль при виклику кожної з функцій.
 *  - Логування можливих помилок в процесі кодування/декодування.
 *
 * Технічні вимоги:
 * - Використання сучасних можливостей JavaScript (ES6+), зокрема rest-параметрів для збору аргументів.
 * - Належне управління помилками та виключеннями.
 * - Код має бути чистим, добре структурованим, зі зрозумілими назвами змінних та функцій.
 *
 */

// Функції для кодування даних з довільною кількістю аргументів
function encodeToBase64(...args) {
  console.log('Encoding to Base64, input args:', args);
  try {
    const joined = args.join(':');
    const encoded = Buffer.from(joined, 'utf-8').toString('base64');
    console.log('Base64 encoded result:', encoded);
    return encoded;
  } catch (error) {
    console.error('Error encoding to Base64:', error.message);
    throw error;
  }
}

function encodeToHex(...args) {
  console.log('Encoding to Hex, input args:', args);
  try {
    const joined = args.join(':');
    const encoded = Buffer.from(joined, 'utf-8').toString('hex');
    console.log('Hex encoded result:', encoded);
    return encoded;
  } catch (error) {
    console.error('Error encoding to Hex:', error.message);
    throw error;
  }
}

// Функції для декодування даних
function decodeFromBase64(base64String) {
  console.log('Decoding from Base64, input:', base64String);
  try {
    const decoded = Buffer.from(base64String, 'base64').toString('utf-8');
    console.log('Base64 decoded result:', decoded);
    return decoded;
  } catch (error) {
    console.error('Error decoding from Base64:', error.message);
    throw error;
  }
}

function decodeFromHex(hexString) {
  console.log('Decoding from Hex, input:', hexString);
  try {
    const decoded = Buffer.from(hexString, 'hex').toString('utf-8');
    console.log('Hex decoded result:', decoded);
    return decoded;
  } catch (error) {
    console.error('Error decoding from Hex:', error.message);
    throw error;
  }
}

// ! Приклад використання:
// const base64Encoded = encodeToBase64('john@email.com', '123', 'extraData')
// console.log('Base64 Encoded:', base64Encoded)
//
// const hexEncoded = encodeToHex('john@email.com', '123', 'extraData')
// console.log('Hex Encoded:', hexEncoded)
//
// const base64Decoded = decodeFromBase64(base64Encoded)
// console.log('Base64 Decoded:', base64Decoded)
//
// const hexDecoded = decodeFromHex(hexEncoded)
// console.log('Hex Decoded:', hexDecoded)

/*
 *
 * #3
 *
 * Технічне завдання для розробки функцій "safeDecodeFromBase64" та "safeDecodeFromHex"
 *
 * Задача:
 * Розробити функції для безпечного декодування даних з форматів base64 та hex.
 * Функції повинні перевіряти валідність вхідних рядків і забезпечувати відповідні повідомлення про помилки та логування успішного виконання.
 *
 * Функціональні вимоги:
 * 1. Вхідні параметри:
 *  - `base64String` та `hexString`: рядки, які мають бути декодовані відповідно з форматів base64 та hex.
 *
 * 2. Операції декодування з перевіркою:
 *  - Використання функції `safeDecodeFromBase64(base64String)`: перевірка на валідність рядка у форматі base64 перед декодуванням, повернення декодованого рядка або помилки при невалідних даних.
 *  - Використання функції `safeDecodeFromHex(hexString)`: перевірка на валідність рядка у шістнадцятковому форматі перед декодуванням, повернення декодованого рядка або помилки при невалідних даних.
 *
 * 3. Обробка помилок:
 *  - Якщо декодування не вдається через невалідність вхідних даних, функції викидають помилку з інформативним повідомленням (`Invalid base64 string` або `Invalid hex string`).
 *  - Забезпечення прозорого інформування користувача про помилку при її виникненні.
 *
 * 4. Логування:
 *  - Логування декодованих даних у консоль при успішному декодуванні.
 *  - Логування помилок у консоль при їх виникненні.
 *
 * Технічні вимоги:
 * - Використання сучасних можливостей JavaScript (ES6+), зокрема регулярних виразів для перевірки формату вхідних даних.
 * - Належне управління помилками та виключеннями.
 * - Код має бути чистим, добре структурованим, зі зрозумілими назвами змінних та функцій.
 *
 */

function safeDecodeFromBase64(base64String) {
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

  if (typeof base64String !== 'string' || base64String.length === 0 || !base64Regex.test(base64String)) {
    const error = new Error('Invalid base64 string');
    console.error(error.message);
    throw error;
  }

  const decoded = Buffer.from(base64String, 'base64').toString('utf-8');
  console.log('Safe Base64 decoded result:', decoded);
  return decoded;
}

function safeDecodeFromHex(hexString) {
  const hexRegex = /^[0-9A-Fa-f]+$/;

  if (typeof hexString !== 'string' || hexString.length % 2 !== 0 || !hexRegex.test(hexString)) {
    const error = new Error('Invalid hex string');
    console.error(error.message);
    throw error;
  }

  const decoded = Buffer.from(hexString, 'hex').toString('utf-8');
  console.log('Safe Hex decoded result:', decoded);
  return decoded;
}

// ! Приклад використання:
// const safeBase64Decoded = safeDecodeFromBase64(base64Encoded)
// console.log('Safe Base64 Decoded:', safeBase64Decoded)
//
// const safeHexDecoded = safeDecodeFromHex(hexEncoded)
// console.log('Safe Hex Decoded:', safeHexDecoded)

export {
  isDebugMode,
  encodeToBase64,
  encodeToHex,
  decodeFromBase64,
  decodeFromHex,
  safeDecodeFromBase64,
  safeDecodeFromHex,
};
