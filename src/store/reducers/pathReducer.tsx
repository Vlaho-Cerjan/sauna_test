type PathState = {
  word: string
  pathCharacters: string
  loading: boolean
  errorMessage: string
}

type PathAction =
  | { type: 'SET_WORD'; payload: string }
  | { type: 'SET_PATH_CHARACTERS'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }

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
export type { PathAction, PathState }
