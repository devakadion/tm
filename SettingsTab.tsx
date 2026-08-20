import { Label } from '@/components/ui/label';
import { LogoType } from '@/hooks/useSettings';
import { Logo } from '@/components/Logo';

interface SettingsTabProps {
  logoType: LogoType;
  setLogoType: (type: LogoType) => void;
  logoAnimated: boolean;
  setLogoAnimated: (value: boolean) => void;
}

export function SettingsTab({
  logoType,
  setLogoType,
  logoAnimated,
  setLogoAnimated,
}: SettingsTabProps) {
  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-6 border-b border-stone-800 pb-3">
        <h2 className="font-mono text-lg font-semibold text-orange-400">settings</h2>
        <p className="text-xs text-stone-500">customize the workspace look</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col border border-stone-800 bg-stone-900">
          <div className="border-b border-stone-800 px-4 py-2 font-mono text-xs text-stone-500">
            preview
          </div>
          <div className="flex flex-1 items-center justify-center py-12">
            <Logo type={logoType} animated={logoAnimated} />
          </div>
        </div>

        <div className="flex flex-col border border-stone-800 bg-stone-900">
          <div className="border-b border-stone-800 px-4 py-2 font-mono text-xs text-stone-500">
            options
          </div>
          <div className="space-y-6 p-4">
            <div className="space-y-3">
              <Label className="text-xs font-medium text-stone-400">logo type</Label>
              <div className="flex flex-wrap gap-2">
                {(['ascii', 'devthink', 'minimal'] as LogoType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setLogoType(type)}
                    className={`border px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition active:scale-95 ${
                      logoType === type
                        ? 'border-orange-700 bg-orange-700 text-white'
                        : 'border-stone-700 bg-stone-800 text-stone-400 hover:border-stone-600 hover:text-stone-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-stone-800 pt-6">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-stone-400">animated logo</Label>
                <p className="text-[10px] text-stone-600">toggle a subtle glow pulse</p>
              </div>
              <button
                onClick={() => setLogoAnimated(!logoAnimated)}
                className={`relative h-6 w-11 transition ${
                  logoAnimated ? 'bg-orange-700' : 'bg-stone-700'
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 bg-white transition ${
                    logoAnimated ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}