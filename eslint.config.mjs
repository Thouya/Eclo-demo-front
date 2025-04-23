// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
    // existing configuration
    rules: {
      // other rules
      "vue/html-self-closing": ["error", {
        "html": {
          "void": "any", // Allow self-closing on void elements like <img />
          "normal": "never",
          "component": "always"
        }
      }]
    }

)
