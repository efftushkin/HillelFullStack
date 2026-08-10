import { createReadStream, createWriteStream } from 'node:fs';
import { access } from 'node:fs/promises';
import { basename, dirname, extname, join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createGunzip, createGzip } from 'node:zlib';

console.log('#58. JavaScript homework example file');

/**
 * Checks whether a file exists at the given path.
 *
 * @param {string} filePath - Path to check.
 * @returns {Promise<boolean>} `true` if the file exists, otherwise `false`.
 */
async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generates a unique file path by appending an incrementing counter to the
 * file name (before its extension) until a path that doesn't exist yet is found.
 *
 * @param {string} filePath - Desired file path.
 * @returns {Promise<string>} A path guaranteed not to collide with an existing file.
 *
 * @example
 * const uniquePath = await generateUniqueFilePath('./files/report.txt');
 * // => './files/report.txt' or './files/report(1).txt' if the former exists
 */
async function generateUniqueFilePath(filePath) {
  if (!(await fileExists(filePath))) {
    return filePath;
  }

  const directory = dirname(filePath);
  const extension = extname(filePath);
  const nameWithoutExtension = basename(filePath, extension);

  let counter = 1;
  let candidatePath;
  do {
    candidatePath = join(directory, `${nameWithoutExtension}(${counter})${extension}`);
    counter += 1;
  } while (await fileExists(candidatePath));

  return candidatePath;
}

/*
 *
 * #1
 *
 * Технічне завдання для розробки функції "compressFile"
 *
 * Задача:
 * Розробити асинхронну функцію, що використовує алгоритм Gzip для компресії заданого файлу.
 * Функція має генерувати унікальне ім'я для компресованого файлу, якщо файл з таким іменем вже існує,
 * та забезпечувати високий рівень надійності та безпеки процесу компресії.
 *
 * Функціональні вимоги:
 * 1. Вхідні параметри:
 *    - `filePath`: Шлях до файлу, який потрібно компресувати.
 *
 * 2. Вихідні дані:
 *    - Функція повертає шлях до компресованого файлу як рядок.
 *
 * 3. Унікальність:
 *    - Перевірка наявності існуючих файлів з таким самим іменем і створення унікального імені файлу
 *      шляхом додавання номера до існуючого імені, якщо необхідно.
 *
 * 4. Обробка помилок:
 *    - Функція має ідентифікувати та коректно обробляти помилки читання, запису та доступу до файлів.
 *    - В разі помилок, функція має повертати відповідні повідомлення про помилку або коди помилок,
 *      що дозволяють користувачеві або іншим частинам програми адекватно реагувати на такі ситуації.
 *
 * Технічні вимоги:
 * - Використання сучасних можливостей JavaScript (ES6+), включаючи асинхронні функції, стрімове API Node.js, та ESM
 *   для легкої інтеграції та тестування.
 * - Функція має бути написана таким чином, щоб її можна було експортувати та використовувати в інших частинах програми
 *   або тестових сценаріях.
 * - Забезпечення документації коду з описом параметрів, процесу роботи, виключень, які можуть бути згенеровані,
 *   та прикладами використання.
 * - Підготовка функції для можливості легкого мокування та тестування за допомогою JEST.
 *
 */

/**
 * Compresses a file using the Gzip algorithm.
 *
 * Streams `filePath` through a Gzip transform and writes the result next to
 * the source file with a `.gz` extension. If a file with that name already
 * exists, a numeric suffix is appended to the output name to keep it unique.
 *
 * @param {string} filePath - Path to the file that should be compressed.
 * @returns {Promise<string>} Resolves with the path to the compressed file.
 * @throws {Error} If `filePath` cannot be read or the compressed file cannot be written.
 *
 * @example
 * const compressedPath = await compressFile('./files/source.txt');
 * // => './files/source.txt.gz'
 */
