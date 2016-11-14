# hubot-sentry-integration

[![npm version](https://img.shields.io/npm/v/hubot-sentry-integration.svg?style=flat-square)](https://www.npmjs.com/package/hubot-sentry-integration)
[![npm downloads](https://img.shields.io/npm/dm/hubot-sentry-integration.svg?style=flat-square)](https://www.npmjs.com/package/hubot-sentry-integration)
[![Build Status](https://img.shields.io/travis/lgaticaq/hubot-sentry-integration.svg?style=flat-square)](https://travis-ci.org/lgaticaq/hubot-sentry-integration)
[![Coverage Status](https://img.shields.io/coveralls/lgaticaq/hubot-sentry-integration/master.svg?style=flat-square)](https://coveralls.io/github/lgaticaq/hubot-sentry-integration?branch=master)
[![Code Climate](https://img.shields.io/codeclimate/github/lgaticaq/hubot-sentry-integration.svg?style=flat-square)](https://codeclimate.com/github/lgaticaq/hubot-sentry-integration)
[![dependency Status](https://img.shields.io/david/lgaticaq/hubot-sentry-integration.svg?style=flat-square)](https://david-dm.org/lgaticaq/hubot-sentry-integration#info=dependencies)
[![devDependency Status](https://img.shields.io/david/dev/lgaticaq/hubot-sentry-integration.svg?style=flat-square)](https://david-dm.org/lgaticaq/hubot-sentry-integration#info=devDependencies)

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
