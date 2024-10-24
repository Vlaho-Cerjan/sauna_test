type PathWordDisplayProps = {
  word: string
  pathCharacters: string
}

const PathWordDisplay: React.FC<PathWordDisplayProps> = ({
  word,
  pathCharacters,
}: PathWordDisplayProps) => {
  return (
    <>
      <div data-testid="path-word">Path Word: {word}</div>
      <div data-testid="path-characters">Path Characters: {pathCharacters}</div>
    </>
  )
}
export default PathWordDisplay
