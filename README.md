# hubot-sentry-integration

[![npm version](https://img.shields.io/npm/v/hubot-sentry-integration.svg)](https://www.npmjs.com/package/hubot-sentry-integration)
[![npm downloads](https://img.shields.io/npm/dm/hubot-sentry-integration.svg)](https://www.npmjs.com/package/hubot-sentry-integration)
[![Build Status](https://travis-ci.org/lgaticaq/hubot-sentry-integration.svg?branch=master)](https://travis-ci.org/lgaticaq/hubot-sentry-integration)
[![Coverage Status](https://coveralls.io/repos/github/lgaticaq/hubot-sentry-integration/badge.svg?branch=master)](https://coveralls.io/github/lgaticaq/hubot-sentry-integration?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/bdf2bfcea3703bc67963/maintainability)](https://codeclimate.com/github/lgaticaq/hubot-sentry-integration/maintainability)
[![dependency Status](https://img.shields.io/david/lgaticaq/hubot-sentry-integration.svg)](https://david-dm.org/lgaticaq/hubot-sentry-integration#info=dependencies)
[![devDependency Status](https://img.shields.io/david/dev/lgaticaq/hubot-sentry-integration.svg)](https://david-dm.org/lgaticaq/hubot-sentry-integration#info=devDependencies)

> Clone sentry integration with slack

## Install

```bash
npm i -S hubot-sentry-integration
```

Add `["hubot-sentry-integration"]` in `external-scripts.json`.

Set optional `SENTRY_CHANNEL` (default #general) in environment variable to send messages if not channel in payload.

In sentry choice **Slack** integration and set **Webhook URL** as `http://yourbot-url/sentry`

## License

[MIT](https://tldrlegal.com/license/mit-license)
