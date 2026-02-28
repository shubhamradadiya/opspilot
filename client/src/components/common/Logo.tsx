import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'primary' | 'primary-dark' | 'primary-light' | 'icon-dark' | 'icon-gold' | 'icon-cream' | 'compact' | 'stacked';
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', variant = 'primary', height }) => {

  if (variant === 'primary') {
    return (
      <>
        <Logo variant="primary-light" height={height} className={`dark:hidden block ${className}`} />
        <Logo variant="primary-dark" height={height} className={`hidden dark:block ${className}`} />
      </>
    );
  }

  if (variant === 'primary-dark') {
    return (
      <svg width={height ? undefined : "260"} height={height || "52"} viewBox="0 0 260 52" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g>
          <path d="M20 4 L34 4 L42 17.5 L34 31 L20 31 L12 17.5 Z" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M27 9 L34 17.5 L27 26 L20 17.5 Z" fill="#D4AF37" opacity="0.9"/>
          <circle cx="27" cy="17.5" r="3" fill="#121212"/>
          <line x1="27" y1="1" x2="27" y2="4" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
          <line x1="27" y1="31" x2="27" y2="34" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
          <path d="M42 17.5 L50 17.5" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
          <path d="M47 14.5 L50 17.5 L47 20.5" stroke="#D4AF37" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </g>
        <text x="66" y="24" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="22" fontWeight="700" letterSpacing="-0.3" fill="#F5F5F5">Ops</text>
        <text x="106" y="24" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="22" fontWeight="700" letterSpacing="-0.3" fill="#D4AF37">Pilot</text>
        <text x="66" y="39" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="9" fontWeight="400" letterSpacing="0.18em" fill="#666666" style={{ textTransform: 'uppercase' }}>PRECISION OPERATIONS</text>
      </svg>
    );
  }

  if (variant === 'primary-light') {
    return (
      <svg width={height ? undefined : "260"} height={height || "52"} viewBox="0 0 260 52" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g>
          <path d="M20 4 L34 4 L42 17.5 L34 31 L20 31 L12 17.5 Z" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M27 9 L34 17.5 L27 26 L20 17.5 Z" fill="#D4AF37" opacity="0.9"/>
          <circle cx="27" cy="17.5" r="3" fill="#FDFBD4"/>
          <line x1="27" y1="1" x2="27" y2="4" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
          <line x1="27" y1="31" x2="27" y2="34" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
          <path d="M42 17.5 L50 17.5" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
          <path d="M47 14.5 L50 17.5 L47 20.5" stroke="#D4AF37" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </g>
        <text x="66" y="24" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="22" fontWeight="700" letterSpacing="-0.3" fill="#2A2A2A">Ops</text>
        <text x="106" y="24" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="22" fontWeight="700" letterSpacing="-0.3" fill="#D4AF37">Pilot</text>
        <text x="66" y="39" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="9" fontWeight="400" letterSpacing="0.18em" fill="#9A9A9A" style={{ textTransform: 'uppercase' }}>PRECISION OPERATIONS</text>
      </svg>
    );
  }

  if (variant === 'icon-dark') {
    return (
      <svg width={height ? undefined : "36"} height={height || "36"} viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M27 3 L45 3 L54 18 L45 33 L27 33 L18 18 Z" fill="none" stroke="#D4AF37" strokeLinejoin="round" strokeWidth="2.2" />
        <path d="M27 10 L37 18 L27 26 L17 18 Z" fill="#D4AF37"/>
        <circle cx="27" cy="18" r="4" fill="#121212"/>
        <line x1="27" y1="0" x2="27" y2="3" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="27" y1="33" x2="27" y2="36" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M54 18 L62 18" stroke="#D4AF37" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M58 14 L62 18 L58 22" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    );
  }

  if (variant === 'icon-gold') {
    return (
      <svg width={height ? undefined : "36"} height={height || "36"} viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M27 3 L45 3 L54 18 L45 33 L27 33 L18 18 Z" fill="none" stroke="#2A2A2A" strokeLinejoin="round" strokeWidth="2.2" />
        <path d="M27 10 L37 18 L27 26 L17 18 Z" fill="#2A2A2A" opacity="0.85"/>
        <circle cx="27" cy="18" r="4" fill="#D4AF37"/>
        <line x1="27" y1="0" x2="27" y2="3" stroke="#2A2A2A" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="27" y1="33" x2="27" y2="36" stroke="#2A2A2A" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M54 18 L62 18" stroke="#2A2A2A" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M58 14 L62 18 L58 22" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    );
  }

  if (variant === 'compact') {
    return (
      <svg width={height ? undefined : "180"} height={height || "36"} viewBox="0 0 180 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M13.5 2 L22.5 2 L27 9.5 L22.5 17 L13.5 17 L9 9.5 Z" fill="none" stroke="#D4AF37" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M18 5.5 L22.5 9.5 L18 13.5 L13.5 9.5 Z" fill="#D4AF37"/>
        <circle cx="18" cy="9.5" r="2" fill="#121212"/>
        <line x1="18" y1="0" x2="18" y2="2" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="18" y1="17" x2="18" y2="19" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M27 9.5 L32 9.5" stroke="#D4AF37" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M30 7.5 L32 9.5 L30 11.5" stroke="#D4AF37" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <text x="42" y="14" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="15" fontWeight="700" letterSpacing="-0.2" fill="#F5F5F5">Ops</text>
        <text x="68" y="14" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="15" fontWeight="700" letterSpacing="-0.2" fill="#D4AF37">Pilot</text>
      </svg>
    );
  }

  // Fallback icon
  return (
    <svg width={height ? undefined : "36"} height={height || "36"} viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M27 3 L45 3 L54 18 L45 33 L27 33 L18 18 Z" fill="none" stroke="#D4AF37" strokeLinejoin="round" strokeWidth="2.2" />
      <path d="M27 10 L37 18 L27 26 L17 18 Z" fill="#D4AF37"/>
    </svg>
  );
};

export default Logo;
