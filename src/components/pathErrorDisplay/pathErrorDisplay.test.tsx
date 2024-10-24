import { render, screen } from '@testing-library/react'

import PathErrorDisplay from '@/components/pathErrorDisplay/pathErrorDisplay'

describe('PathErrorDisplay Component', () => {
  it('displays the error message', () => {
    render(<PathErrorDisplay errorMessage="Something went wrong!" />)
    expect(screen.getByTestId('path-error')).toHaveTextContent('Something went wrong!')
  })
})
