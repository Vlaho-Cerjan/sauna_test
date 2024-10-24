import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/App'

import './index.css'

// Uncomment if you want to see the Lighthouse report in the console

const root = createRoot(document.getElementById('root') as HTMLElement)

if (import.meta.env.MODE === 'test') {
  import('@/__mocks__/browser')
    .then(({ worker }) => {
      worker.start()
    })
    .then(() => {
      root.render(
        <StrictMode>
          <App />
        </StrictMode>,
      )
    })
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

// eslint-disable-next-line no-console
// reportWebVitals(console.log)
