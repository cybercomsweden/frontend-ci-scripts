# frontend-ci-scripts

## Install

While unstable the only way to install is the following

```
npm install --save-dev https://github.com/cybercomsweden/frontend-ci-scripts.git
```

## Usage

There are a few scripts exposed to help you with your development

- lint / runs eslint on your project
- format / run prettier on your project
- test / runs jest on test files in src with \*.spec|test.js or in the \_\_test\_\_ folder
- precommit / runs lint, test and format as a precommit hook
- start / a webpackdev server for quicker react development

## Precommit

During installation git hooks is setup for you.
add the following script to your package.json for it to run during each commit

```
"precommit": "quality-scripts precommit",
```

## Editor Integration

ESLint integrations: https://eslint.org/docs/user-guide/integrations
Prettier integrations: https://prettier.io/docs/en/editors.html

You can expose our option files to your editor by adding them to your package.json

```
"eslintConfig": {
    "extends": "./node_modules/frontend-ci-scripts/src/config/eslintrc.js"
  }
```
