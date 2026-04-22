# tictactoe

A single-player tic-tac-toe against a CPU opponent, written as a client-side React app. The aesthetic target was Super Smash Bros. Melee / Kirby Air Ride — chunky shapes, saturated pastels that shift hue in motion rather than through gradients, animations with character. No web chrome.

## Running

```bash
npm install
npm run dev           # http://localhost:5173
npm test              # one-shot vitest run
npm run typecheck     # tsc -b --noEmit
npm run lint          # eslint (react-hooks, typescript-eslint, prettier)
npm run format        # prettier --write .
npm run build         # type-check + production build into dist/
```

Vite 6, React 19, TypeScript strict mode (`noUnusedLocals`, `noUnusedParameters`). Animations via anime.js v4.

## Layout

```
src/
  App.tsx                 phase machine: pick → playing → finished
  main.tsx                entry + global stylesheet
  global.css              palette, resets, stage layout, reduced-motion
  anim.ts                 every anime.js call lives here; components just hand it refs
  audio.tsx               GameSoundsProvider + useGameSounds hook over @web-kits/audio
  components/
    Background.tsx        jittered-grid of drifting X/O shapes behind the stage
    Board.tsx             the 3x3 SVG grid + cell hit-testing
    Brand.tsx             the tic•tac•toe wordmark with the hue wave + calculating flicker
    Button.tsx            shared chunky pressable button (hue / block / ghost variants)
    DifficultyPicker.tsx  hue-always-on cards, press-to-play, no separate Start
    EndScreen.tsx         win/loss/draw overlay with character-specific title animations
    GameSession.tsx       per-game state + Player driver loop
    Mark.tsx              X / O with the ghost-particle trail + winning-trio recolor
    StatsBar.tsx          W/L/D counters and history strip with virtualized scroll
    *.module.css          per-component CSS module
  game/                   pure logic — no React, no DOM
    board.ts              board shape, evaluate, play, available moves
    constants.ts          HUMAN_MARK / CPU_MARK
    minimax.ts            depth-penalized minimax + random fallback
    players.ts            Player interface + Human / CPU implementations
    stats.ts              session counters + localStorage persistence
    types.ts              Board / Mark / Outcome / Difficulty
    __tests__/            vitest coverage for board, minimax, stats
```

## A few decisions worth calling out

**Player abstraction.** Both Human and CPU implement `Player.chooseMove(board, signal): Promise<number>`. The game loop awaits whichever is on the clock and applies the result; the only thing the UI changes between single-player and two-player is whether the `O` player is a `HumanPlayer` or `CpuPlayer`. The `AbortSignal` lets us cancel an in-flight CPU "think" if the player resets mid-turn.

**Animations are centralized.** `anim.ts` owns every anime.js call. Components hand it refs and get back either nothing or a cleanup function. The consequence is that components stay declarative and it's trivial to find/tweak the feel of any single animation.

**CSS modules + a global foundation.** Per-component `.module.css` for everything that's component-specific; `global.css` holds palette variables, resets, the stage layout, and the `prefers-reduced-motion` escape hatch. The shared chunky button is a small `<Button>` component (`hue` / `block` / `ghost` props) so the variant class names don't leak into the two screens that use it.

**Perfect play is actually perfect.** The minimax uses depth-penalized scoring (`WIN - depth` vs `depth - WIN`) so the CPU always takes the quicker win and the slower loss — which matters for the "take the win, don't just block" case. Self-play from the empty board is covered by a test that asserts the result is always a draw.

**Ghost trail, not stroke trace.** Mark placement renders N frozen pose copies of the shape, scattered via `Math.random` inside the cell's clipped viewport, each with its own rotation / 3D tilt / scale / opacity envelope. The primary shape is a separate `<g>` so the grow animation doesn't scale the ghosts past the clip boundary. The 3D foreshortening is real: `perspective` is set on the board, `transform-style: preserve-3d` is inherited down the chain, and the drop-shadow that would otherwise flatten the stacking context sits on the wrapper, not the SVG.

**Layout stability.** The header sits at a fixed top offset and the main area carries a fixed `min-height` sized for the board; swapping picker → game → end screen never shifts anything. The stats pill reserves the reset button's height even when the button is hidden; the stats history strip is a fixed-width overflow container that virtualizes a slot-scroll once you hit 12 entries, with a `flushSync` around the content swap so there's never a frame with the translate reset and the old token still in the DOM.

**Build/test signal.** Game logic, minimax, and the stats reducer are covered by vitest. Tests stay in pure Node (no jsdom) — the stats suite uses a tiny in-memory `localStorage` shim.

**Audio.** Three-event sound layer driven by `@web-kits/audio`'s Crisp patch: `swoosh` when a mark lands (human or CPU), `success` on win, `error` on loss. The Web Audio context is resumed on the first difficulty click (which also plays the first swoosh, so the gesture isn't wasted). Exposed through a small `GameSoundsProvider` / `useGameSounds` pair so the rest of the app doesn't know which patch / sound name backs each event.

## Trade-offs / what I'd pick up next

- No two-player UI yet, but the plumbing is there: pass `HumanPlayer` for both marks in `GameSession`.
- No component-level tests. The game logic is the interesting part to verify; the components are mostly view layer, and testing anime.js-driven animation behavior in jsdom gets expensive fast for thin signal.
- CI isn't wired up — `lint`, `typecheck`, `test`, and `build` all pass locally and would be the four steps I'd put behind PRs.
