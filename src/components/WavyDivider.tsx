interface WavyDividerProps {
  fromColor: string
  toColor: string
}

const WavyDivider = ({ fromColor, toColor }: WavyDividerProps) => {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: '120px', marginTop: '-1px', backgroundColor: toColor }}>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute top-0 left-0 w-full"
        style={{ display: 'block', height: '100%' }}
      >
        <path
          d="M0,80 C120,95 240,40 360,60 C480,80 600,30 720,55 C840,80 960,35 1080,58 C1200,80 1320,45 1440,65 L1440,0 L0,0 Z"
          fill={fromColor}
        />
        <path
          d="M0,50 C180,75 300,25 480,45 C660,65 780,20 960,40 C1140,60 1300,30 1440,50 L1440,0 L0,0 Z"
          fill={fromColor}
          opacity="0.6"
        />
      </svg>
    </div>
  )
}

export default WavyDivider
