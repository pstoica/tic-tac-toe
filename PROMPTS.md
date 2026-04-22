# Prompt Log

A running log of prompts supplied during this interview-project build.

---

## Prompt 1 — 2026-04-21

> track the prompts i'm supplying.
> we'll be doing a react webapp for tictactoe as part of an interview process. client-side focus with just a CPU is fine, but we should be able to easily add turn-by-turn 2 player.
> it should feel professional (including code quality) and engaging.
> use a library a la anime.js to create animations across key interactions.
> i'm thinking a variety of geometric, staggered/instanced animations when playing.
> thematically i'm imagining dark with rainbow pastel. the instanced animations should play slide through the color spectrum to give depth.
> when connection, i'm thinking an eased slash starting from a midpoint or maybe an end to connect all marks.
> track wins/losses over time. end the screen with a mario-style animation (shaking letters for bad, something more harmonious for good). make it enticing to replay with an easy access button.

---

## Prompt 2 — 2026-04-21

> consider oklch as well.
> i like the difficulty idea, should probably start with that as a question and make it possible to change when replaying.
> good call on SVG and stroke-dash.

---

## Prompt 3 — 2026-04-21

> so far feels way too generically vibecoded. go for more of a slightly melee/kirby air ride design.
> fewer gradients (these also look gray in between), go for more solid colors shifting through hues.
> dont write "interview build," dont make this feel like a web app in terms of layout. i was thinking pretty simple and centered, closer to a mobile version.

---

## Prompt 4 — 2026-04-21

> thoughts on the container/border, should we keep it?
> i want the "you lose" shake to feel more vertical and wonky
> the colors in the track aren't super clear, i would consider yellow for draw?
> also "Turn X" isnt obvious it's your turn etc.

---

## Prompt 5 — 2026-04-21

> you missed the padding on the "Your Turn."
>
> also the rainbow boxes.. that's not what i wanted. i was actually not initially suggesting stroke-based animations. i was saying when you place something, you should draw tracers/trails of the shape with varying effects like rotation, scale, etc. like geometric art.

---

## Prompt 6 — 2026-04-21

> what is this dark hover state on the difficulty buttons? the animation is also far too slow. i dont think we need descriptions for difficulty either, it should still feel more game-forward.
> also i was wrong about the yellow. perhaps we do use a symbol W/L/- or something. thoughts on history legibility?
> and not sure why the dots btwn tic-tac-toe are vertically at the top.

---

## Prompt 7 — 2026-04-22

> the animations when placing are on the right path but i was expecting them to shrink down to the midpoint and to have more staggering, like fewer in-between frames, more rotation, etc. we also aren't doing variations. 3d rotations would also be great, for example. unless you feel offset animations are more clear. we could do the 3d rotations when highlighting the match, or just only do offsets. im undecided until i see it i guess.

---

## Prompt 8 — 2026-04-22

> the ghosts are all over the place. think a simple LERP trail. like the iphone faceid animation. you're sampling frames across like 0-360 degrees of rotation, for example. size 1 down to 0, etc.

---

## Prompt 9 — 2026-04-22

> but the rotation on the Z plane is still going like 90 degrees at a time, i'm thinking like gradually knurling

---

## Prompt 10 — 2026-04-22

> still no gap above "Your Turn" , the X in the badge is misaligned. could use D for draw.

---

## Prompt 11 — 2026-04-22

> lets try some slight 3d rotation again, the curve can be just slight movement. i think i just want a bit more variety in these animations. also noticed the O is doing path animation but not X. lets try it on X too. im also wondering if it would feel better to actually grow and then draw the shape

---

## Prompt 12 — 2026-04-22

> when the game is ending, it briefly hides "Your Turn" which causes a layout shift. can we prevent this?
> then the X/O badge doesn't feel optically aligned with the border radius, shouldnt we shift it left a bit like with a negative margin?
> also wondering if we should do any typography adjustments for the history row. the W 3/L 9/D 4 dont feel grouped, it looks more like each character is spaced with the same amount.

---

## Prompt 13 — 2026-04-22

> the X offset animation is weird because both start from the top, i think diagonal would look better

---

## Prompt 14 — 2026-04-22

> and im not seeing any 3d rotation?

---

## Prompt 15 — 2026-04-22

> you're drawing the X starting from the top left and bottom left. im starting to think the offset animation doesnt look good with the ghosting anyway. lets focus on making the ghosting look better. im still seeing no 3d rotation or variation.
>
> also start committing to git.

---

## Prompt 16 — 2026-04-22

> i'm not seeing any variation, it's always along the same curves.
>
> there's still some layout shift from when we're starting the game. the header should feel more fixed, the body can go more below the centerfold.
>
> let's also provide a way to reset history.
>
> and let's make the difficulty selection feel more like a list of cards with stars, maintaining characterful type (e.g. wonky random rotation)
