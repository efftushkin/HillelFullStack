const { ageClassification, weekFn } = require('/main.js')

describe('ageClassification', () => {
  describe('should return null for invalid ages', () => {
    test('should return null for negative age', () => {
      expect(ageClassification(-1)).toBe(null)
    })

    test('should return null for age above 122', () => {
      expect(ageClassification(122.01)).toBe(null)
      expect(ageClassification(150)).toBe(null)
    })
  })

  describe('should return "Дитинство" for ages 0-24', () => {
    test('should return "Дитинство" for age 0', () => {
      expect(ageClassification(0)).toBe('Дитинство')
    })

    test('should return "Дитинство" for age 1', () => {
      expect(ageClassification(1)).toBe('Дитинство')
    })

    test('should return "Дитинство" for age 24', () => {
      expect(ageClassification(24)).toBe('Дитинство')
    })
  })

  describe('should return "Молодість" for ages 24.01-44', () => {
    test('should return "Молодість" for age 24.01', () => {
      expect(ageClassification(24.01)).toBe('Молодість')
    })

    test('should return "Молодість" for age 44', () => {
      expect(ageClassification(44)).toBe('Молодість')
    })
  })

  describe('should return "Зрілість" for ages 44.01-65', () => {
    test('should return "Зрілість" for age 44.01', () => {
      expect(ageClassification(44.01)).toBe('Зрілість')
    })

    test('should return "Зрілість" for age 65', () => {
      expect(ageClassification(65)).toBe('Зрілість')
    })
  })

  describe('should return "Старість" for ages 65.1-75', () => {
    test('should return "Старість" for age 65.1', () => {
      expect(ageClassification(65.1)).toBe('Старість')
    })

    test('should return "Старість" for age 75', () => {
      expect(ageClassification(75)).toBe('Старість')
    })
  })

  describe('should return "Довголіття" for ages 75.01-90', () => {
    test('should return "Довголіття" for age 75.01', () => {
      expect(ageClassification(75.01)).toBe('Довголіття')
    })

    test('should return "Довголіття" for age 90', () => {
      expect(ageClassification(90)).toBe('Довголіття')
    })
  })

  describe('should return "Рекорд" for ages 90.01-122', () => {
    test('should return "Рекорд" for age 90.01', () => {
      expect(ageClassification(90.01)).toBe('Рекорд')
    })

    test('should return "Рекорд" for age 122', () => {
      expect(ageClassification(122)).toBe('Рекорд')
    })
  })
})

describe('weekFn', () => {
  describe('should return correct day names for valid inputs', () => {
    test('should return "Понеділок" for 1', () => {
      expect(weekFn(1)).toBe('Понеділок')
    })

    test('should return "Вівторок" for 2', () => {
      expect(weekFn(2)).toBe('Вівторок')
    })

    test('should return "Середа" for 3', () => {
      expect(weekFn(3)).toBe('Середа')
    })

    test('should return "Четвер" for 4', () => {
      expect(weekFn(4)).toBe('Четвер')
    })

    test('should return "П\'ятниця" for 5', () => {
      expect(weekFn(5)).toBe('П\'ятниця')
    })

    test('should return "Субота" for 6', () => {
      expect(weekFn(6)).toBe('Субота')
    })

    test('should return "Неділя" for 7', () => {
      expect(weekFn(7)).toBe('Неділя')
    })
  })

  describe('should return null for invalid inputs', () => {
    test('should return null for number outside range', () => {
      expect(weekFn(9)).toBe(null)
      expect(weekFn(0)).toBe(null)
      expect(weekFn(-1)).toBe(null)
    })

    test('should return null for decimal number', () => {
      expect(weekFn(1.5)).toBe(null)
    })

    test('should return null for string', () => {
      expect(weekFn('2')).toBe(null)
    })

    test('should return null for other invalid types', () => {
      expect(weekFn(null)).toBe(null)
      expect(weekFn(undefined)).toBe(null)
      expect(weekFn({})).toBe(null)
      expect(weekFn([])).toBe(null)
    })
  })
})

