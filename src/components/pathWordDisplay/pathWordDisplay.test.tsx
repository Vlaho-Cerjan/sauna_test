import { render, screen } from '@testing-library/react'

import PathWordDisplay from '@/components/pathWordDisplay/pathWordDisplay'

describe('PathWordDisplay Component', () => {
  it('displays the word and path characters correctly', () => {
    render(<PathWordDisplay word="ABC" pathCharacters="-" />)
    expect(screen.getByTestId('path-word')).toHaveTextContent('Path Word: ABC')
    expect(screen.getByTestId('path-characters')).toHaveTextContent('Path Characters: -')
  })
})
