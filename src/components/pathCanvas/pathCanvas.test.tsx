// PathCanvas.test.tsx
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import PathCanvas from '@/components/pathCanvas/pathCanvas'
import { Bounds, PathSegment } from '@/types/types'

// Define sample test data
const pathSegments: PathSegment[] = [
  { char: '@', direction: 'RIGHT', position: { row: 0, col: 0, sign: '@' } },
  { char: 'A', direction: 'RIGHT', position: { row: 0, col: 1, sign: '-' } },
  { char: 'B', direction: 'RIGHT', position: { row: 1, col: 2, sign: '-' } },
  { char: 'x', direction: 'UP', position: { row: 0, col: 3, sign: 'x' } },
]

const minMax: Bounds = { minX: 0, maxX: 3, minY: 0, maxY: 3 }

describe('PathCanvas Component', () => {
  // Mock the 2D context
  const mockCtx = {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
    canvas: { width: 0, height: 0 },
  }

  beforeEach(() => {
    vi.clearAllMocks() // Clear mocks before each test
    // Mock the canvas getContext function
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCtx)
  })

  it('renders the canvas element', () => {
    render(<PathCanvas pathSegments={pathSegments} minMax={minMax} />)
    const canvas = screen.getByTestId('path-canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveAttribute('width', `${(minMax.maxX - minMax.minX) * 3}`)
    expect(canvas).toHaveAttribute('height', `${(minMax.maxY - minMax.minY) * 3}`)
  })

  it('calls canvas context methods to draw path', async () => {
    render(<PathCanvas pathSegments={pathSegments} minMax={minMax} />)
    // Ensure the canvas context is cleared and path is started
    expect(mockCtx.clearRect).toHaveBeenCalled()
    expect(mockCtx.beginPath).toHaveBeenCalled()
    expect(mockCtx.moveTo).toHaveBeenCalled()
    await waitFor(() => {
      expect(mockCtx.stroke).toHaveBeenCalled()
    })
  })

  it('animates the path on the canvas', async () => {
    render(<PathCanvas pathSegments={pathSegments} minMax={minMax} />)

    // Expect fillText to be called for each character with the correct coordinates
    await waitFor(() => {
      expect(mockCtx.fillText).toHaveBeenCalledWith('@', expect.any(Number), expect.any(Number))
      expect(mockCtx.fillText).toHaveBeenCalledWith('A', expect.any(Number), expect.any(Number))
      expect(mockCtx.fillText).toHaveBeenCalledWith('B', expect.any(Number), expect.any(Number))
      expect(mockCtx.fillText).toHaveBeenCalledWith('x', expect.any(Number), expect.any(Number))
    })
  })

  it('draws only the defined segments on the canvas', () => {
    render(<PathCanvas pathSegments={pathSegments} minMax={minMax} />)

    pathSegments.forEach(async (segment) => {
      if (/[A-Zx@]/.test(segment.char)) {
        await waitFor(() => {
          expect(mockCtx.fillText).toHaveBeenCalledWith(
            segment.char,
            expect.any(Number),
            expect.any(Number),
          )
        })
      }
    })
  })
})
