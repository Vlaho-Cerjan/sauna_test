import React, { useCallback, useEffect, useRef } from 'react'

import { cellSize } from '@/constants/constants'
import { Bounds, Direction } from '@/types/types'

type PathCanvasProps = {
  path: string[][]
  MaterialColors: string[]
  minMax: Bounds
  setWord: (word: string) => void
  setPathCharacters: (pathCharacters: string) => void
}

const PathCanvas: React.FC<PathCanvasProps> = ({
  path,
  MaterialColors,
  minMax,
  setWord,
  setPathCharacters,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)

  const drawPathAnimated = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      let [x, y] = [10, 50]
      let direction: Direction = 'right'
      let currentRow = 0
      let currentColumn = 0
      const drawNext = true

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.beginPath()
      ctx.moveTo(x, y)

      const stepThroughPath = () => {
        if (currentRow >= path.length || !drawNext) {
          return
        }

        const currentRowData = path[currentRow]

        if (currentColumn >= currentRowData.length) {
          currentRow++
          currentColumn = 0
          return (animationRef.current = requestAnimationFrame(stepThroughPath)) // Go to next row
        }

        const char = currentRowData[currentColumn]
        setPathCharacters(char)
        if (/[A-Z]/.test(char)) setWord(char)

        // Draw letter if uppercase
        if (/[A-Z@x]/.test(char)) {
          ctx.font = '20px Arial'
          ctx.fillStyle = MaterialColors[Math.floor(Math.random() * MaterialColors.length)]
          const textX = direction === 'down' || direction === 'up' ? x + 4 : x
          const textY = direction === 'right' || direction === 'left' ? y - 4 : y
          ctx.fillText(char, textX, textY)
        }

        // Move based on character
        switch (char) {
          case '-':
          case '|':
          case char.match(/[A-Z]/)?.input:
            if (direction === 'right') x += cellSize
            else if (direction === 'left') x -= cellSize
            else if (direction === 'down') y += cellSize
            else if (direction === 'up') y -= cellSize
            break
          case '+':
            if (direction === 'right') x += cellSize
            else if (direction === 'left') x -= cellSize
            else if (direction === 'down') y += cellSize
            else if (direction === 'up') y -= cellSize

            ctx.lineTo(x, y)

            // Change direction
            direction =
              direction === 'right'
                ? 'down'
                : direction === 'down'
                  ? 'left'
                  : direction === 'left'
                    ? 'up'
                    : 'right'

            if (direction === 'right') x += cellSize
            else if (direction === 'left') x -= cellSize
            else if (direction === 'down') y += cellSize
            else if (direction === 'up') y -= cellSize
            break
          default:
            break
        }

        ctx.lineTo(x, y)
        ctx.stroke()

        currentColumn++
        setTimeout(() => {
          animationRef.current = requestAnimationFrame(stepThroughPath) // Move to next character
        }, 1000 / 60) // 60 FPS limit
      }

      animationRef.current = requestAnimationFrame(stepThroughPath)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [path],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    drawPathAnimated(ctx)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [drawPathAnimated])

  return (
    <canvas
      ref={canvasRef}
      data-testid="path-canvas"
      width={minMax.maxX - minMax.minX + 50}
      height={minMax.maxY - minMax.minY + 100}
    ></canvas>
  )
}

export default PathCanvas
