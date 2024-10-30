/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef } from 'react'

import { cellSize } from '@/constants/constants'
import { Bounds, PathSegment } from '@/types/types'

type PathCanvasProps = {
  pathSegments: PathSegment[]
  minMax: Bounds
}

const PathCanvas: React.FC<PathCanvasProps> = ({ pathSegments, minMax }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)

  const drawPathAnimated = useCallback(
    (ctx: CanvasRenderingContext2D) => {
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

      let currentIndex = 0

      // Calculate the center of the path
      const pathX = (minMax.minX + minMax.maxX) / 2
      const pathY = (minMax.minY + minMax.maxY) / 2

      // Calculate the center of the canvas
      const pathCenterX = ((minMax.maxX - minMax.minX) * 3) / 2
      const pathCenterY = ((minMax.maxY - minMax.minY) * 3) / 2

      // Determine the offset to shift the starting point to center the canvas
      const offsetX = pathCenterX - pathX
      const offsetY = pathCenterY - pathY

      let [x, y] = [offsetX, offsetY]

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.beginPath()
      ctx.moveTo(x, y)

      const stepThroughPath = () => {
        if (currentIndex >= pathSegments.length) {
          return
        }

        const segment = pathSegments[currentIndex]
        const char = segment.char
        const direction = segment.direction

        if (char === '@') {
          ctx.font = '20px Arial'
          ctx.fillStyle = MaterialColors[Math.floor(Math.random() * MaterialColors.length)]
          ctx.fillText(char, x + 4, y - 6)
        }

        // Move based on direction
        switch (direction) {
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

        if (/[A-Zx]/.test(char) && !segment.skipDraw) {
          ctx.font = '20px Arial'
          ctx.fillStyle = MaterialColors[Math.floor(Math.random() * MaterialColors.length)]
          const nextSign = pathSegments[currentIndex + 1]?.position.sign
          const sign = pathSegments[currentIndex]?.position.sign
          const isCorner = (sign === '|' && nextSign === '-') || (sign === '-' && nextSign === '|')
          const textX = direction === 'UP' || direction === 'DOWN' || isCorner ? x + 4 : x
          const textY = direction === 'RIGHT' || direction === 'LEFT' || isCorner ? y - 4 : y
          ctx.fillText(char, textX, textY)
        }

        ctx.lineTo(x, y)
        ctx.stroke()

        currentIndex++
        setTimeout(() => {
          animationRef.current = requestAnimationFrame(stepThroughPath)
        }, 1000 / 60)
      }

      animationRef.current = requestAnimationFrame(stepThroughPath)
    },
    [pathSegments],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !pathSegments) return

    drawPathAnimated(ctx)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [drawPathAnimated, pathSegments])

  return (
    <canvas
      ref={canvasRef}
      data-testid="path-canvas"
      width={(minMax.maxX - minMax.minX) * 3}
      height={(minMax.maxY - minMax.minY) * 3}
    />
  )
}

export default PathCanvas
