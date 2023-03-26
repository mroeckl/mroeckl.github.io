import code from "@lekoarts/gatsby-theme-minimal-blog/src/styles/code";

export default {
  ...code,
  ".prism-code": {
    fontSize: [1, 1, 1],
    webkitOverflowScrolling: `touch`,
    backgroundColor: `transparent`,
    minWidth: `100%`,
    mb: 0,
    mt: 0,
    overflow: `auto`,
    '&[data-linenumber="false"]': {
      ".token-line": {
        pl: 3,
      },
    },
  },
};
