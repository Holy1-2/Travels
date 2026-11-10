export default function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2FAF5" />
          <stop offset="1" stopColor="#BFE0CD" />
        </linearGradient>
        <linearGradient id="gL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5FB58A" />
          <stop offset="1" stopColor="#1F6B4E" />
        </linearGradient>
        <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1F6B4E" />
          <stop offset="1" stopColor="#082A1F" />
        </linearGradient>
        <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6DE9A" />
          <stop offset=".5" stopColor="#C9A24B" />
          <stop offset="1" stopColor="#8C6D22" />
        </linearGradient>
        <linearGradient id="gW" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#DDEBE3" />
        </linearGradient>
        <radialGradient id="rL" cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#8AD0AA" />
          <stop offset="1" stopColor="#1F6B4E" />
        </radialGradient>
        <radialGradient id="rG" cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#F6DE9A" />
          <stop offset="1" stopColor="#B8902F" />
        </radialGradient>
      </defs>
    </svg>
  );
}
