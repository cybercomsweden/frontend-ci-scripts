# frontend-ci-scripts

- [Install package](#install)
- [Add proxy to development](#proxy)

<a name="install"></a>

## Install

While unstable the only way to install is the following

```
npm install --save-dev cybercomsweden/frontend-ci-scripts
```

## Usage

There are a few scripts exposed to help you with your development

- lint / runs eslint on your project
- format / run prettier on your project
- test / runs jest on test files in src with \*.spec|test.js or in the \_\_test\_\_ folder
- precommit / runs lint, test and format as a precommit hook
- start / a webpack-dev-server for quicker react development

## Format

```
"format": "frontend-ci-scripts format"
```

format runs prettier in the background and formats all your files.
You can send args to prettier if you want to format any specific files by adding them to the scripts

```
"format": "frontend-ci-scripts format src/**/*"
```

_To be noted_
On unix systems you need to prevent the glob from being prematurly evaluated do this by putting it in ''

```
"format": "frontend-ci-scripts format 'src/**/*'"
```

## Precommit

During installation git hooks is setup for you.
add the following script to your package.json for it to run during each commit

```
"precommit": "frontend-ci-scripts precommit",
```

## Editor Integration

ESLint integrations: https://eslint.org/docs/user-guide/integrations

Prettier integrations: https://prettier.io/docs/en/editors.html

You can expose our option files to your editor by adding them to your package.json

---

```
"eslintConfig": {
    "extends": "./node_modules/frontend-ci-scripts/.eslintrc.js"
  }
```

or add your own .eslintrc file and extend the path above

---

For Prettier create a .prettierrc.js and add the following

```
module.exports = require('frontend-ci-scripts/.prettierrc');
```

<a name="proxy"></a>

## Proxy

In development you sometimes need to proxy request

Do this by adding a proxy key to you package.json

```
"proxy": "[dependencieName]" || "path/to/proxy",
```

It expects a js object or json file.

## Mocks

If webpack needs to serve mock pages, add a `mocks` key to package.json.

```
"mocks": "path/to/mocks",
```

It expects a path to a directory (should be relative to the project root).

## Production Build

### Public Path

If an environment variable `PUBLIC_PATH` is set, the webpack build will use that. Otherwise it defaults to '/'.
