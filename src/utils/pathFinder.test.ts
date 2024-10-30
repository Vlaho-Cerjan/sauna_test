// __tests__/pathFinder.test.ts
import { describe, expect, it } from 'vitest'

import { PathFinder, PathValidationError } from '@/utils/pathFinder'

describe('PathFinder', () => {
  describe('Validation', () => {
    it('should throw error for invalid characters', () => {
      const invalidMap = [['@', 'x', '!']]
      expect(() => new PathFinder(invalidMap)).toThrowError(PathValidationError)
    })

    it('should throw error for multiple start positions', () => {
      const multipleStartMap = [['@', ' ', '@', 'x']]
      expect(() => new PathFinder(multipleStartMap)).toThrowError(PathValidationError)
    })

    it('should throw error for multiple end positions', () => {
      const multipleEndMap = [['@', ' ', 'x', 'x']]
      expect(() => new PathFinder(multipleEndMap)).toThrowError(PathValidationError)
    })

    it('should throw error for no start position', () => {
      const noStartMap = [['x']]
      expect(() => new PathFinder(noStartMap)).toThrowError(PathValidationError)
    })

    it('should throw error for no end position', () => {
      const noEndMap = [['@']]
      expect(() => new PathFinder(noEndMap)).toThrowError(PathValidationError)
    })

    it('should throw error for multiple starting paths', () => {
      const multipleStartPathsMap = [['@', '@', '+', 'x']]
      expect(() => new PathFinder(multipleStartPathsMap)).toThrowError(PathValidationError)
    })

    it('should throw error for multiple ending paths', () => {
      const multipleEndPathsMap = [['@', '+', 'x', 'x']]
      expect(() => new PathFinder(multipleEndPathsMap)).toThrowError(PathValidationError)
    })

    it('should throw an error for multiple starting paths', () => {
      const multipleStartPathsMap = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', '+', '-', 'L', '-', '+', ' ', ' '],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', '+', 'A', '|', 'x'],
        [' ', 'A', '-', '@', 'B', '+', ' ', '+', '+', ' ', 'H'],
        [' ', ' ', ' ', ' ', '+', '+', ' ', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'D'],
      ]

      expect(() => new PathFinder(multipleStartPathsMap)).toThrowError(PathValidationError)
    })

    it('should throw an error for missing chars after starting path', () => {
      const multipleStartPathsMap = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', '+', '-', 'L', '-', '+', ' ', ' '],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', '+', 'A', '|', 'x'],
        [' ', ' ', ' ', '@', ' ', '+', ' ', '+', '+', ' ', 'H'],
        [' ', ' ', ' ', ' ', '+', '+', ' ', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'D'],
      ]

      expect(() => new PathFinder(multipleStartPathsMap)).toThrowError(PathValidationError)
    })
  })

  describe('Path Finding', () => {
    it('should find a valid path', () => {
      const validMap = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', '+', '-', 'L', '-', '+', ' ', ' '],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', '+', 'A', '-', '+'],
        [' ', ' ', ' ', '@', 'B', '+', ' ', '+', '+', ' ', 'H'],
        [' ', ' ', ' ', ' ', '+', '+', ' ', ' ', ' ', ' ', 'x'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'D'],
      ]

      const pathFinder = new PathFinder(validMap)
      const { letters, pathSegments } = pathFinder.findPath()
      expect(letters).toBe('BLAH')
      expect(pathSegments).toHaveLength(21)
    })

    it('should throw an error when missing chars in path', () => {
      const invalidMap = [['@', '-', ' ', 'x']]
      const pathFinder = new PathFinder(invalidMap)
      expect(() => pathFinder.findPath()).toThrowError(PathValidationError)
    })

    it('should throw error for invalid path', () => {
      const invalidMap = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', '+', '-', 'L', '-', '+', ' ', ' '],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', '+', 'A', '|', 'x'],
        [' ', ' ', ' ', '@', 'B', '+', ' ', '+', '+', ' ', 'H'],
        [' ', ' ', ' ', ' ', '+', '+', ' ', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'D'],
      ]

      const pathFinder = new PathFinder(invalidMap)
      expect(() => pathFinder.findPath()).toThrowError(PathValidationError)
    })

    it('should throw an error for forked paths', () => {
      const forkedMap = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['+', 'E', '-', 'H', ' ', 'R', 'L'],
        ['L', ' ', ' ', '|', ' ', 'O', 'D'],
        ['L', ' ', ' ', '@', ' ', 'W', 'x'],
        ['+', '-', 'O', '-', '-', '+', ''],
        ['|', ' ', ' ', ' ', ' ', ' ', ' '],
        ['+', 'H', ' ', ' ', ' ', ' ', ' '],
      ]

      const pathFinder = new PathFinder(forkedMap)
      expect(() => pathFinder.findPath()).toThrowError(PathValidationError)
    })

    it('should throw an error for forked paths with letters', () => {
      const forkedMap = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', '+', '-', 'L', '-', '+', ' ', ' '],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', '+', 'A', '|', 'x'],
        [' ', ' ', ' ', '@', 'B', ' ', ' ', '+', '+', ' ', 'H'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', 'C', ' ', ' ', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'D'],
      ]

      const pathFinder = new PathFinder(forkedMap)
      expect(() => pathFinder.findPath()).toThrowError(PathValidationError)
    })

    it('should throw an error when there is a horizontal sign in vertical path', () => {
      const invalidMap = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', '+', 'C', '-', '-', '+', ' ', ' ', ' '],
        [' ', ' ', ' ', '-', ' ', ' ', ' ', '|', ' ', ' ', ' '],
        [' ', '@', 'A', 'B', '+', ' ', '+', 'D', '-', '+', ' '],
        [' ', ' ', ' ', '|', '|', ' ', '|', '|', ' ', '|', ' '],
        [' ', ' ', ' ', '+', '+', ' ', '+', '+', ' ', 'E', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' '],
      ]

      const pathFinder = new PathFinder(invalidMap)
      expect(() => pathFinder.findPath()).toThrowError(PathValidationError)
    })

    it('should throw an error when a corner doesnt have a turn', async () => {
      const invalidMap = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', '+', 'C', '-', '-', '+', ' ', ' ', ' '],
        [' ', ' ', ' ', '|', ' ', ' ', ' ', '+', ' ', ' ', ' '],
        [' ', '@', 'A', 'B', '+', ' ', '+', 'D', '-', '+', ' '],
        [' ', ' ', ' ', '|', '|', ' ', '|', '|', ' ', '+', ' '],
        [' ', ' ', ' ', '+', '+', ' ', '+', '+', ' ', 'E', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' '],
      ]

      const pathFinder = new PathFinder(invalidMap)
      expect(() => pathFinder.findPath()).toThrowError(PathValidationError)
    })

    it('should handle intersections with letters', () => {
      const intersectionMap = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', '+', 'C', '-', '-', '+', ' ', ' ', ' '],
        [' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' '],
        [' ', '@', 'A', 'B', '+', ' ', '+', 'D', '-', '+', ' '],
        [' ', ' ', ' ', '|', '|', ' ', '|', '|', ' ', '|', ' '],
        [' ', ' ', ' ', '+', '+', ' ', '+', '+', ' ', 'E', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' '],
      ]

      const pathFinder = new PathFinder(intersectionMap)
      const { letters, pathSegments } = pathFinder.findPath()
      expect(letters).toBe('ABCDE')
      expect(pathSegments).toHaveLength(28)
    })

    it('should handle turns at junctions', () => {
      const junctionMap = [
        [' ', '@', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', '|', ' ', '+', 'C', '-', '-', '+', ' '],
        [' ', 'A', ' ', '|', ' ', ' ', ' ', '|', ' '],
        [' ', '+', '-', '-', '-', 'B', '-', '+', ' '],
        [' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', 'x'],
        [' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', '+', '-', '-', 'D', '-', '+'],
      ]

      const pathFinder = new PathFinder(junctionMap)
      const { letters, pathSegments } = pathFinder.findPath()
      expect(letters).toBe('ABCD')
      expect(pathSegments).toHaveLength(28)
    })

    it('should handle complex maps', () => {
      const complexMap = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['+', 'E', '-', 'H', ' ', 'R', 'L'],
        ['L', ' ', ' ', '|', ' ', 'O', 'D'],
        ['L', ' ', ' ', '@', ' ', 'W', 'x'],
        ['+', '-', 'O', '-', '-', '+', ''],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ]

      const pathFinder = new PathFinder(complexMap)
      const { letters, pathSegments } = pathFinder.findPath()
      expect(letters).toBe('HELLOWORLD')
      expect(pathSegments).toHaveLength(20)
    })
  })
})
