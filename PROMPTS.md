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

---

## Prompt 17 — 2026-04-22

> similar optical alignment issue with this X reset button.
>
> for the ghost animations.. lets actually make it feel a bit more like randomly placed collision particles instead of all scaling down to the center.

---

## Prompt 18 — 2026-04-22

> i think we should still constrain the ghosts to the box (no overflow rendering), and perhaps make them all smaller. it's still rendering like the exact same animation each time. if anything we can randomize more of the params instead of running across curves.

---

## Prompt 19 — 2026-04-22

> /btw we should do a smaller gap between the Yes/No buttons

---

## Prompt 20 — 2026-04-22

> i think the ghosts are all too close to the center though, it can be more randomly placed throughout the box since we clip it

---

## Prompt 21 — 2026-04-22

> its not properly clipped to the box, are we scaling ALL nodes when placing down and not just the primary shape?

---

## Prompt 22 — 2026-04-22

> i want to clip it within THIS box, the copies are still able to render outside

---

## Prompt 23 — 2026-04-22

> can you not use overflow: hidden?

---

## Prompt 24 — 2026-04-22

> i really hate the animation on the shapes when 3 are lined. it looks like they all scale towards bottom right, instead of anchoring to the center.

---

## Prompt 25 — 2026-04-22

> this reset button changes the height when it's visible/invisible, the other text has shorter boxes

---

## Prompt 26 — 2026-04-22

> for the board lines, can we do 0 to 300 instead of 10 to 290, and reduce the stroke widths for the lines and boxes

---

## Prompt 27 — 2026-04-22

> i think the green winning dash is a bit thick and could go a bit wider than the shapes?

---

## Prompt 28 — 2026-04-22

> these button hover states are problematic since the bottom shadow isnt interactive and we're animating the offset

---

## Prompt 29 — 2026-04-22

> make the number of ghosts a var i can adjust

---

## Prompt 30 — 2026-04-22

> can we just make a random function with a min.max to make it easier to try diff ranges?

---

## Prompt 31 — 2026-04-22

> feels pretty good. anything we should standardize before submitting? more modular CSS approach so its not in one file, refactoring anything else? do an architectural review and write an outline? commit before continuing.

---

## Prompt 32 — 2026-04-22

> can we make the stats row kinda scroll in the new entry and bump out the oldest one? hard to see the shift right now

---

## Prompt 33 — 2026-04-22

> hmm the width of the whole stats row changes while this is happening

---

## Prompt 34 — 2026-04-22

> no just make the list of stats its own overflow container or use simple virtualization. im expecting fades for the exit and the entrance.

---

## Prompt 35 — 2026-04-22

> this is cutting off the last element.. i also see a brief flicker after the new one slides in

---

## Prompt 36 — 2026-04-22

> the W is cut off, assuming from trying to use mono character widths. consider tabular text or something making them all a tad wider to fit
