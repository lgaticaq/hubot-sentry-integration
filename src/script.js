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

/**
 * @typedef {import('./types').SlackRobot} Robot
 * @typedef {import('./types').PostMessageOptions} PostMessageOptions
 */
// eslint-disable-next-line jsdoc/require-example
/**
 * @param {Robot} robot -
 * @returns {void} -
 */
module.exports = robot => {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  robot.router.post('/sentry/:room', async (req, res) => {
    res.send('ok')
    try {
      if (['SlackBot', 'Room'].includes(robot.adapter.constructor.name)) {
        const levels = new Map([
          ['debug', '#fbe14f'],
          ['info', '#2788ce'],
          ['warning', '#f18500'],
          ['error', '#E03E2F'],
          ['fatal', '#d20f2a']
        ])
        let title = req.body.culprit
        let text = ''
        let footer = `${req.body.project_slug} via Send a notification for new issues`
        if (
          req.body.event.exception &&
          Array.isArray(req.body.event.exception.values) &&
          req.body.event.exception.values.length > 0
        ) {
          const exception = req.body.event.exception.values[0]
          title = `${exception.type} - ${req.body.event.culprit}`
          text = exception.value
        }
        if (
          Array.isArray(req.body.triggering_rules) &&
          req.body.triggering_rules.length > 0
        ) {
          footer = `${req.body.project_slug} via ${req.body.triggering_rules[0]}`
        }
        /** @type {PostMessageOptions} */
        const options = {
          as_user: false,
          link_names: 1,
          icon_url:
            'https://avatars3.githubusercontent.com/u/1396951?s=200&v=4',
          username: 'Sentry',
          unfurl_links: false,
          attachments: [
            {
              title,
              title_link: req.body.url,
              text,
              color: levels.has(req.body.level)
                ? levels.get(req.body.level)
                : levels.get('error'),
              footer,
              footer_icon:
                'https://raw.githubusercontent.com/getsentry/sentry/master/src/sentry/static/sentry/images/sentry-email-avatar.png',
              ts: req.body.event.timestamp
            }
          ]
        }
        let channelName = process.env.SENTRY_CHANNEL || '#eva-dev'
        const response = await robot.adapter.client.web.conversations.list({
          exclude_archived: true,
          types: 'public_channel'
        })
        if (response.ok) {
          const channel = response.channels.find(
            ({ name }) => name === req.params.room
          )
          if (channel) {
            channelName = channel.name
          } else {
            robot.logger.warning(`Channel "${req.params.room}" not found.`)
          }
        } else {
          robot.logger.warning(
            `Fail get channels with error: ${response.error}.`
          )
        }
        await robot.adapter.client.web.chat.postMessage(
          channelName,
          null,
          options
        )
      }
    } catch (err) {
      robot.emit('error', err, res)
    }
  })
}
