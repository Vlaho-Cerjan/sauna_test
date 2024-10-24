import { render, screen } from '@testing-library/react'

import MemoPlay from '@/icons/Play'

import Button from './button'

describe('Button', () => {
  test('should return the correct text', () => {
    const title = 'Click me'
    render(<Button title={title} />)

    const button = screen.getByTestId('button')

    expect(button).toBeInTheDocument()

    expect(button).toHaveTextContent(title)
  })

  test('should return the correct text and icon', () => {
    const title = 'Click me'
    render(<Button title={title} icon={<MemoPlay />} />)

    const button = screen.getByTestId('button')

    expect(button).toBeInTheDocument()

    expect(button).toHaveTextContent(title)

    const icon = screen.getByTestId('play-icon')

    expect(icon).toBeInTheDocument()
  })

  test('should return the correct text and icon with custom data-testid', () => {
    const title = 'Click me'
    render(<Button title={title} icon={<MemoPlay />} data-testid="custom-button" />)

    const button = screen.getByTestId('custom-button')

    expect(button).toBeInTheDocument()

    expect(button).toHaveTextContent(title)

    const icon = screen.getByTestId('play-icon')

    expect(icon).toBeInTheDocument()
  })
})
