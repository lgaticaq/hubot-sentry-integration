// Description
//   Clone sentry integration with slack
//
// Dependencies:
//   None
//
// Configuration:
//   SENTRY_CHANNEL
//
// Commands:
//   None
//
// Author:
//   lgaticaq

'use strict'

module.exports = robot => {
  robot.router.post('/sentry/:room', (req, res) => {
    res.send('ok')
    if (['SlackBot', 'Room'].includes(robot.adapter.constructor.name)) {
      const levels = new Map([
        ['debug', '#fbe14f'],
        ['info', '#2788ce'],
        ['warning', '#f18500'],
        ['error', '#E03E2F'],
        ['fatal', '#d20f2a'],
      ])
      const options = {
        as_user: false,
        link_names: 1,
        icon_url: 'https://avatars3.githubusercontent.com/u/1396951?s=200&v=4',
        username: 'Sentry',
        unfurl_links: false,
        attachments: [{
          title: req.body.message,
          title_url: req.body.url,
          text: req.body.culprit,
          color: levels.has(req.body.level) ? levels.get(req.body.level) : levels.get('error'),
          footer: `${req.body.project_slug} via Send a notification for new issues`,
          footer_icon: 'https://raw.githubusercontent.com/getsentry/sentry/master/src/sentry/static/sentry/images/sentry-email-avatar.png',
          ts: req.body.event.timestamp
        }]
      }
      const channel = robot.adapter.client.rtm.dataStore.getChannelByName(room)
      options.channel = channel ? channel.name : process.env.SENTRY_CHANNEL || '#general'
      robot.adapter.client.web.chat.postMessage(options.channel, null, options)
    }
  })
}
