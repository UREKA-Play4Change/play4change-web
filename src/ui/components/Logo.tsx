interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-5xl',
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  return (
    <span className={`font-display font-extrabold tracking-tight ${sizeMap[size]} ${className}`}>
      <span className="text-blue-600">Play</span>
      <span className="text-green-500">4</span>
      <span className="text-blue-600">Change</span>
    </span>
  )
}
