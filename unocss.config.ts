import { defineConfig } from 'unocss'

// Presets
// https://unocss.dev/presets/
import PresetAttributify from '@unocss/preset-attributify'
import PresetIcons from '@unocss/preset-icons'
import PresetTypography from '@unocss/preset-typography'
import PresetUno from '@unocss/preset-uno'
import PresetWebFonts from '@unocss/preset-web-fonts'

// Transformers
// https://unocss.dev/presets/
//   NOTE: Transformers has no page
import TransformerDirectives from '@unocss/transformer-directives'

import { range } from './code/utils/range'

interface FontOptions {
  italic?: boolean
  weights?: number[]
}

const font = (name: string, options?: FontOptions) => {
  const { italic, weights } = { ...{ italic: true, weights: range(100, 900, { step: 100 }) }, ...options }
  return { name, italic, weights }
}

// https://unocss.dev/config/
export default defineConfig({
  presets: [
    PresetAttributify({
    }),
    PresetIcons({
      prefix: 'i-',
      scale: 1.2,
      warn: true,
    }),
    PresetTypography({
      selectorName: 'prose',
    }),
    PresetUno({
      /* Inherits: @unocss/preset-wind, @unocss/preset-mini */
    }),
    PresetWebFonts({
      fonts: {
        inter: font('Inter'),
        code: font('Fira Code'),
        mono: font('Source Code Pro'),
        sans: font('DM Sans'),
      },
    }),
  ],
  rules: [
    // PERCENT: Margins
    [/^m-block-(\d+)p$/, ([, percent]) => ({ 'margin-block': `${percent}%` })],
    [/^m-block-s-(\d+)p$/, ([, percent]) => ({ 'margin-block-start': `${percent}%` })],
    [/^m-block-e-(\d+)p$/, ([, percent]) => ({ 'margin-block-end': `${percent}%` })],

    [/^m-inline-(\d+)p$/, ([, percent]) => ({ 'margin-inline': `${percent}%` })],
    [/^m-inline-s-(\d+)p$/, ([, percent]) => ({ 'margin-inline-start': `${percent}%` })],
    [/^m-inline-e-(\d+)p$/, ([, percent]) => ({ 'margin-inline-end': `${percent}%` })],

    [/^m-(\d+)p$/, ([, percent]) => ({ margin: `${percent}%` })],

    [/^ml-(\d+)p$/, ([, percent]) => ({ 'margin-left': `${percent}%` })],
    [/^mr-(\d+)p$/, ([, percent]) => ({ 'margin-right': `${percent}%` })],
    [/^mt-(\d+)p$/, ([, percent]) => ({ 'margin-top': `${percent}%` })],
    [/^mb-(\d+)p$/, ([, percent]) => ({ 'margin-bottom': `${percent}%` })],
  ],
  transformers: [
    TransformerDirectives({
    }),
  ],
})
