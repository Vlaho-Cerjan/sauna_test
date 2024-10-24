type PathErrorDisplayProps = {
  errorMessage: string
}

const PathErrorDisplay: React.FC<PathErrorDisplayProps> = ({
  errorMessage,
}: PathErrorDisplayProps) => (
  <div data-testid="path-error" className="error-message">
    {errorMessage}
  </div>
)

export default PathErrorDisplay
