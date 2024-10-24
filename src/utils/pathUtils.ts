import { cellSize } from '@/constants/constants'
import { Bounds, Direction } from '@/types/types'

class PathValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PathValidationError'
  }
}

const validatePath = (path: string[][]): void => {
  const states = ['start', 'horizontal', 'vertical', 'corner', 'end'] as const
  type State = (typeof states)[number] // Define a type from the array

  const currentState: {
    state: State
  } = {
    state: 'start',
  }

  const validStart = path[0][0] === '@'
  if (!validStart) {
    throw new PathValidationError("Path must start with '@'")
  }
  const validEnd = path[path.length - 1][path[path.length - 1].length - 1] === 'x'
  if (!validEnd) {
    throw new PathValidationError("Path must end with 'x'")
  }

  path.forEach((row, rowIndex) => {
    row.forEach((char, colIndex) => {
      switch (char) {
        case '@': {
          if (currentState.state !== 'start') {
            throw new PathValidationError(
              `Unexpected '@' at row ${rowIndex + 1}, col ${colIndex + 1}`,
            )
          }
          currentState.state = 'horizontal'
          break
        }

        case '-': {
          if (currentState.state !== 'horizontal' && currentState.state !== 'corner') {
            throw new PathValidationError(
              `Unexpected '-' at row ${rowIndex + 1}, col ${colIndex + 1}`,
            )
          }
          currentState.state = 'horizontal'
          break
        }

        case '|': {
          if (currentState.state !== 'vertical' && currentState.state !== 'corner') {
            throw new PathValidationError(
              `Unexpected '|' at row ${rowIndex + 1}, col ${colIndex + 1}`,
            )
          }
          currentState.state = 'vertical'
          break
        }

        case '+': {
          if (colIndex !== row.length - 1) {
            throw new PathValidationError(
              `Unexpected '+' at row ${rowIndex + 1}, col ${colIndex + 1}`,
            )
          }
          /*if (currentState.state !== 'horizontal' && currentState.state !== 'vertical') {
            throw new PathValidationError(
              `Unexpected '+' at row ${rowIndex + 1}, col ${colIndex + 1}`,
            )
          }
          */
          currentState.state = 'corner' // Moving to corner state
          break
        }

        case 'x': {
          if (currentState.state === 'start' || (rowIndex === 0 && colIndex === 1)) {
            throw new PathValidationError(
              `Path cannot end immediately after the start at row ${rowIndex + 1}, col ${colIndex + 1}`,
            )
          }
          currentState.state = 'end' // Moving to end state
          break
        }

        default: {
          // Uppercase letters (A-Z) are allowed as part of the path
          if (!/[A-Z]/.test(char)) {
            throw new PathValidationError(
              `Invalid character: ${char} at row ${rowIndex + 1}, col ${colIndex + 1}`,
            )
          }

          // Letters are valid in any of the path states (horizontal, vertical, or corner)
          break
        }
      }
    })
  })
}

const calculatePathBounds = (path: string[][]) => {
  let [x, y] = [10, 50] // Starting point
  let direction: Direction = 'right' // Initial direction is right

  const bounds: Bounds = { minX: x, minY: y, maxX: x, maxY: y }

  path.forEach((row) => {
    row.forEach((char) => {
      switch (char) {
        case '-': // Horizontal path
          if (direction === 'right') {
            x += cellSize // Move right
          } else if (direction === 'left') {
            x -= cellSize // Move left
          }
          break

        case '|': // Vertical path
          if (direction === 'down') {
            y += cellSize // Move down
          } else if (direction === 'up') {
            y -= cellSize // Move up
          }
          break

        case '+': // Corner, change direction
          if (direction === 'right') {
            direction = 'down' // Turn down
            y += cellSize
          } else if (direction === 'down') {
            direction = 'left' // Turn left
            x -= cellSize
          } else if (direction === 'left') {
            direction = 'up' // Turn up
            y -= cellSize
          } else if (direction === 'up') {
            direction = 'right' // Turn right
            x += cellSize
          }
          break

        case '@': // Starting point, treat it like a horizontal move
        case 'x': // Ending point, treat it like a path segment
        default:
          if (direction === 'right') x += cellSize
          else if (direction === 'left') x -= cellSize
          else if (direction === 'down') y += cellSize
          else if (direction === 'up') y -= cellSize
          break
      }

      // Update bounds based on new position
      bounds.minX = Math.min(bounds.minX, x)
      bounds.minY = Math.min(bounds.minY, y)
      bounds.maxX = Math.max(bounds.maxX, x)
      bounds.maxY = Math.max(bounds.maxY, y)
    })
  })

  return bounds
}

export { calculatePathBounds, PathValidationError, validatePath }
