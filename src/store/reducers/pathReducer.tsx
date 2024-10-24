import { PathAction, PathState } from '@/types/types'

const initialState: PathState = {
  word: '',
  pathCharacters: '',
  loading: true,
  errorMessage: '',
}

const pathReducer = (state: PathState, action: PathAction): PathState => {
  switch (action.type) {
    case 'SET_WORD':
      return { ...state, word: state.word + action.payload }
    case 'SET_PATH_CHARACTERS':
      return { ...state, pathCharacters: state.pathCharacters + action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, errorMessage: action.payload }
    default:
      return state
  }
}

export { initialState, pathReducer }
