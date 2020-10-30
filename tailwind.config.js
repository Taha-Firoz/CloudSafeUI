// const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./src/**/*.svelte"],
  theme: {
    borderWidth: {
      default: '1px',
      '0': '0',
      '2': '2px',
      '4': '4px',
      '8': '8px',
    },
    extend: {
      colors: {
        cablue:{
          '50':'#4589ff',
          '60':'#0f62fe',
          '70':'#0043ce',
        },
        carbon: {
          '70':"#525252",
          '80':'#393939',
          '90': '#262626',
          '100': '#161616',
        }
      },
      fontFamily: {
        sans: ['Roboto'],
      },
      height: theme => ({
        "screen/2": "50vh",
        "screen-2/3": "calc(100vh * 2 / 3)",
        "screen-3/4": "calc(100vh * 3 / 4)",
        "screen/3": "calc(100vh / 3)",
        "screen/4": "calc(100vh / 4)",
        "screen/5": "calc(100vh / 5)",
      }),
    },
  },
  corePlugins: {
    borderColor: true,
  },
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'group-hover'],
  },
  plugins: [],
};