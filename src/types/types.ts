type Direction = 'RIGHT' | 'LEFT' | 'UP' | 'DOWN'

type Sign = '|' | '-' | '+' | '@' | 'x'

type Position = {
  row: number
  col: number
  sign: Sign
}

type Bounds = {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

type PathSegment = {
  char: string
  direction: Direction
  position: Position
  skipDraw?: boolean
}

type PathResult = {
  letters: string
  pathSegments: PathSegment[]
}

type PathState = {
  letters: string
  pathSegments: PathSegment[]
  loading: boolean
  errorMessage: string
}

type PathAction =
  | { type: 'SET_PATH_RESULT'; payload: PathResult }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }

export type { Bounds, Sign, Direction, PathAction, PathResult, PathSegment, PathState, Position }
