import PathRenderer from '@/components/pathRenderer/pathRenderer'
import { path } from '@/constants/constants'

import './App.css'

const App = () => {
  return (
    <div className="App">
      <div className="flex">
        <PathRenderer path={path} />
      </div>
    </div>
  )
}

export { App }
