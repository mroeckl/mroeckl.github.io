import code from "@lekoarts/gatsby-theme-minimal-blog/src/styles/code";

export default {
  ...code,
  'div[class~="gatsby-highlight"]': {
    margin: `0`,
  },
  ".code-content": {
    fontSize: `0.7em`,
    padding: `2rem 1rem 1rem 1rem`,
    color: `plain-color`,
    backgroundColor: `plain-backgroundColor`,
  },
};
