export type LogoType = 'ascii' | 'devthink' | 'minimal';

export function useSettings() {
  const [logoType, setLogoType] = useState<LogoType>('devthink');
  const [logoAnimated, setLogoAnimated] = useState(true);
  return { logoType, setLogoType, logoAnimated, setLogoAnimated };
}