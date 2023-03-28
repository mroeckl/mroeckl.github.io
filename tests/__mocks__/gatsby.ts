import React from "react";
const gatsby = jest.requireActual("gatsby");

jest.mock("theme-ui", () => {
  const originalModule = jest.requireActual("theme-ui");
  return {
    __esModule: true,
    ...originalModule,
    useColorMode: jest.fn(() => "light"),
  };
});

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
      site: {
        siteMetadata: {
          siteTitle: `test-title`,
          siteTitleAlt: `test-titlealt`,
          siteHeadline: `test-headline`,
          siteUrl: `test-url`,
          siteDescription: `test-description`,
          siteImage: `test-image`,
          siteLanguage: `en`,
          author: `test-author`,
        },
      },
      minimalBlogConfig: {
        navigation: [
          {
            title: `test-nav-title`,
            slug: `test-nav-slug`,
          },
        ],
        externalLinks: [
          {
            name: `test-link-name`,
            url: `test-link-url`,
          },
        ],
      },
    };
  }),
};
