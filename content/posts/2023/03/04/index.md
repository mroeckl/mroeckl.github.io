---
title: My new Gatsby Blog with Quality built-in
date: 2023-03-05
description: This post explains how to set up a website based on Gatsby with built-in quality.
banner: ./girl-with-red-hat-v1gqBO_IYlM-unsplash_mod.jpg
tags:
  - Gatsby
  - Build Quality In
  - Test Driven Development
---

![Gatsby](./girl-with-red-hat-v1gqBO_IYlM-unsplash_mod.jpg)

After my decision to use [Gatsby](https://www.gatsbyjs.com) for my new blog, now is the time to set it up.
For everyone interested in doing the same, I will try to describe in this blog post in detail the steps I did.

## Setup Gatsby

Setting up a blog with Gatsby could get quite time consuming.
But luckily there are some nice starters for Gatsby like the [gatsby-starter-minimal-blog](https://www.gatsbyjs.com/plugins/@lekoarts/gatsby-theme-minimal-blog/) by [LekoArts](https://www.lekoarts.de/?utm_source=minimal-blog&utm_medium=Theme).
To set it up in a new folder called `blog` and start it, simply run the following commands (you might need to install [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and the [Gatsby CLI](https://www.gatsbyjs.com/docs/reference/gatsby-cli/) first):

```bash
gatsby new blog https://github.com/LekoArts/gatsby-starter-minimal-blog
cd blog
npm start
```

Now open http://localhost:8000/ in your browser, and you will see your new website for the first time with some default content.

That was quick.
Let's start writing the first blog post.

But... wait a second.
Sooner or later we will have many posts and extensive customizations.
With patches and upgrades of Gatsby and its customizations, bugs will be the order of the day.

So, let's first pave a high-quality runway for our posts and customizations.
[Build quality in](https://continuousdelivery.com/principles/#build-quality-in) right from the beginning is the key enabler for successful software projects.

![No so pretty code](./max-chen-lud4OaUCP4Q-unsplash_mod.jpg)

## Static code analysis (incl. formatting) with ESLint and Prettier

Basic programming pitfalls can already be prevented without writing complex tests.
All we need to do is to enable static code analysis like [ESLint](https://eslint.org) on our project and from now on we get useful hints to improve our code for free.

Additionally we use [Prettier](https://prettier.io) to have a consistent format of our files. To install ESLint and Prettier and some more required dependencies, run:

```bash
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-react @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

We only want to lint our own source code. Thus, we have to add a `.eslintignore` in the Gatsby root folder:

```text title=/.eslintignore
node_modules
**/node_modules/**
**/.cache/**
**/build/**
**/public/**
```

And we add a `.eslintrc.js` in the Gatsby root folder to configure ESLint:

```js title=/.eslintrc.js
module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-console": ["error", { allow: ["warn", "error"] }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-var-requires": "off",
    "react/prop-types": ["warn", { skipUndeclared: true }],
  },
};
```

The configuration for Prettier is done in `.prettierrc.js` in the Gatsby root folder:

```js title=/.prettierrc.js
module.exports = {
  printWidth: 120,
  proseWrap: "preserve",
};
```

Finally, we add some scripts to `package.json` by running the following commands:

```bash
npm pkg set scripts.lint="eslint . --ext .ts,.tsx,.js,.jsx"
npm pkg set scripts.lint:fix="npm run lint -- --fix"
npm pkg set scripts.type-check="tsc --noEmit"
```

Now when we change something, e.g. adding some more spaces in front of a line, `npm run lint` will report an issue.
With `npm run lint:fix` ESLint will try to fix the issue, e.g. the previously added spaces get removed.

And never forget to version control your changes.
Version control ensures that you can always revert and trace your changes in the version history.
The Gatsby starter has already set up _git_ and committed the initial state.
Hence, we can directly commit our latest changes:

```bash
git add .
git commit -m "Added static code analysis and code formatting"
```

![Husky](./ferenc-almasi-EWLHA4T-mso-unsplash_mod.jpg)

## Unit Testing with Jest

With respect to _[Test-Driven Development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development)_ we want to get even one step further and write functional tests upfront to new developments.
This approach ensures that our code is actually testable and quality is assured right away.

Let's prepare our unit test infrastructure with [Jest](https://jestjs.io) by installing these dev-dependencies to our project:

```bash
npm install --save-dev jest babel-jest babel-preset-gatsby identity-obj-proxy @types/jest @babel/preset-typescript @testing-library/jest-dom @testing-library/react @testing-library/user-event jest-environment-jsdom
```

The configuration of Jest goes into a file in the Gatsby root folder named `jest.config.js`:

```js title=/jest.config.js withLineNumbers
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setup-test-env.js"],
  transform: {
    "\\.(ts|js)x?$": `<rootDir>/tests/jest-preprocess.js`,
  },
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `<rootDir>/tests/__mocks__/file-mock.js`,
  },
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/public`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby|gatsby-script|gatsby-link|@lekoarts|@mdx-js)/)`],
  globals: {
    __PATH_PREFIX__: ``,
  },
  testEnvironmentOptions: {
    url: `http://localhost`,
  },
  setupFiles: [`<rootDir>/tests/loadershim.js`],
  collectCoverage: true,
  collectCoverageFrom: ["./src/**"],
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: -10 },
  },
};
```

As you can see in line 5, for _.tsx_ and _.jsx_ files a preprocessor is needed:

```js title=/tests/jest-preprocessor.js
const babelOptions = {
  presets: ["babel-preset-gatsby", "@babel/preset-typescript"],
};

module.exports = require("babel-jest").default.createTransformer(babelOptions);
```

A loader shim (line 19) has to be defined in `/tests/loadshim.js`:

```js title=/tests/loadershim.js
global.___loader = {
  enqueue: jest.fn(),
};
```

One more file for the setup:

```js title=/tests/setup-test-env.js
import "@testing-library/jest-dom";
```

And a mocking for static files like images:

```js title=/tests/__mocks__/file-mocks.js
module.exports = "test-file-stub";
```

And one last file to mock gatsby itself:

```js title=/tests/__mocks__/gatsby.ts
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

```

To run Jest, we add one more script to the `package.json`:

```bash
npm pkg set scripts.test="jest"
```

If we now run our tests by executing `npm test`, we will get an error because there is no test defined yet.
So, let's create our first test for our one and only _.tsx_ file which is the error page `/src/pages/404.tsx`:

```tsx title=/src/pages/404.spec.tsx
import React from "react";
import { render } from "@testing-library/react";
import NotFound from "./404";

describe("NotFound", () => {
  it("renders correctly with 404 text", () => {
    const { getByText } = render(<NotFound />);
    expect(getByText(/404/i));
  });
});
```

Now, when we try to run the dummy test with `npm test`, we should see an output like this one:

```bash
 PASS  src/pages/404.spec.tsx
  NotFound
    ✓ renders correctly with 404 text (257 ms)

--------------------------------------------|---------|----------|---------|---------|-------------------
File                                        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------------------------|---------|----------|---------|---------|-------------------
All files                                   |     100 |      100 |     100 |     100 |
 pages                                      |     100 |      100 |     100 |     100 |
  404.tsx                                   |     100 |      100 |     100 |     100 |
--------------------------------------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        4.252 s
Ran all test suites.
```

Yes, the test infrastructure works as expected!

And don't forget to commit the changes:

```bash
git add .
git commit -m "Added unit testing support"
```

![Husky](./daniel-born-I9uUCt-Cgv4-unsplash_mod.jpg)

## Run tests before each commit with Husky

For a successful [Continuous Integration/Delivery](https://continuousdelivery.com) we need to run the unit tests and our static code analysis automatically on each commit.
This can be achieved with [husky]() and [lint-staged](https://github.com/okonet/lint-staged).
While _husky_ makes sure that certain scripts are executed on each commit or push, _lint-staged_ runs the static code analysis only on staged files to reduce the execution time and get feedback faster, i.e. one of the goals of [Continuous Delivery](https://continuousdelivery.com/principles/).

```bash
npm install --save-dev lint-staged
npx husky-init && npm install   # install and setup husky quickly
```

The following two lines configure _lint-staged_ to run _lint:fix_ on code and _prettier_ on configurations and content, and runs _lint-staged_ before finishing a commit.

```
npm pkg set lint-staged='{ "*.{js,jsx,ts,tsx}": [ "npm run lint:fix" ], "{*.{json,md,mdx,yml,yaml}}": [ "npm run prettier --write" ] }' --json
npx husky add .husky/pre-commit "npx lint-staged"
```

Let's commit the changes:

```bash
git add .
git commit -m "Added automated testing to pre-commit"
```

And now with this foundation we are actually good to go with the first posts and customizations.

Let's start writing...

## Links

- https://www.gatsbyjs.com/docs/how-to/testing/unit-testing/
- https://www.gatsbyjs.com/docs/how-to/testing/testing-react-components/
- https://www.gatsbyjs.com/docs/how-to/testing/testing-components-with-graphql

## Images

- Photo by [Max Chen](https://unsplash.com/@maxchen2k?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/formatted?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
- Photo by [Girl with red hat](https://unsplash.com/@girlwithredhat?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/gatsby?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
- Photo by [Ferenc Almasi](https://unsplash.com/@flowforfrank?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/jest?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
- Photo by [Daniel Born](https://unsplash.com/@danborn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/wallpapers/animals/husky?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
