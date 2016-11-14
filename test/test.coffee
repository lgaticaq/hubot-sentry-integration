path = require("path")
Helper = require("hubot-test-helper")
expect = require("chai").expect
http = require("http")
querystring = require("querystring")
nock = require("nock")

helper = new Helper("./../src/index.coffee")

describe "hubot-sentry", ->
  beforeEach ->
    @room = helper.createRoom()
    @room.robot.adapter.client =
      rtm:
        dataStore:
          getChannelByName: (to) ->
            channels =
              "#general": {id: "R00000001", name: "general"}
            return channels[to]
  afterEach ->
    @room.destroy()

  context "POST /sentry", ->
    beforeEach (done) ->
      @room.robot.adapter.client.web =
        chat:
          postMessage: (channel, text, options) =>
            @postMessage =
              channel: channel
              text: text
              options: options
            done()
      postData = querystring.stringify
        payload: JSON.stringify
          parse: "none"
          username: "Sentry"
          attachments: [
            color: "#f43f20"
            fields: [
              short: true
              value: "Escaleno visto-bueno"
              title: "Project"
            ]
            fallback: "[Escaleno visto-bueno] Hola mundo"
            title_link: "https://sentry.io/escaleno/visto-bueno/issues" +
            "/180903558/"
            title: "Hola mundo"
          ]
          channel: "#visto-bueno"
      postOptions =
        hostname: "localhost"
        port: 8080
        path: "/sentry"
        method: "POST"
        headers:
          "Content-Type": "application/x-www-form-urlencoded"
          "Content-Length": Buffer.byteLength(postData)
      req = http.request postOptions, (@response) => done()
      req.write(postData)
      req.end()

    it "responds with status 200 and results", ->
      expect(@postMessage.options.parse).to.eql "none"
      expect(@postMessage.options.username).to.eql "Sentry"
      expect(@postMessage.options.attachments).to.eql [
        color: "#f43f20"
        fields: [
          short: true
          value: "Escaleno visto-bueno"
          title: "Project"
        ]
        fallback: "[Escaleno visto-bueno] Hola mundo"
        title_link: "https://sentry.io/escaleno/visto-bueno/issues/180903558/"
        title: "Hola mundo"
      ]
      expect(@postMessage.options.channel).to.eql "#visto-bueno"

  context "POST /sentry without channel", ->
    beforeEach (done) ->
      @room.robot.adapter.client.web =
        chat:
          postMessage: (channel, text, options) =>
            @postMessage =
              channel: channel
              text: text
              options: options
            done()
      postData = querystring.stringify
        payload: JSON.stringify
          parse: "none"
          username: "Sentry"
          attachments: [
            color: "#f43f20"
            fields: [
              short: true
              value: "Escaleno visto-bueno"
              title: "Project"
            ]
            fallback: "[Escaleno visto-bueno] Hola mundo"
            title_link: "https://sentry.io/escaleno/visto-bueno/issues" +
            "/180903558/"
            title: "Hola mundo"
          ]
      postOptions =
        hostname: "localhost"
        port: 8080
        path: "/sentry"
        method: "POST"
        headers:
          "Content-Type": "application/x-www-form-urlencoded"
          "Content-Length": Buffer.byteLength(postData)
      req = http.request postOptions, (@response) => done()
      req.write(postData)
      req.end()

    it "responds with status 200 and results", ->
      expect(@postMessage.options.parse).to.eql "none"
      expect(@postMessage.options.username).to.eql "Sentry"
      expect(@postMessage.options.attachments).to.eql [
        color: "#f43f20"
        fields: [
          short: true
          value: "Escaleno visto-bueno"
          title: "Project"
        ]
        fallback: "[Escaleno visto-bueno] Hola mundo"
        title_link: "https://sentry.io/escaleno/visto-bueno/issues/180903558/"
        title: "Hola mundo"
      ]
      expect(@postMessage.options.channel).to.eql "general"
