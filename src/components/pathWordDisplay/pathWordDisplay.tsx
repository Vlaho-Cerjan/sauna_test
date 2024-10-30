import { PathSegment } from '@/types/types'

type PathWordDisplayProps = {
  letters: string
  pathSegments: PathSegment[]
}

const PathWordDisplay: React.FC<PathWordDisplayProps> = ({
  letters,
  pathSegments,
}: PathWordDisplayProps) => {
  const pathString = pathSegments?.map((seg) => seg.char).join('')

  return (
    <>
      <div data-testid="path-letters">Letters: {letters}</div>
      <div data-testid="path-characters">Path Characters: {pathString}</div>
    </>
  )
}

export default PathWordDisplay
