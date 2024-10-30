import { Direction, PathResult, PathSegment, Position } from '@/types/types'

/**
 * Custom error class for path validation failures during maze traversal
 */
class PathValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PathValidationError'
  }
}

/**
 * Implements a path finding algorithm for maze-like structures with the following rules:
 * - Must follow valid path characters (@, x, +, -, |, A-Z)
 * - Must start at '@' and end at 'x'
 * - Must collect letters along the valid path
 * - Cannot have multiple valid paths or forks
 * - Must handle intersections and turns properly
 */
class PathFinder {
  private map: string[][]
  private startPos: Position | null = null
  private visited = new Set<string>()
  private letters = ''
  private pathSegments: PathSegment[] = []
  private visitedLetters = new Set<string>()
  private path = ''

  // Define valid characters for the maze structure
  private readonly validChars = new Set([
    '@',
    'x',
    '+',
    '-',
    '|',
    ' ',
    '',
    ...Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
  ])

  // Define characters that can be part of the actual path
  private readonly validPathChars = new Set([
    '@',
    'x',
    '+',
    '-',
    '|',
    ...Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
  ])

  constructor(map: string[][]) {
    this.validateMapCharacters(map)
    this.map = map
    this.findStartAndEnd()
    this.validateStartAndEnd()
  }

