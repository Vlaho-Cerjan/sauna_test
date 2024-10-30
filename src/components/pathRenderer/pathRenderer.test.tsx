import { render, screen, waitFor } from '@testing-library/react'

import PathRenderer from '@/components/pathRenderer/pathRenderer'

describe('PathRenderer Component', () => {
  beforeEach(() => {
    const mockGetContext = vi.fn().mockReturnValue({
      fillText: vi.fn(),
      clearRect: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      beginPath: vi.fn(),
      canvas: {
        width: 100,
        height: 100,
      },
    })

    // Mock the getContext method to return our mocked context
    HTMLCanvasElement.prototype.getContext = mockGetContext
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the loading spinner initially', () => {
    render(<PathRenderer map={[['@', '-', 'x']]} />)
    expect(screen.getByTestId('path-loading')).toBeInTheDocument()
  })

  it('renders PathCanvas and PathWordDisplay when loading is complete', async () => {
    render(<PathRenderer map={[['@', '-', 'x']]} />)

    await waitFor(() => expect(screen.getByTestId('path-canvas')).toBeInTheDocument())
    expect(screen.getByTestId('path-letters')).toHaveTextContent('Letters:')
  })

  it('renders PathCanvas and PathWordDisplay with correct word and path characters', async () => {
    render(
      <PathRenderer
        map={[
          ['@', '-', 'A', 'B', 'C', '+'],
          [' ', ' ', ' ', 'x', 'E', 'D'],
        ]}
      />,
    )

    await waitFor(() => expect(screen.getByTestId('path-canvas')).toBeInTheDocument())
    await waitFor(() =>
      expect(screen.getByTestId('path-letters')).toHaveTextContent('Letters: ABCDE'),
    )
    await waitFor(() =>
      expect(screen.getByTestId('path-characters')).toHaveTextContent('Path Characters: @-ABC+DEx'),
    )
  })

  it('displays an error when path validation fails', async () => {
    render(<PathRenderer map={[['-', 'x']]} />)

    await waitFor(() => expect(screen.getByTestId('path-error')).toBeInTheDocument())
    expect(screen.getByTestId('path-error')).toHaveTextContent('No start position found')
  })
})
