interface WavyDividerProps {
  fromColor: string
  toColor: string
}

const WavyDivider = ({ fromColor, toColor }: WavyDividerProps) => {
  return (
    <div className="relative w-full h-24 overflow-hidden" style={{ marginTop: '-1px', backgroundColor: toColor }}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="absolute top-0 left-0 w-full h-full"
        style={{ display: 'block', height: '100%' }}
      >
        <path
          d="M0,60 C150,100 300,20 450,60 C600,100 750,20 900,60 C1050,100 1200,20 1200,60 L1200,0 L0,0 Z"
          fill={fromColor}
        />
      </svg>
    </div>
  )
}

export default WavyDivider

