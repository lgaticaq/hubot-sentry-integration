# Description
#   Clone sentry integration with slack
#
# Dependencies:
#   None
#
# Configuration:
#   SENTRY_CHANNEL
#
# Commands:
#   None
#
# Author:
#   lgaticaq

icon_url = "https://a.slack-edge.com/66f9/img/services/sentry_36.png"
module.exports = (robot) ->
  robot.router.post "/sentry", (req, res) ->
    getChannelByName = robot.adapter.client.rtm.dataStore.getChannelByName
    options = JSON.parse(req.body.payload)
    options.as_user = false
    options.icon_url = icon_url
    unless options.hasOwnProperty("channel")
      channelName = process.env.SENTRY_CHANNEL or "#general"
      channel = getChannelByName(channelName)
      options.channel = channel.name
    robot.adapter.client.web.chat.postMessage options.channel, null, options
