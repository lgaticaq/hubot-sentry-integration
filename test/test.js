'use strict'

const { describe, beforeEach, afterEach, it } = require('mocha')
const Helper = require('hubot-test-helper')
const { expect } = require('chai')
const http = require('http')

const helper = new Helper('../src/script.js')

describe('hubot-sentry', function () {
  beforeEach(() => {
    this.room = helper.createRoom()
    this.room.robot.adapter.client = {
      rtm: {
        dataStore: {
          getChannelByName: to => {
            const channels = new Map([
              ['general', { id: 'R00000001', name: 'general' }]
            ])
            return channels.get(to)
          }
        }
      }
    }
  })

  afterEach(() => this.room.destroy())

  describe('POST /sentry', () => {
    beforeEach(done => {
      this.room.robot.adapter.client.web = {
        chat: {
          postMessage: (channel, text, options) => {
            this.postMessage = {
              channel: channel,
              text: text,
              options: options
            }
            done()
          }
        }
      }
      const postData = JSON.stringify({
        message: 'This is an example Python exception',
        url: 'https://sentry.io/escaleno/visto-bueno/issues/180903558/',
        culprit: 'raven.scripts.runner in main',
        level: 'error',
        project_slug: 'visto-bueno',
        event: {
          timestamp: 1558586196.707
        }
      })
      const postOptions = {
        hostname: 'localhost',
        port: 8080,
        path: '/sentry/general',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }
      const req = http.request(postOptions, response => {
        this.response = response
      })
      req.write(postData)
      req.end()
    })

    it('responds with status 200 and results', () => {
      expect(this.postMessage.options.username).to.eql('Sentry')
      expect(this.postMessage.options.attachments).to.eql([
        {
          title: 'This is an example Python exception',
          title_url: 'https://sentry.io/escaleno/visto-bueno/issues/180903558/',
          text: 'raven.scripts.runner in main',
          color: '#E03E2F',
          footer: 'visto-bueno via Send a notification for new issues',
          footer_icon:
            'https://raw.githubusercontent.com/getsentry/sentry/master/src/sentry/static/sentry/images/sentry-email-avatar.png',
          ts: 1558586196.707
        }
      ])
      expect(this.postMessage.options.channel).to.eql('general')
    })
  })
})
