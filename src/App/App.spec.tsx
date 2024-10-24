// App.spec.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import { App } from '@/App/App'

vi.mock('../constants/constants.ts')

describe('App Component', () => {
  // Mocking the CanvasRenderingContext2D globally
  beforeEach(async () => {
    const constants = await import('@/constants/constants')
    constants.path = (
      await vi.importActual<typeof import('@/constants/constants')>('../constants/constants.ts')
    ).path

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
    vi.restoreAllMocks()
    vi.resetAllMocks()
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('renders the App component and initializes PathRenderer with canvas context', async () => {
    render(<App />)

    // Check if the canvas is rendered
    await waitFor(() => expect(screen.getByTestId('path-canvas')).toBeInTheDocument())
    const canvas: HTMLCanvasElement = screen.getByTestId('path-canvas') // assuming PathCanvas uses a data-testid="path-canvas"
    expect(canvas).toBeInTheDocument()

    // Check that the mocked getContext was called
    const mockContext = canvas.getContext('2d')
    expect(mockContext).not.toBeNull()
    expect(mockContext?.clearRect).toHaveBeenCalled()
    expect(mockContext?.beginPath).toHaveBeenCalled()
  })

  it('draws the full path as expected in PathRenderer', async () => {
    render(<App />)

    await waitFor(() => expect(screen.getByTestId('path-canvas')).toBeInTheDocument())
    // Get the canvas
    const canvas: HTMLCanvasElement = screen.getByTestId('path-canvas')
    const mockContext = canvas.getContext('2d')

    // Check that the drawing functions were called
    expect(mockContext?.moveTo).toHaveBeenCalled()
    expect(mockContext?.lineTo).toHaveBeenCalled()
    expect(mockContext?.stroke).toHaveBeenCalled()
    await waitFor(() =>
      expect(screen.getByTestId('path-word')).toHaveTextContent('Path Word: HELLOWORLD'),
    )
    await waitFor(() =>
      expect(screen.getByTestId('path-characters')).toHaveTextContent(
        'Path Characters: @--H----E----+|L||L||||||+--O-+|W|O|+--R--+|LDx',
      ),
    )
  })

  it('does not crash if canvas context is null', async () => {
    // Force getContext to return null
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null)

    render(<App />)

    await waitFor(() => expect(screen.getByTestId('path-canvas')).toBeInTheDocument())
    // Since getContext is null, ensure that the app does not crash
    // and no drawing functions were called.
    const canvas: HTMLCanvasElement | null = screen.queryByTestId('path-canvas')
    expect(canvas).toBeInTheDocument()

    // Since getContext returned null, drawing methods should not have been called
    const mockContext = canvas?.getContext('2d')
    expect(mockContext).toBeNull()
  })

  it('displays an error when path validation fails', async () => {
    const constants = await import('@/constants/constants')
    constants.path = [['-', 'x']]

    render(<App />)

    await waitFor(() => expect(screen.getByTestId('path-error')).toBeInTheDocument())
    expect(screen.getByTestId('path-error').textContent).toBe("Path must start with '@'")
  })
})
