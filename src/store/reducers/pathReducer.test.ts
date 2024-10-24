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

  it('should set word', () => {
    const action = { type: 'SET_WORD', payload: 'A' } as PathAction
    const newState = pathReducer(initialState, action)
    expect(newState.word).toBe('A')
  })

  it('should set path characters', () => {
    const action = { type: 'SET_PATH_CHARACTERS', payload: 'AB' } as PathAction
    const newState = pathReducer(initialState, action)
    expect(newState.pathCharacters).toBe('AB')
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
