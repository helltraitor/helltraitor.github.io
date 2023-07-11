<script setup lang="ts">
import type { Pausable } from '@vueuse/core'

const canvasElement = ref<HTMLCanvasElement>()
const currentAnimation = ref<Pausable>()

const random = (min = 0, max = 1) => Math.random() * (max - min) + min

const fromPolar = (radius: number, angle: number) => ({
  dx: radius * Math.cos(angle),
  dy: radius * Math.sin(angle),
})

interface StepBackgroundAnimationOptions {
  x: number
  y: number
  angle: number
  length: number
  limit: number
  called: number
  context: CanvasRenderingContext2D
}

type ChainFunction = () => ChainFunction[]

const stepBackgroundAnimation = (options: StepBackgroundAnimationOptions): ChainFunction[] => {
  const { x, y, angle, length, limit, called, context } = options

  if (limit <= 0)
    return []

  const branchLength = length * random(0.5, 1)
  const { dx, dy } = fromPolar(branchLength, angle)

  context.beginPath()
  context.moveTo(x, y)
  context.lineTo(x + dx, y + dy)
  context.stroke()

  const angleLeft = angle + random(0, 0.8) * Math.PI / 9
  const angleRight = angle - random(0, 0.8) * Math.PI / 9

  const commonStep = {
    x: x + dx,
    y: y + dy,
    length,
    limit: limit - branchLength,
    called: called + 1,
    context,
  }

  const leftStep = () => stepBackgroundAnimation({ angle: angleLeft, ...commonStep })
  const rightStep = () => stepBackgroundAnimation({ angle: angleRight, ...commonStep })

  const rate = called < 10 ? 0.8 : 0.5

  const steps = []
  if (random(0, 1) < rate)
    steps.push(leftStep)

  if (random(0, 1) < (steps.length === 0 ? rate : 0.5))
    steps.push(rightStep)

  return steps
}

const frameBackgroundAnimation = (steps: ChainFunction[]): ChainFunction[] => {
  return [...steps.flatMap(step => random(0, 2) < 1 ? step() : step)]
}

const restartBackgroundAnimation = () => {
  if (!canvasElement.value)
    return

  canvasElement.value.height = canvasElement.value.clientHeight
  canvasElement.value.width = canvasElement.value.clientWidth

  const context = canvasElement.value.getContext('2d')
  if (!context)
    return

  context.clearRect(0, 0, canvasElement.value.width, canvasElement.value.height)
  context.lineWidth = 1
  context.strokeStyle = '#88888840'

  let previousTiming = performance.now()

  // SAFE: Initial steps called right after initialization, so any possible values must be defined
  let steps = [
    () => stepBackgroundAnimation({
      x: canvasElement.value!.width * random(0.2, 0.8),
      y: -5,
      angle: Math.PI / 2,
      length: 8,
      limit: canvasElement.value!.height / 2,
      called: 0,
      context,
    }),

    () => stepBackgroundAnimation({
      x: canvasElement.value!.width * random(0.2, 0.8),
      y: canvasElement.value!.height + 5,
      angle: -Math.PI / 2,
      length: 8,
      limit: canvasElement.value!.height / 2,
      called: 0,
      context,
    }),
  ]

  if (canvasElement.value.width > 500) {
    steps.push(
      () => stepBackgroundAnimation({
        x: -5,
        y: canvasElement.value!.height * random(0.2, 0.8),
        angle: 0,
        length: 8,
        limit: canvasElement.value!.width / 3,
        called: 0,
        context,
      }),

      () => stepBackgroundAnimation({
        x: canvasElement.value!.width + 5,
        y: canvasElement.value!.height * random(0.2, 0.8),
        angle: -Math.PI,
        length: 8,
        limit: canvasElement.value!.width / 3,
        called: 0,
        context,
      }),
    )
  }

  currentAnimation.value?.pause()
  currentAnimation.value = useRafFn(() => {
    const currentTiming = performance.now()
    if (currentTiming - previousTiming < 30)
      return

    previousTiming = currentTiming

    steps = frameBackgroundAnimation(steps)
  }, { immediate: true })
  currentAnimation.value.resume()
}

onMounted(() => {
  window.addEventListener('resize', restartBackgroundAnimation)
  restartBackgroundAnimation()
})

onUnmounted(() => {
  window.removeEventListener('resize', restartBackgroundAnimation)
})
</script>

<template>
  <div
    pointer-events-none fixed z--1 h-full w-full opacity-80
    style="
      mask-image: radial-gradient(circle, transparent, black);
      --webkit-mask-image: radial-gradient(circle, transparent, black);
    "
  >
    <canvas ref="canvasElement" h-full w-full />
  </div>
</template>
