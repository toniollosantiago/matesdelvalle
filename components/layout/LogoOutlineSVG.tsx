export default function LogoOutlineSVG({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} text-white transition-transform duration-300 hover:scale-110`}
    >
      {/* Bombilla */}
      <path d="M55 35 L73 10 M71 8 L77 12" />
      
      {/* Mountains inside gourd opening */}
      <path d="M30 42 L42 27 L53 38 L62 29 L70 42" strokeWidth="3" />
      
      {/* Mate Gourd Body Outline */}
      <path d="M28 42 C 22 52, 28 80, 50 82 C 72 80, 78 52, 72 42 C 65 46, 35 46, 28 42 Z" />
      
      {/* Sun Motif in the center of Gourd */}
      <circle cx="50" cy="63" r="7" />
      {/* Sun Rays */}
      <line x1="50" y1="52" x2="50" y2="49" />
      <line x1="50" y1="74" x2="50" y2="77" />
      <line x1="39" y1="63" x2="36" y2="63" />
      <line x1="61" y1="63" x2="64" y2="63" />
      <line x1="42" y1="55" x2="40" y2="53" />
      <line x1="58" y1="71" x2="60" y2="73" />
      <line x1="42" y1="71" x2="40" y2="73" />
      <line x1="58" y1="55" x2="60" y2="53" />
    </svg>
  );
}
