// 1. Import the extendTheme function
import { extendTheme, theme as base } from "@chakra-ui/react";
const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

export default extendTheme({
  fonts: {
    // heading: `'Oswald', ${base.fonts?.heading}`,
    // body: `'Oswald', ${base.fonts?.body}`,
  },
  config: {
    ...config,
    colors: {
      black: "#000000", // "#131416",
      white: "#FFFFFF",
    },
  },
});
