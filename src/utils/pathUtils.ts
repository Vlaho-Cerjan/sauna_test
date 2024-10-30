import { cellSize } from '@/constants/constants'
import { Bounds, PathSegment } from '@/types/types'

const calculateBoundsFromSegments = (segments: PathSegment[]): Bounds => {
  let [x, y] = [0, 0]
  const bounds: Bounds = { minX: x, minY: y, maxX: x, maxY: y }

  segments.forEach((segment) => {
    switch (segment.direction) {
      case 'RIGHT':
        x += cellSize
        break
      case 'LEFT':
        x -= cellSize
        break
      case 'DOWN':
        y += cellSize
        break
      case 'UP':
        y -= cellSize
        break
    }

    bounds.minX = Math.min(bounds.minX, x)
    bounds.minY = Math.min(bounds.minY, y)
    bounds.maxX = Math.max(bounds.maxX, x)
    bounds.maxY = Math.max(bounds.maxY, y)
  })

  return bounds
}

export { calculateBoundsFromSegments }
