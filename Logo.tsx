import { motion } from 'framer-motion';
import { LogoType } from '@/hooks/useSettings';

const ASCII_LOGO = [
  ' ██████╗ ███████╗██╗   ██╗████████╗██╗  ██╗██╗███╗   ██╗██╗  ██╗',
  ' ██╔══██╗██╔════╝██║   ██║╚══██╔══╝██║  ██║██║████╗  ██║██║ ██╔╝',
  ' ██║  ██║█████╗  ██║   ██║   ██║   ███████║██║██╔██╗ ██║█████╔╝ ',
  ' ██║  ██║██╔══╝  ╚██╗ ██╔╝   ██║   ██╔══██║██║██║╚██╗██║██╔═██╗ ',
  ' ██████╔╝███████╗ ╚████╔╝    ██║   ██║  ██║██║██║ ╚████║██║  ██╗',
  ' ╚═════╝ ╚══════╝  ╚═══╝     ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝',
];

const HALF_LOGO = ASCII_LOGO.slice(0, 3);

interface LogoProps {
  type: LogoType;
  animated: boolean;
  half?: boolean;
}

export function Logo({ type, animated, half }: LogoProps) {
  const animatedClass = animated ? 'logo-animated' : '';

  if (type === 'ascii') {
    const rows = half ? HALF_LOGO : ASCII_LOGO;
    return (
      <div className={`no-scrollbar overflow-x-auto whitespace-pre font-mono text-[8px] leading-none text-orange-500 sm:text-[10px] ${animatedClass}`}>
        {rows.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
          >
            {row}
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'devthink') {
    return (
      <div
        className={`font-mono font-bold tracking-tighter text-orange-500 ${animatedClass} ${half ? 'text-5xl' : 'text-7xl sm:text-8xl'}`}
        style={{ textShadow: '5px 5px 0px #7c2d12' }}
      >
        DEVTHINK
      </div>
    );
  }

  return (
    <div className={`font-mono font-semibold tracking-widest text-orange-500 ${animatedClass} ${half ? 'text-3xl opacity-50' : 'text-5xl'}`}>
      GEUTHINK
    </div>
  );
}