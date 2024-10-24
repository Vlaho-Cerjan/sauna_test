import * as React from 'react'

function Play(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      data-testid="play-icon"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="prefix__feather prefix__feather-play"
      {...props}
    >
      <path d="M5 3l14 9-14 9V3z" />
    </svg>
  )
}

const MemoPlay = React.memo(Play)
export default MemoPlay
