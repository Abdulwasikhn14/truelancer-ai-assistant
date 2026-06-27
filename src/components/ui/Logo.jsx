import logoImg from '/logo.png'

const Logo = ({ size = 'md', light = false }) => {
  const sizes = {
    sm: { iconSize: 36, fontSize: 15, gap: 9 },
    md: { iconSize: 46, fontSize: 18, gap: 11 },
    lg: { iconSize: 58, fontSize: 22, gap: 13 },
    xl: { iconSize: 72, fontSize: 28, gap: 15 },
  }
  const s = sizes[size] ?? sizes.md

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: s.gap,
      textDecoration: 'none',
      userSelect: 'none',
    }}>
      <img
        src={logoImg}
        alt="Truelancer Logo"
        style={{
          width: s.iconSize,
          height: s.iconSize,
          objectFit: 'contain',
          flexShrink: 0,
        }}
      />
      <span style={{
        fontFamily: 'Inter, sans-serif',
        fontWeight: 800,
        fontSize: s.fontSize,
        letterSpacing: '-0.4px',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        color: light ? '#ffffff' : '#0A0A0A',
      }}>
        Truelancer
      </span>
    </div>
  )
}

export default Logo
