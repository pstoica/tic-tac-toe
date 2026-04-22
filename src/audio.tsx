import { createContext, use, useMemo, type ReactNode } from 'react';
import { SoundProvider, usePatch } from '@web-kits/audio/react';
import type { SoundPatch } from '@web-kits/audio';
import crispPatch from '../.web-kits/crisp.json';

/* Thin wrapper over @web-kits/audio so the rest of the app doesn't have to
   know which patch / sound name backs each event. The patch is loaded once
   at the provider and exposed as named triggers; consumers just call
   sounds.place() / sounds.win() / sounds.lose(). */

export interface GameSounds {
  place: () => void;
  win: () => void;
  lose: () => void;
}

const NOOP: GameSounds = {
  place: () => {},
  win: () => {},
  lose: () => {},
};

const GameSoundsContext = createContext<GameSounds>(NOOP);

function SoundsInner({ children }: { children: ReactNode }) {
  // cast: the JSON shape matches SoundPatch but TS sees it as a plain object
  const patch = usePatch(crispPatch as unknown as SoundPatch);

  const value = useMemo<GameSounds>(
    () => ({
      place: () => {
        if (patch.ready) patch.play('swoosh');
      },
      win: () => {
        if (patch.ready) patch.play('success');
      },
      lose: () => {
        if (patch.ready) patch.play('error');
      },
    }),
    [patch],
  );

  return <GameSoundsContext value={value}>{children}</GameSoundsContext>;
}

export function GameSoundsProvider({ children }: { children: ReactNode }) {
  return (
    <SoundProvider volume={0.55}>
      <SoundsInner>{children}</SoundsInner>
    </SoundProvider>
  );
}

// co-located with the provider because it reads the same context; splitting
// just to placate react-refresh adds more noise than the HMR cost saves.
// eslint-disable-next-line react-refresh/only-export-components
export function useGameSounds(): GameSounds {
  return use(GameSoundsContext);
}
