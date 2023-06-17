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
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
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
