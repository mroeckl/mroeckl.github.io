import React from "react";
const gatsby = jest.requireActual("gatsby");
import config from "../../gatsby-config";
import type { IPluginRefObject } from "gatsby";

jest.mock("theme-ui", () => {
  const originalModule = jest.requireActual("theme-ui");
  return {
    __esModule: true,
    ...originalModule,
    useColorMode: jest.fn(() => "light"),
  };
});

const THEME_ID = "@lekoarts/gatsby-theme-minimal-blog";
const themePlugin = config?.plugins?.find(
  (plugin): plugin is IPluginRefObject => typeof plugin !== `string` && plugin.resolve === THEME_ID
);

module.exports = {
  ...gatsby,
  graphql: jest.fn(),
  Link: jest.fn().mockImplementation(
    // these props are invalid for an `a` tag
    ({ activeClassName, activeStyle, getProps, innerRef, partiallyActive, ref, replace, to, ...rest }) =>
      React.createElement("a", {
        ...rest,
        href: to,
      })
  ),
  Slice: jest.fn().mockImplementation(({ alias, ...rest }) =>
    React.createElement("div", {
      ...rest,
      "data-test-slice-alias": alias,
    })
  ),
  useStaticQuery: jest.fn().mockImplementation(() => {
    return {
      site: { siteMetadata: config.siteMetadata },
      minimalBlogConfig: themePlugin?.options,
    };
  }),
};
