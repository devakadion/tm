import { useState, useCallback } from 'react';

export type LogoType = 'ascii' | 'devthink' | 'minimal';

const STORAGE_KEY = 'devthink-settings-v1';

interface SettingsState {
  logoType: LogoType;
  logoAnimated: boolean;
}

function loadSettings(): SettingsState {
  if (typeof window === 'undefined') {
    return { logoType: 'devthink', logoAnimated: true };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { logoType: 'devthink', logoAnimated: true };
    return JSON.parse(raw) as SettingsState;
  } catch {
    return { logoType: 'devthink', logoAnimated: true };
  }
}

function saveSettings(settings: SettingsState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

export function useSettings() {
  const [logoType, setLogoTypeState] = useState<LogoType>(loadSettings().logoType);
  const [logoAnimated, setLogoAnimatedState] = useState<boolean>(loadSettings().logoAnimated);

  const setLogoType = useCallback((type: LogoType) => {
    setLogoTypeState((prev) => {
      const next = { ...loadSettings(), logoType: type };
      saveSettings(next);
      return type;
    });
  }, []);

  const setLogoAnimated = useCallback((value: boolean) => {
    setLogoAnimatedState((prev) => {
      const next = { ...loadSettings(), logoAnimated: value };
      saveSettings(next);
      return value;
    });
  }, []);

  return {
    logoType,
    setLogoType,
    logoAnimated,
    setLogoAnimated,
  };
}