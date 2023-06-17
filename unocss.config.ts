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
  transformers: [
    TransformerDirectives({
    }),
  ],
})
