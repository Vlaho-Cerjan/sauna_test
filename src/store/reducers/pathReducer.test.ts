import { initialState, pathReducer } from '@/store/reducers/pathReducer'
import { PathAction } from '@/types/types'

describe('pathReducer', () => {
  it('should return the initial state', () => {
    const newState = pathReducer(initialState, {} as PathAction)
    expect(newState).toEqual(initialState)
  })

  it('should set loading state', () => {
    const action = { type: 'SET_LOADING', payload: false } as PathAction
    const newState = pathReducer(initialState, action)
    expect(newState.loading).toBe(false)
  })

  it('should set letters', () => {
    const action = {
      type: 'SET_PATH_RESULT',
      payload: {
        letters: 'A',
        pathSegments: [],
      },
    } as PathAction
    const newState = pathReducer(initialState, action)
    expect(newState.letters).toBe('A')
  })

  it('should set path characters', () => {
    const pathSegments = [
      { char: '@', direction: 'RIGHT', position: { row: 0, col: 0, sign: '@' } },
      { char: 'A', direction: 'RIGHT', position: { row: 0, col: 1, sign: '-' } },
      { char: 'B', direction: 'RIGHT', position: { row: 0, col: 2, sign: '-' } },
      { char: 'x', direction: 'RIGHT', position: { row: 0, col: 3, sign: 'x' } },
    ]

    const action = {
      type: 'SET_PATH_RESULT',
      payload: {
        letters: 'AB',
        pathSegments,
      },
    } as PathAction
    const newState = pathReducer(initialState, action)
    expect(newState.pathSegments).toBe(pathSegments)
  })

  it('should set error message', () => {
    const action = { type: 'SET_ERROR', payload: 'Error' } as PathAction
    const newState = pathReducer(initialState, action)
    expect(newState.errorMessage).toBe('Error')
  })

  it('should return the initial state if invalid action', () => {
    // @ts-expect-error Testing invalid action
    const action = { type: 'INVALID_ACTION', payload: 'Invalid' } as PathAction
    const newState = pathReducer(initialState, action)
    expect(newState).toEqual(initialState)
  })
})
