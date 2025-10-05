export interface BreathingColor {
  r: number
  g: number
  b: number
}

export const colors: BreathingColor[] = [
  { r: 99, g: 46, b: 115 }, // Purple #632E73
  { r: 30, g: 111, b: 35 }, // Green #1E6F23
  { r: 47, g: 83, b: 132 } // Blue #2F5384
]

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export interface AnimationState {
  colorIndex: number
  breathProgress: number
  breathDirection: number
  chaosOffset: number
}

export interface AnimatedColor {
  r: number
  g: number
  b: number
  opacity: number
  xPos: number
  yPos: number
}

export function calculateCurrentColor(state: AnimationState): AnimatedColor {
  const currentColor = colors[state.colorIndex]
  const nextColor = colors[(state.colorIndex + 1) % colors.length]
  const transitionPhase = Math.max(0, (state.breathProgress - 0.7) / 0.3)

  const r = lerp(currentColor.r, nextColor.r, transitionPhase)
  const g = lerp(currentColor.g, nextColor.g, transitionPhase)
  const b = lerp(currentColor.b, nextColor.b, transitionPhase)

  // Breathing opacity: oscillate between 0.2 and 0.5 with sine easing
  const breathEase = Math.sin(state.breathProgress * Math.PI)
  const opacity = 0.2 + breathEase * 0.3

  // Add some chaos to the movement with secondary waves
  const chaosX = Math.sin(state.chaosOffset * 2.3) * 15
  const chaosY = Math.cos(state.chaosOffset * 1.7) * 10

  // Moving gradient position - left to right with chaos
  const xPos = 20 + breathEase * 60 + chaosX // moves from 20% to 80% with variation
  const yPos = 50 + chaosY // oscillates around center

  return { r, g, b, opacity, xPos, yPos }
}

export function updateAnimationState(
  state: AnimationState,
  delta: number
): AnimationState {
  const newState = { ...state }

  // Breathing: 0.3 = ~3.3 seconds per breath cycle
  newState.breathProgress += delta * 0.3 * newState.breathDirection

  // Update chaos offset at different speed
  newState.chaosOffset += delta * 0.8

  if (newState.breathProgress >= 1) {
    newState.breathProgress = 1
    newState.breathDirection = -1
  } else if (newState.breathProgress <= 0) {
    newState.breathProgress = 0
    newState.breathDirection = 1
    newState.colorIndex = (newState.colorIndex + 1) % colors.length
  }

  return newState
}

export function getCSSVariables(color: AnimatedColor): string {
  return `
    --breath-r: ${color.r};
    --breath-g: ${color.g};
    --breath-b: ${color.b};
    --breath-opacity: ${color.opacity};
    --breath-x: ${color.xPos}%;
    --breath-y: ${color.yPos}%;
  `
}
