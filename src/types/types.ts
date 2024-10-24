type Direction = 'right' | 'left' | 'up' | 'down'

type Bounds = {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

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

export type { Bounds, Direction, PathAction, PathState }
