// Практика роботи з Mongo Shell - базові операції з документами, агрегація та індекси.
// Виконується на кластері MongoDB Atlas у базі даних ("studentDB")
//
// Запуск через mongosh (https://www.mongodb.com/docs/mongodb-shell/):
//   mongosh "<connection string from .env MONGODB_URI>" --file studentDB.assignments.mongosh.js
//
// Кожна команда нижче - справжня команда Mongo Shell; виклики print()/printjson() виводять
// результат кожної команди на екран, оскільки скрипт виконується не в інтерактивному режимі
// (звичайний вираз верхнього рівня друкується автоматично лише в інтерактивному REPL, а не при
// запуску через --file).

// ---------------------------------------------------------------------------------------------
// Завдання 1: базові операції з документами
// ---------------------------------------------------------------------------------------------

// 1. Створюємо нову базу даних - "use" перемикає поточну базу даних шелла; MongoDB насправді
// створює її лише при першому записі (виклик createCollection одразу нижче).
use('studentDB');

// Видаляємо колекцію "assignments", що могла лишитися від попереднього запуску, щоб цей скрипт
// можна було запускати повторно з чистого стану (інакше insertMany нижче впреться в унікальний
// індекс на "name", створений у Завданні 3, і впаде з помилкою дублікату ключа при повторному запуску).
db.assignments.drop();

// 2. Явно створюємо колекцію "assignments".
db.createCollection('assignments');

// 3. Додаємо п'ять документів студентів: name, subject, score (максимум 100).
print('\n--- insertMany: 5 student documents ---');
printjson(
  db.assignments.insertMany([
    { name: 'Олена Коваленко', subject: 'Математика', score: 92 },
    { name: 'Андрій Шевченко', subject: 'Фізика', score: 78 },
    { name: 'Марія Бондаренко', subject: 'Історія', score: 55 },
    { name: 'Іван Петренко', subject: 'Математика', score: 88 },
    { name: 'Оксана Мельник', subject: 'Фізика', score: 60 },
  ])
);

// 4. Знаходимо всі документи, де score більше 80.
print('\n--- find({ score: { $gt: 80 } }) ---');
db.assignments.find({ score: { $gt: 80 } }).forEach((doc) => printjson(doc));

// 5. Оновлюємо один документ, додаючи 5 балів студенту, у якого зараз менше 85.
// Фільтр перевіряє лише score: updateOne() у будь-якому разі торкається
// лише першого знайденого документа, тож саме MongoDB обирає, якому студенту дістанеться оновлення.
print('\n--- updateOne: +5 score for a student with score < 85 ---');
printjson(db.assignments.updateOne({ score: { $lt: 85 } }, { $inc: { score: 5 } }));

// 6. Видаляємо документ студента з найнижчим балом.
print('\n--- lowest-scoring student (about to be deleted) ---');
const lowest = db.assignments.find().sort({ score: 1 }).limit(1).next();
printjson(lowest);
print('--- deleteOne({ _id: lowest._id }) ---');
printjson(db.assignments.deleteOne({ _id: lowest._id }));

// 7. find() з проекцією - лише ім'я та бал студента.
print('\n--- find({}, { name: 1, score: 1, _id: 0 }) ---');
db.assignments.find({}, { name: 1, score: 1, _id: 0 }).forEach((doc) => printjson(doc));

// ---------------------------------------------------------------------------------------------
// Завдання 2: агрегація
// ---------------------------------------------------------------------------------------------

// Групуємо документи, що залишились, за предметом і рахуємо середній бал по кожному предмету.
print('\n--- aggregate: average score by subject ---');
db.assignments
  .aggregate([
    { $group: { _id: '$subject', avgScore: { $avg: '$score' } } },
    { $sort: { _id: 1 } },
  ])
  .forEach((doc) => printjson(doc));

// Той самий пайплайн, з додатковим етапом $match, що залишає лише предмети із середнім балом вище 75.
print('\n--- aggregate: same pipeline + $match avgScore > 75 ---');
db.assignments
  .aggregate([
    { $group: { _id: '$subject', avgScore: { $avg: '$score' } } },
    { $match: { avgScore: { $gt: 75 } } },
    { $sort: { _id: 1 } },
  ])
  .forEach((doc) => printjson(doc));

// ---------------------------------------------------------------------------------------------
// Завдання 3: індекси
// ---------------------------------------------------------------------------------------------

// Базовий вимір: виконуємо пошук за префіксом і дивимось план запиту ДО того, як з'явився індекс на "name".
print('\n--- explain("executionStats") BEFORE the index on "name" ---');
printjson(db.assignments.find({ name: { $regex: '^А' } }).explain('executionStats'));

// Створюємо унікальний індекс на "name" - це також не дає двом студентам мати однакове ім'я.
print('\n--- createIndex({ name: 1 }, { unique: true }) ---');
printjson(db.assignments.createIndex({ name: 1 }, { unique: true }));

// Той самий пошуковий запит, який і мав прискорити індекс: студенти, чиє ім'я починається на "А".
print('\n--- find({ name: { $regex: "^А" } }) ---');
db.assignments.find({ name: { $regex: '^А' } }).forEach((doc) => printjson(doc));

// Той самий запит, тепер із індексом - порівняйте winningPlan.stage (COLLSCAN -> IXSCAN) та
// executionStats.executionTimeMillis / totalDocsExamined із explain() "ДО" вище.
print('\n--- explain("executionStats") AFTER the index on "name" ---');
printjson(db.assignments.find({ name: { $regex: '^А' } }).explain('executionStats'));