async function compressFile(filePath) {
  const outputFilePath = await generateUniqueFilePath(`${filePath}.gz`);

  try {
    await pipeline(createReadStream(filePath), createGzip(), createWriteStream(outputFilePath));
  } catch (error) {
    throw new Error(`Failed to compress file "${filePath}": ${error.message}`);
  }

  return outputFilePath;
}

/*
 *
 * #2
 *
 * Технічне завдання для розробки функції "decompressFile"
 *
 * Задача:
 * Розробити асинхронну функцію, яка використовує алгоритм Gzip для розпакування заданого компресованого файлу у вказане місце збереження. Функція має генерувати унікальне ім'я для розпакованого файлу, якщо файл з таким іменем вже існує, та забезпечувати високий рівень надійності та безпеки процесу розпакування.
 *
 * Функціональні вимоги:
 * 1. Вхідні параметри:
 *  - `compressedFilePath`: Шлях до компресованого файлу, який потрібно розпакувати.
 *  - `destinationFilePath`: Шлях, де буде збережено розпакований файл.
 *
 * 2. Вихідні дані:
 *  - Функція повертає шлях до розпакованого файлу як рядок.
 *
 * 3. Унікальність:
 *  - Перевірка наявності існуючих файлів з таким самим іменем і створення унікального імені файлу шляхом додавання номера до існуючого імені, якщо необхідно.
 *
 * 4. Обробка помилок:
 *  - Функція має ідентифікувати та коректно обробляти помилки читання, запису та доступу до файлів.
 *  - В разі помилок, функція має повертати відповідні повідомлення про помилку або коди помилок,
 *    що дозволяють користувачеві або іншим частинам програми адекватно реагувати на такі ситуації.
 *
 * Технічні вимоги:
 * - Використання сучасних можливостей JavaScript (ES6+), включаючи асинхронні функції, стрімове API Node.js, та ESM для легкої інтеграції та тестування.
 * - Функція має бути написана таким чином, щоб її можна було експортувати та використовувати в інших частинах програми або тестових сценаріях.
 * - Забезпечення документації коду з описом параметрів, процесу роботи, виключень, які можуть бути згенеровані, та прикладами використання.
 * - Підготовка функції для можливості легкого мокування та тестування за допомогою JEST.
 *
 */

/**
 * Decompresses a Gzip-compressed file to a given destination.
 *
 * Streams `compressedFilePath` through a Gunzip transform and writes the
 * decompressed result to `destinationFilePath`. If a file already exists at
 * the destination, a numeric suffix is appended to the output name to keep it unique.
 *
 * @param {string} compressedFilePath - Path to the Gzip-compressed file.
 * @param {string} destinationFilePath - Path where the decompressed file should be saved.
 * @returns {Promise<string>} Resolves with the path to the decompressed file.
 * @throws {Error} If `compressedFilePath` cannot be read, isn't a valid Gzip file, or the destination file cannot be written.
 *
 * @example
 * const decompressedPath = await decompressFile('./files/source.txt.gz', './files/source_decompressed.txt');
 * // => './files/source_decompressed.txt'
 */
async function decompressFile(compressedFilePath, destinationFilePath) {
  const outputFilePath = await generateUniqueFilePath(destinationFilePath);

  try {
    await pipeline(createReadStream(compressedFilePath), createGunzip(), createWriteStream(outputFilePath));
  } catch (error) {
    throw new Error(`Failed to decompress file "${compressedFilePath}": ${error.message}`);
  }

  return outputFilePath;
}

// ! Verify that the compression and decompression functions work correctly
// async function performCompressionAndDecompression() {
//   try {
//     const compressedResult = await compressFile('./files/source.txt')
//     console.log(compressedResult)
//     const decompressedResult = await decompressFile(compressedResult, './files/source_decompressed.txt')
//     console.log(decompressedResult)
//   } catch (error) {
//     console.error('Error during compression or decompression:', error)
//   }
// }
// performCompressionAndDecompression()

export { compressFile, decompressFile };
