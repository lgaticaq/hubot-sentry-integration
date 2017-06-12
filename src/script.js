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

const iconUrl = 'https://a.slack-edge.com/66f9/img/services/sentry_36.png'

module.exports = robot => {
  robot.router.post('/sentry', (req, res) => {
    res.send('ok')
    if (['SlackBot', 'Room'].includes(robot.adapter.constructor.name)) {
      const options = JSON.parse(req.body.payload)
      options.as_user = false
      options.icon_url = iconUrl
      if (!options.hasOwnProperty('channel')) {
        const channelName = process.env.SENTRY_CHANNEL || '#general'
        const channel = robot.adapter.client.rtm.dataStore.getChannelByName(
          channelName
        )
        options.channel = channel.name
      }
      robot.adapter.client.web.chat.postMessage(options.channel, null, options)
    }
  })
}
