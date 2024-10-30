import { describe, expect, it } from 'vitest'

import { PathSegment } from '@/types/types'
import { calculateBoundsFromSegments } from '@/utils/pathUtils'

// Mock cell size for consistent test results
const cellSize = 40

// Sample data
const createSegment = (direction: 'RIGHT' | 'LEFT' | 'UP' | 'DOWN', char = 'A'): PathSegment => ({
  char,
  direction,
  position: { row: 0, col: 0, sign: '-' },
})

describe('calculateBoundsFromSegments', () => {
  it('should return initial bounds when no segments are provided', () => {
    const result = calculateBoundsFromSegments([])
    expect(result).toEqual({ minX: 0, minY: 0, maxX: 0, maxY: 0 })
  })

  it('should calculate bounds for a single rightward movement', () => {
    const segments = [createSegment('RIGHT')]
    const result = calculateBoundsFromSegments(segments)
    expect(result).toEqual({ minX: 0, minY: 0, maxX: cellSize, maxY: 0 })
  })

  it('should calculate bounds for a single leftward movement', () => {
    const segments = [createSegment('LEFT')]
    const result = calculateBoundsFromSegments(segments)
    expect(result).toEqual({ minX: -cellSize, minY: 0, maxX: 0, maxY: 0 })
  })

  it('should calculate bounds for a single upward movement', () => {
    const segments = [createSegment('UP')]
    const result = calculateBoundsFromSegments(segments)
    expect(result).toEqual({ minX: 0, minY: -cellSize, maxX: 0, maxY: 0 })
  })

  it('should calculate bounds for a single downward movement', () => {
    const segments = [createSegment('DOWN')]
    const result = calculateBoundsFromSegments(segments)
    expect(result).toEqual({ minX: 0, minY: 0, maxX: 0, maxY: cellSize })
  })

  it('should calculate bounds for multiple movements in all directions', () => {
    const segments = [
      createSegment('RIGHT'),
      createSegment('DOWN'),
      createSegment('LEFT'),
      createSegment('UP'),
    ]
    const result = calculateBoundsFromSegments(segments)
    expect(result).toEqual({ minX: 0, minY: 0, maxX: cellSize, maxY: cellSize })
  })

  it('should calculate correct bounds for a complex path', () => {
    const segments = [
      createSegment('RIGHT'),
      createSegment('RIGHT'),
      createSegment('DOWN'),
      createSegment('DOWN'),
      createSegment('LEFT'),
      createSegment('LEFT'),
      createSegment('UP'),
      createSegment('UP'),
    ]
    const result = calculateBoundsFromSegments(segments)
    expect(result).toEqual({
      minX: 0,
      minY: 0,
      maxX: 2 * cellSize,
      maxY: 2 * cellSize,
    })
  })

  it('should handle path segments with zero distance correctly', () => {
    const segments = [createSegment('RIGHT'), createSegment('LEFT')]
    const result = calculateBoundsFromSegments(segments)
    expect(result).toEqual({ minX: 0, minY: 0, maxX: cellSize, maxY: 0 })
  })
})
