export default function Logo({ size = 45 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="80" height="80" fill="none" stroke="#E31E24" strokeWidth="2"/>
      <path d="M30 30 L70 30 L70 50 Q70 70 50 70 Q30 70 30 50" fill="#E31E24"/>
      <rect x="20" y="55" width="60" height="20" fill="#8B7355" rx="5"/>
    </svg>
  );
}
