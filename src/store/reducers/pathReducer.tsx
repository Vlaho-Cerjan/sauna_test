import { PathAction, PathState } from '@/types/types'

const initialState: PathState = {
  letters: '',
  pathSegments: [],
  loading: true,
  errorMessage: '',
}

const pathReducer = (state: PathState, action: PathAction): PathState => {
  switch (action.type) {
    case 'SET_PATH_RESULT':
      return {
        ...state,
        letters: action.payload.letters,
        pathSegments: action.payload.pathSegments,
      }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, errorMessage: action.payload }
    default:
      return state
  }
}

export { initialState, pathReducer }