  /**
   * Ensures all characters in the map are valid maze elements
   * Throws PathValidationError if invalid characters are found
   */
  private validateMapCharacters(map: string[][]): void {
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        if (!this.validChars.has(map[row][col])) {
          throw new PathValidationError(
            `Invalid character found at position ${row},${col}: ${map[row][col]}`,
          )
        }
      }
    }
  }

  /**
   * Locates start (@) and end (x) positions in the map
   * Validates that exactly one start and one end position exist
   * Throws PathValidationError if validation fails
   */
  private findStartAndEnd(): void {
    let startCount = 0,
      endCount = 0

    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++) {
        const char = this.map[row][col]
        if (char === '@') {
          startCount++
          this.startPos = { row, col, sign: '@' }
        } else if (char === 'x') {
          endCount++
        }
      }
    }

    // Validate start/end positions
    if (startCount === 0) throw new PathValidationError('No start position found')
    if (startCount > 1) throw new PathValidationError('Multiple start positions found')
    if (endCount === 0) throw new PathValidationError('No end position found')
    if (endCount > 1) throw new PathValidationError('Multiple end positions found')
  }

  /**
   * Validates that the start position has exactly one valid path leading from it
   * This prevents ambiguous starting paths in the maze
   * Throws PathValidationError if validation fails
   */
  private validateStartAndEnd(): void {
    let validDirections = 0
    const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT']

    // Count valid paths leading from start position
    for (const direction of directions) {
      if (!this.startPos) throw new PathValidationError('Invalid start position')
      const nextPos = this.getNext(this.startPos, direction)
      if (nextPos && this.isValidNextCharStrict(this.map[nextPos.row][nextPos.col], direction)) {
        validDirections++
      }
    }

    // Ensure exactly one valid starting path exists
    if (validDirections > 1) {
      throw new PathValidationError('Multiple starting paths found')
    }
    if (validDirections === 0) {
      throw new PathValidationError('No valid starting path found')
    }
  }

  /**
   * Calculates the next position based on current position and direction
   * Returns null if the next position would be outside the map boundaries
   */
  private getNextPosition(pos: Position, direction: Direction): Position | null {
    const newPos = {
      row: pos.row + (direction === 'DOWN' ? 1 : direction === 'UP' ? -1 : 0),
      col: pos.col + (direction === 'RIGHT' ? 1 : direction === 'LEFT' ? -1 : 0),
      sign: direction === 'DOWN' || direction === 'UP' ? ('|' as const) : ('-' as const),
    }

    const char = this.map[pos.row][pos.col]

    if ((direction === 'DOWN' || direction === 'UP') && char === '-') {
      const isItAtIntersection = this.isCharAtIntersection(pos)

      if (!isItAtIntersection) {
        throw new PathValidationError('Horizontal character in vertical path')
      }
    }
    if ((direction === 'RIGHT' || direction === 'LEFT') && char === '|') {
      const isItAtIntersection = this.isCharAtIntersection(pos)

      if (char === '|' && !isItAtIntersection) {
        throw new PathValidationError('Vertical character in horizontal path')
      }
    }

    return this.isValidPosition(newPos) ? newPos : null
  }

  /**
   * Checks if a position is within map boundaries and contains a valid path character
   */
  private isValidPosition(pos: Position): boolean {
    return (
      pos.row >= 0 &&
      pos.row < this.map.length &&
      pos.col >= 0 &&
      pos.col < this.map[pos.row].length &&
      this.validPathChars.has(this.map[pos.row][pos.col])
    )
  }

  /**
   * Strict validation for next character in path
   * Ensures proper path continuity and prevents invalid transitions
   * Used primarily for initial path validation
   */
  private isValidNextCharStrict(char: string, direction: Direction): boolean {
    if (char === ' ' || char === '') return false
    if (char === 'x' || /[A-Z]/.test(char)) return true

    // Validate vertical movement
    if ((direction === 'UP' || direction === 'DOWN') && (char === '|' || char === '+')) {
      return true
    }

    // Validate horizontal movement
    if ((direction === 'LEFT' || direction === 'RIGHT') && (char === '-' || char === '+')) {
      return true
    }

    return false
  }

  private getNext(pos: Position, direction: Direction): Position | null {
    const newPos = {
      row: pos.row + (direction === 'DOWN' ? 1 : direction === 'UP' ? -1 : 0),
      col: pos.col + (direction === 'RIGHT' ? 1 : direction === 'LEFT' ? -1 : 0),
      sign: direction === 'DOWN' || direction === 'UP' ? ('|' as const) : ('-' as const),
    }

    return this.isValidPosition(newPos) ? newPos : null
  }

  /**
   * Determines if a letter is at an intersection of vertical and horizontal paths
   * Letters at intersections have special handling rules for path traversal
   */
  private isCharAtIntersection(pos: Position): boolean {
    let horizontalConnections = 0
    let verticalConnections = 0

    // Check horizontal connections
    const horizontalDirs: Direction[] = ['LEFT', 'RIGHT']
    for (const dir of horizontalDirs) {
      const nextPos = this.getNext(pos, dir)
      if (nextPos && this.isValidNextCharRelaxed(this.map[nextPos.row][nextPos.col], dir)) {
        horizontalConnections++
      }
    }

    // Check vertical connections
    const verticalDirs: Direction[] = ['UP', 'DOWN']
    for (const dir of verticalDirs) {
      const nextPos = this.getNext(pos, dir)
      if (nextPos && this.isValidNextCharRelaxed(this.map[nextPos.row][nextPos.col], dir)) {
        verticalConnections++
      }
    }

    return horizontalConnections > 1 && verticalConnections > 1
  }

  /**
   * Determines if a letter is at an intersection of vertical and horizontal paths
   * Letters at intersections have special handling rules for path traversal
   */
  private isLetterAtIntersection(pos: Position): boolean {
    if (!/[A-Z]/.test(this.map[pos.row][pos.col])) return false

    let horizontalConnections = 0
    let verticalConnections = 0

    // Check horizontal connections
    const horizontalDirs: Direction[] = ['LEFT', 'RIGHT']
    for (const dir of horizontalDirs) {
      const nextPos = this.getNext(pos, dir)
      if (nextPos && this.isValidNextCharRelaxed(this.map[nextPos.row][nextPos.col], dir)) {
        horizontalConnections++
      }
    }

    // Check vertical connections
    const verticalDirs: Direction[] = ['UP', 'DOWN']
    for (const dir of verticalDirs) {
      const nextPos = this.getNext(pos, dir)
      if (nextPos && this.isValidNextCharRelaxed(this.map[nextPos.row][nextPos.col], dir)) {
        verticalConnections++
      }
    }

    return horizontalConnections > 1 && verticalConnections > 1
  }

  /**
   * Relaxed validation for next character in path
   * Allows for more flexible path transitions during traversal
   * Used during path finding after initial validation
   */
  private isValidNextCharRelaxed(char: string, direction: Direction): boolean {
    if (char === ' ') return false
    if (char === '') return false
    if (char === 'x' || /[A-Z]/.test(char)) return true

    // Allow both vertical and horizontal path elements for any direction
    if (
      (direction === 'UP' || direction === 'DOWN') &&
      (char === '|' || char === '+' || char === '-')
    ) {
      return true
    }

    if (
      (direction === 'LEFT' || direction === 'RIGHT') &&
      (char === '-' || char === '+' || char === '|')
    ) {
      return true
    }

    return false
  }

  /**
   * Checks if a position represents a forked path
   * A fork occurs when there are multiple valid paths in the same direction
   * Returns true if a fork is detected, which is considered invalid
   */
  private isCornerForked(currentPos: Position): boolean {
    let horizontalConnections = 0
    let verticalConnections = 0

    // Check horizontal connections
    const horizontalDirs: Direction[] = ['LEFT', 'RIGHT']
    for (const dir of horizontalDirs) {
      const nextPos = this.getNext(currentPos, dir)
      const nextChar = nextPos ? this.map[nextPos.row][nextPos.col] : ''
      if (nextPos && nextChar && nextChar !== '|' && this.isValidNextCharRelaxed(nextChar, dir)) {
        horizontalConnections++
      }
    }

    // Check vertical connections
    const verticalDirs: Direction[] = ['UP', 'DOWN']
    for (const dir of verticalDirs) {
      const nextPos = this.getNext(currentPos, dir)
      const nextChar = nextPos ? this.map[nextPos.row][nextPos.col] : ''
      if (nextPos && nextChar && nextChar !== '-' && this.isValidNextCharRelaxed(nextChar, dir)) {
        verticalConnections++
      }
    }

    return horizontalConnections > 1 || verticalConnections > 1
  }

  /**
   * Recursive Depth-First Search implementation for finding valid path
   * Handles special cases for intersections, letters, and turns
   * Returns true if a valid path to the end is found
   */
  private findPathDFS(currentPos: Position, direction: Direction): boolean {
    const char = this.map[currentPos.row][currentPos.col]
    this.path += char

    // Record current path segment
    this.pathSegments.push({
      char,
      direction,
      position: { ...currentPos },
      skipDraw:
        /[A-Z]/.test(char) && this.visitedLetters.has(`${currentPos.row},${currentPos.col}`)
          ? true
          : undefined,
    })

    const posKey = `${currentPos.row},${currentPos.col}`

    // Check for end position
    if (char === 'x') return true

    // Handle unvisited letters
    if (/[A-Z]/.test(char) && !this.visitedLetters.has(posKey)) {
      this.letters += char
      this.visitedLetters.add(posKey)
    }

    /*
    // Special handling for letters at intersections
    if (/[A-Z]/.test(char) && this.isLetterAtIntersection(currentPos)) {
      const nextPos = this.getNext(currentPos, direction)
      if (nextPos) {
        if (this.isValidNextCharRelaxed(this.map[nextPos.row][nextPos.col], direction)) {
          this.visited.add(posKey)
          if (this.findPathDFS(nextPos, direction)) return true
          this.visited.delete(posKey)
        }
      } else {
        throw new PathValidationError('Invalid continuation from intersection letter')
      }
      return false
    }

    */

    // Handle turns at junctions or edge letters
    if (char === '+') {
      if (this.isCornerForked(currentPos)) {
        throw new PathValidationError('Corner forked')
      }

      const turnDirections: Direction[] =
        direction === 'LEFT' || direction === 'RIGHT' ? ['UP', 'DOWN'] : ['LEFT', 'RIGHT']

      let directionFound = false

      for (const newDirection of turnDirections) {
        const turnPos = this.getNextPosition(currentPos, newDirection)
        const turnPosKey = turnPos ? `${turnPos.row},${turnPos.col}` : ''

        if (
          turnPos &&
          !this.visited.has(turnPosKey) &&
          this.validateTurn(currentPos, turnPos, newDirection)
        ) {
          directionFound = true
          this.visited.add(turnPosKey)
        }

        if (turnPos && this.findPathDFS(turnPos, newDirection)) return true
        this.visited.delete(turnPosKey)
      }

      if (!directionFound) {
        throw new PathValidationError(
          'No valid turn found at: ' + currentPos.row + ',' + currentPos.col,
        )
      }
    }

    // Try continuing in current direction
    const nextPos = this.getNextPosition(currentPos, direction)

    if (nextPos && this.isValidNextCharRelaxed(this.map[nextPos.row][nextPos.col], direction)) {
      const nextPosKey = `${nextPos.row},${nextPos.col}`

      if (!this.visited.has(nextPosKey)) {
        this.visited.add(nextPosKey)
      }
      if (this.findPathDFS(nextPos, direction)) return true
      this.visited.delete(nextPosKey)
    }

    if (/[A-Z]/.test(char) && !this.isLetterAtIntersection(currentPos)) {
      if (this.isCornerForked(currentPos)) {
        throw new PathValidationError('Corner forked')
      }

      const turnDirections: Direction[] =
        direction === 'LEFT' || direction === 'RIGHT' ? ['UP', 'DOWN'] : ['LEFT', 'RIGHT']

      for (const newDirection of turnDirections) {
        const turnPos = this.getNext(currentPos, newDirection)
        const turnPosKey = turnPos ? `${turnPos.row},${turnPos.col}` : ''

        if (
          turnPos &&
          !this.visited.has(turnPosKey) &&
          this.validateTurn(currentPos, turnPos, newDirection)
        ) {
          this.visited.add(turnPosKey)
        }

        if (turnPos && this.findPathDFS(turnPos, newDirection)) return true
        this.visited.delete(turnPosKey)
      }
    }

    // Backtrack if no valid path found
    this.path = this.path.slice(0, -1)
    this.pathSegments.pop()
    return false
  }

  /**
   * Validates if a turn is legal at the current position
   * Handles special cases for intersections, junctions, and path continuity
   */
  private validateTurn(currentPos: Position, nextPos: Position, direction: Direction): boolean {
    const currentChar = this.map[currentPos.row][currentPos.col]
    const nextChar = this.map[nextPos.row][nextPos.col]

    // Handle turns at junctions or edge letters
    if (/[A-Z+]/.test(currentChar)) {
      return this.isValidNextCharRelaxed(nextChar, direction)
    }

    // Validate path continuity after turn
    const afterPos = this.getNextPosition(nextPos, direction)
    if (!afterPos) return false

    const afterChar = this.map[afterPos.row][afterPos.col]
    return (
      this.isValidNextCharRelaxed(nextChar, direction) &&
      (/[A-Z+]/.test(nextChar) || this.isValidNextCharRelaxed(afterChar, direction))
    )
  }

  /**
   * Public method to find a valid path through the maze
   * Attempts to find path starting in each cardinal direction
   * Returns PathResult containing collected letters and path segments
   * Throws PathValidationError if no valid path is found
   */
  public findPath(): PathResult {
    const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT']

    for (const direction of directions) {
      if (!this.startPos) throw new PathValidationError('Invalid start position')
      const nextPos = this.getNext(this.startPos, direction)
      if (nextPos && this.isValidNextCharRelaxed(this.map[nextPos.row][nextPos.col], direction)) {
        this.visited.clear()
        this.letters = ''
        this.path = ''
        this.pathSegments = []
        this.visitedLetters.clear()

        const startPosKey = `${this.startPos.row},${this.startPos.col}`
        this.visited.add(startPosKey)

        if (this.findPathDFS(this.startPos, direction)) {
          return {
            letters: this.letters,
            pathSegments: this.pathSegments,
          }
        }
      }
    }

    throw new PathValidationError('No valid path found between start and end positions')
  }
}

export { PathFinder, PathValidationError }
