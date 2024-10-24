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
    render(<PathRenderer path={[['@', '-', 'x']]} />)
    expect(screen.getByTestId('path-loading')).toBeInTheDocument()
  })

  it('renders PathCanvas and PathWordDisplay when loading is complete', async () => {
    render(<PathRenderer path={[['@', '-', 'x']]} />)

    await waitFor(() => expect(screen.getByTestId('path-canvas')).toBeInTheDocument())
    expect(screen.getByTestId('path-word')).toHaveTextContent('Path Word:')
  })

  it('renders PathCanvas and PathWordDisplay with correct word and path characters', async () => {
    render(
      <PathRenderer
        path={[
          ['@', '-', 'A', 'B', 'C', '+'],
          ['D', 'E', '|', 'x'],
        ]}
      />,
    )

    await waitFor(() => expect(screen.getByTestId('path-canvas')).toBeInTheDocument())
    await waitFor(() =>
      expect(screen.getByTestId('path-word')).toHaveTextContent('Path Word: ABCDE'),
    )
    await waitFor(() =>
      expect(screen.getByTestId('path-characters')).toHaveTextContent(
        'Path Characters: @-ABC+DE|x',
      ),
    )
  })

  it('displays an error when path validation fails', async () => {
    render(<PathRenderer path={[['-', 'x']]} />)

    await waitFor(() => expect(screen.getByTestId('path-error')).toBeInTheDocument())
    expect(screen.getByTestId('path-error')).toHaveTextContent("Path must start with '@'")
  })
})
