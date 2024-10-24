import { PathValidationError, calculatePathBounds, validatePath } from '@/utils/pathUtils'

describe('validatePath', () => {
  it('should throw an error if path does not start with "@"', () => {
    const invalidPath = [['-', 'x']]
    expect(() => validatePath(invalidPath)).toThrow(PathValidationError)
    expect(() => validatePath(invalidPath)).toThrow("Path must start with '@'")
  })

  it('should throw an error if path does not end with "x"', () => {
    const invalidPath = [['@', '-'], ['+']]
    expect(() => validatePath(invalidPath)).toThrow(PathValidationError)
    expect(() => validatePath(invalidPath)).toThrow("Path must end with 'x'")
  })

  it('should throw an error for invalid characters in the path', () => {
    const invalidPath = [['@', '-', 'z', 'x']]
    expect(() => validatePath(invalidPath)).toThrow(PathValidationError)
    expect(() => validatePath(invalidPath)).toThrow('Invalid character: z')
  })

  it('should throw an error for unexpected "-" character', () => {
    const invalidPath = [
      ['@', '-', '-', '+'],
      ['|', 'A', '|', '-', 'x'],
    ]
    expect(() => validatePath(invalidPath)).toThrow(PathValidationError)
    expect(() => validatePath(invalidPath)).toThrow("Unexpected '-' at row 2, col 4")
  })

  it('should throw an error for unexpected "|" character', () => {
    const invalidPath = [
      ['@', '-', '|', '+'],
      ['|', '|', 'x'],
    ]
    expect(() => validatePath(invalidPath)).toThrow(PathValidationError)
    expect(() => validatePath(invalidPath)).toThrow("Unexpected '|' at row 1, col 3")
  })

  it('should throw an error for unexpected "+" character', () => {
    const invalidPath = [
      ['@', '-', '+', '+'],
      ['|', 'A', '|', 'x'],
    ]
    expect(() => validatePath(invalidPath)).toThrow(PathValidationError)
    expect(() => validatePath(invalidPath)).toThrow("Unexpected '+' at row 1, col 3")
  })

  it('should pass validation for valid path', () => {
    const validPath = [
      ['@', '-', 'A', '+'],
      ['|', 'B', '|', 'x'],
    ]
    expect(() => validatePath(validPath)).not.toThrow()
  })

  it('should throw an error if there is a @ character in the middle of the path', () => {
    const invalidPath = [
      ['@', '-', 'A', '+'],
      ['|', '@', '|', 'x'],
    ]
    expect(() => validatePath(invalidPath)).toThrow(PathValidationError)
    expect(() => validatePath(invalidPath)).toThrow("Unexpected '@' at row 2, col 2")
  })

  it('should throw an error if there is a x character right after the start', () => {
    const invalidPath = [['@', 'x']]
    expect(() => validatePath(invalidPath)).toThrow(PathValidationError)
    expect(() => validatePath(invalidPath)).toThrow('Path cannot end immediately after the start')
  })

  it('should throw an error if there is a character right after the end', () => {
    const invalidPath = [['@', '-', 'x', 'A']]
    expect(() => validatePath(invalidPath)).toThrow(PathValidationError)
    expect(() => validatePath(invalidPath)).toThrow("Path must end with 'x'")
  })
})

describe('calculatePathBounds', () => {
  it('should return correct bounds for a valid path', () => {
    const path = [
      ['@', '-', '-', '+'],
      ['|', 'x'],
    ]
    const bounds = calculatePathBounds(path)
    expect(bounds).toEqual({
      minX: 10,
      minY: 50,
      maxX: 100,
      maxY: 140,
    })
  })

  it('should return starting bounds for an empty path', () => {
    const path: string[][] = []
    const bounds = calculatePathBounds(path)
    expect(bounds).toEqual({
      minX: 10,
      minY: 50,
      maxX: 10,
      maxY: 50,
    })
  })

  it('should return correct bound if path moves in all directions', () => {
    const path = [
      ['@', '-', 'A', '+'],
      ['|', 'B', '|', '+'],
      ['-', 'C', '-', '+'],
      ['|', 'D', '|', '+'],
      ['-', 'E', 'x'],
    ]
    const bounds = calculatePathBounds(path)
    expect(bounds).toEqual({
      maxX: 100,
      maxY: 170,
      minX: -20,
      minY: 50,
    })
  })
})
