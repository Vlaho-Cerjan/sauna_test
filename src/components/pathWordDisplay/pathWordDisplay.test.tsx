import { render, screen } from '@testing-library/react'

import PathWordDisplay from '@/components/pathWordDisplay/pathWordDisplay'

describe('PathWordDisplay Component', () => {
  it('displays the word and path characters correctly', () => {
    render(
      <PathWordDisplay
        letters="ABC"
        pathSegments={[
          { char: '@', direction: 'RIGHT', position: { row: 0, col: 0, sign: '@' } },
          { char: 'A', direction: 'RIGHT', position: { row: 0, col: 0, sign: '-' } },
          { char: 'B', direction: 'RIGHT', position: { row: 0, col: 1, sign: '-' } },
          { char: 'C', direction: 'RIGHT', position: { row: 0, col: 2, sign: '-' } },
          { char: 'x', direction: 'UP', position: { row: 0, col: 3, sign: 'x' } },
        ]}
      />,
    )
    expect(screen.getByTestId('path-letters')).toHaveTextContent('Letters: ABC')
    expect(screen.getByTestId('path-characters')).toHaveTextContent('Path Characters: @ABCx')
  })
})
