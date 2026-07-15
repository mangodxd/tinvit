interface DuckMascotProps {
  size?: number;
  className?: string;
  animate?: boolean;
  variant?: 'default' | 'outline' | 'mono';
}

export function DuckMascot({
  size = 48,
  className,
  animate = false,
  variant = 'default',
}: DuckMascotProps) {
  const colors =
    variant === 'mono'
      ? { body: '#0f172a', head: '#0f172a', wing: '#1e293b', beak: '#64748b', blush: 'transparent', foot: '#64748b' }
      : variant === 'outline'
        ? { body: 'none', head: 'none', wing: 'none', beak: 'none', blush: 'none', foot: 'none' }
        : { body: '#facc15', head: '#facc15', wing: '#eab308', beak: '#f97316', blush: '#fda4af', foot: '#f97316' };

  const stroke = variant === 'outline' ? '#0f172a' : variant === 'mono' ? '#0f172a' : '#0f172a';
  const sw = variant === 'outline' ? 2 : 1;

  return (
    <div
      className={`inline-flex ${animate ? 'animate-bounce' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body */}
        <ellipse
          cx="32" cy="40" rx="18" ry="14"
          fill={colors.body}
          stroke={variant === 'outline' ? stroke : undefined}
          strokeWidth={sw}
        />

        {/* Head */}
        <circle
          cx="32" cy="21" r="13"
          fill={colors.head}
          stroke={variant === 'outline' ? stroke : undefined}
          strokeWidth={sw}
        />

        {/* Eye Left */}
        <circle cx="27" cy="19" r="3.5" fill="white" />
        <circle cx="28" cy="19" r="2" fill="#0f172a" />
        <circle cx="29" cy="18" r="0.8" fill="white" />

        {/* Eye Right */}
        <circle cx="37" cy="19" r="3.5" fill="white" />
        <circle cx="38" cy="19" r="2" fill="#0f172a" />
        <circle cx="39" cy="18" r="0.8" fill="white" />

        {/* Beak */}
        <ellipse cx="32" cy="26" rx="5" ry="2.5" fill={colors.beak} />
        <path
          d="M27 26 L32 28 L37 26"
          stroke="#c2410c"
          strokeWidth="0.8"
          fill="none"
        />

        {/* Blush */}
        {variant !== 'outline' && (
          <>
            <ellipse cx="22" cy="23" rx="2.5" ry="1.5" fill={colors.blush} opacity="0.5" />
            <ellipse cx="42" cy="23" rx="2.5" ry="1.5" fill={colors.blush} opacity="0.5" />
          </>
        )}

        {/* Wing Left */}
        <ellipse
          cx="15" cy="38" rx="7" ry="9"
          fill={colors.wing}
          transform="rotate(-12, 15, 38)"
          stroke={variant === 'outline' ? stroke : undefined}
          strokeWidth={sw}
        />

        {/* Wing Right */}
        <ellipse
          cx="49" cy="38" rx="7" ry="9"
          fill={colors.wing}
          transform="rotate(12, 49, 38)"
          stroke={variant === 'outline' ? stroke : undefined}
          strokeWidth={sw}
        />

        {/* Feet */}
        <ellipse
          cx="26" cy="53" rx="5" ry="2.5"
          fill={colors.foot}
          stroke={variant === 'outline' ? stroke : undefined}
          strokeWidth={sw}
        />
        <ellipse
          cx="38" cy="53" rx="5" ry="2.5"
          fill={colors.foot}
          stroke={variant === 'outline' ? stroke : undefined}
          strokeWidth={sw}
        />

        {/* Smile */}
        <path
          d="M28 28 Q32 31 36 28"
          stroke="#c2410c"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
