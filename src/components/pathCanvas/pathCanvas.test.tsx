// PathCanvas.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import PathCanvas from '@/components/pathCanvas/pathCanvas'
import { Bounds } from '@/types/types'

// Mocking the CanvasRenderingContext2D globally
beforeEach(() => {
  const mockGetContext = vi.fn().mockReturnValue({
    fillText: vi.fn(),
    clearRect: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    beginPath: vi.fn(),
    canvas: {
      width: 300,
      height: 300,
    },
  })

  // Mock the getContext method to return the mocked context
  HTMLCanvasElement.prototype.getContext = mockGetContext
})

afterEach(() => {
  // Reset mocks after each test
  vi.restoreAllMocks()
})

describe('PathCanvas component', () => {
  it('renders canvas and initializes context', () => {
    const path = [
      ['@', '-', 'A', '+'],
      ['|', ' ', ' ', 'x'],
    ]
    const mockBounds: Bounds = { minX: 0, minY: 0, maxX: 100, maxY: 100 }
    const mockSetWord = vi.fn()
    const mockSetPathCharacters = vi.fn()

    render(
      <PathCanvas
        path={path}
        MaterialColors={['#FF5722', '#E91E63']}
        minMax={mockBounds}
        setWord={mockSetWord}
        setPathCharacters={mockSetPathCharacters}
      />,
    )

    // Check if the canvas is rendered
    const canvas: HTMLCanvasElement = screen.getByTestId('path-canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas.width).toBe(mockBounds.maxX - mockBounds.minX + 50)
    expect(canvas.height).toBe(mockBounds.maxY - mockBounds.minY + 100)

    // Check that the mocked getContext was called
    const mockContext = canvas.getContext('2d')
    expect(mockContext?.clearRect).toHaveBeenCalled()
    expect(mockContext?.beginPath).toHaveBeenCalled()
  })

  it('draws the path and updates the word and characters', async () => {
    const path = [
      ['@', '-', 'A', '+'],
      ['|', ' ', ' ', 'x'],
    ]
    const mockBounds: Bounds = { minX: 0, minY: 0, maxX: 100, maxY: 100 }
    const mockSetWord = vi.fn()
    const mockSetPathCharacters = vi.fn()

    render(
      <PathCanvas
        path={path}
        MaterialColors={['#FF5722', '#E91E63']}
        minMax={mockBounds}
        setWord={mockSetWord}
        setPathCharacters={mockSetPathCharacters}
      />,
    )

    // Check if the context methods are called as expected
    const canvas: HTMLCanvasElement = screen.getByTestId('path-canvas')
    const mockContext = canvas.getContext('2d')

    expect(mockContext?.moveTo).toHaveBeenCalled()
    await waitFor(() => expect(mockContext?.lineTo).toHaveBeenCalled())
    await waitFor(() => expect(mockContext?.stroke).toHaveBeenCalled())

    // Check that setWord and setPathCharacters were called correctly
    expect(mockSetWord).toHaveBeenCalledWith('A')
    expect(mockSetPathCharacters).toHaveBeenCalled()
  })

  it('animates the path correctly with different directions', async () => {
    const path = [
      ['@', '-', 'A', '+'],
      ['|', 'B', '|', '+'],
      ['-', 'C', '-', '+'],
      ['|', 'D', '|', '+'],
      ['-', 'E', 'F', 'x'],
    ]
    const mockBounds: Bounds = { minX: 0, minY: 0, maxX: 200, maxY: 200 }
    const mockSetWord = vi.fn()
    const mockSetPathCharacters = vi.fn()

    render(
      <PathCanvas
        path={path}
        MaterialColors={['#FF5722', '#E91E63']}
        minMax={mockBounds}
        setWord={mockSetWord}
        setPathCharacters={mockSetPathCharacters}
      />,
    )

    // Verify that the path follows the direction
    const canvas: HTMLCanvasElement = screen.getByTestId('path-canvas')
    const mockContext = canvas.getContext('2d')

    // Check that the line drawing and path-changing logic is working
    expect(mockContext?.moveTo).toHaveBeenCalledWith(10, 50)
    await waitFor(() => expect(mockContext?.lineTo).toHaveBeenCalled())
    await waitFor(() => expect(mockContext?.stroke).toHaveBeenCalled())
  })

  it('handles errors gracefully', () => {
    const path = [
      ['-', 'A'],
      ['|', 'x'],
    ] // Missing '@'
    const mockBounds: Bounds = { minX: 0, minY: 0, maxX: 100, maxY: 100 }
    const mockSetWord = vi.fn()
    const mockSetPathCharacters = vi.fn()

    render(
      <PathCanvas
        path={path}
        MaterialColors={['#FF5722', '#E91E63']}
        minMax={mockBounds}
        setWord={mockSetWord}
        setPathCharacters={mockSetPathCharacters}
      />,
    )

    const canvas: HTMLCanvasElement = screen.getByTestId('path-canvas')
    const mockContext = canvas.getContext('2d')

    // Ensure the canvas is cleared when the path is invalid
    expect(mockContext?.clearRect).toHaveBeenCalled()
    expect(mockContext?.moveTo).toHaveBeenCalledOnce()
    // Verify that no drawing functions were called due to error
    expect(mockContext?.lineTo).not.toHaveBeenCalled()
  })
})
