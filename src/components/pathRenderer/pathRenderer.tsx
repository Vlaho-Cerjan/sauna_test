import React, { useEffect, useReducer, useState } from 'react'

import LoadingSpinner from '@/components/common/loading/loading'
import PathCanvas from '@/components/pathCanvas/pathCanvas'
import PathErrorDisplay from '@/components/pathErrorDisplay/pathErrorDisplay'
import PathWordDisplay from '@/components/pathWordDisplay/pathWordDisplay'
import { initialState, pathReducer } from '@/store/reducers/pathReducer'
import { Bounds } from '@/types/types'
import { calculatePathBounds, validatePath } from '@/utils/pathUtils'

type PathProps = {
  path: string[][]
}

const PathRenderer: React.FC<PathProps> = ({ path }) => {
  const [state, dispatch] = useReducer(pathReducer, initialState)
  const [minMax, setMinMax] = useState<Bounds>({ minX: 0, minY: 0, maxX: 0, maxY: 0 })

  const MaterialColors = [
    '#FF5722',
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50',
    '#8BC34A',
  ]

  // Update path state
  useEffect(() => {
    try {
      validatePath(path)
      const bounds = calculatePathBounds(path)
      setMinMax(bounds)
      setTimeout(() => {
        dispatch({ type: 'SET_LOADING', payload: false })
      }, 100)
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: (err as Error).message })
    }
  }, [path])

  const setWord = (word: string) => {
    dispatch({ type: 'SET_WORD', payload: word })
  }

  const setPathCharacters = (pathCharacters: string) => {
    dispatch({ type: 'SET_PATH_CHARACTERS', payload: pathCharacters })
  }

  return (
    <>
      {state.errorMessage ? (
        <PathErrorDisplay errorMessage={state.errorMessage} />
      ) : (
        <div className="path-container">
          {!state.loading ? (
            <>
              <PathCanvas
                path={path}
                MaterialColors={MaterialColors}
                minMax={minMax}
                setWord={setWord}
                setPathCharacters={setPathCharacters}
              />
              <PathWordDisplay word={state.word} pathCharacters={state.pathCharacters} />
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
