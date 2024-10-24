import React, { ReactElement } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  icon?: ReactElement
  'data-testid'?: string
}

const Button: React.FC<ButtonProps> = ({ title, icon, ...props }) => {
  return (
    <button {...props} type={props.type || 'button'} data-testid={props['data-testid'] || 'button'}>
      {title}
      {typeof icon !== 'undefined' && icon}
    </button>
  )
}

export default Button
