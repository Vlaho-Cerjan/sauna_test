import React, { useEffect, useReducer, useState } from 'react'

import LoadingSpinner from '@/components/common/loading/loading'
import PathCanvas from '@/components/pathCanvas/pathCanvas'
import PathErrorDisplay from '@/components/pathErrorDisplay/pathErrorDisplay'
import PathWordDisplay from '@/components/pathWordDisplay/pathWordDisplay'
import { initialState, pathReducer } from '@/store/reducers/pathReducer'
import { Bounds } from '@/types/types'
import { PathFinder } from '@/utils/pathFinder'
import { calculateBoundsFromSegments } from '@/utils/pathUtils'

type PathProps = {
  map: string[][]
}

const PathRenderer: React.FC<PathProps> = ({ map }) => {
  const [state, dispatch] = useReducer(pathReducer, initialState)
  const [minMax, setMinMax] = useState<Bounds>({ minX: 0, minY: 0, maxX: 0, maxY: 0 })

  useEffect(() => {
    try {
      const pathFinder = new PathFinder(map)
      const result = pathFinder.findPath()

      dispatch({ type: 'SET_PATH_RESULT', payload: result })

      // Calculate bounds based on path segments
      const bounds = calculateBoundsFromSegments(result.pathSegments)
      setMinMax(bounds)

      setTimeout(() => {
        dispatch({ type: 'SET_LOADING', payload: false })
      }, 100)
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: (err as Error).message })
    }
  }, [map])

  return (
    <>
      {state.errorMessage ? (
        <PathErrorDisplay errorMessage={state.errorMessage} />
      ) : (
        <div className="path-container">
          {!state.loading ? (
            <>
              <PathCanvas pathSegments={state.pathSegments} minMax={minMax} />
              <PathWordDisplay letters={state.letters} pathSegments={state.pathSegments} />
            </>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      )}
    </>
  )
}

export default PathRenderer
