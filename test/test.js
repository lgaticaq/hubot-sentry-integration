'use strict'

const { describe, beforeEach, afterEach, it } = require('mocha')
const Helper = require('hubot-test-helper')
const chai = require('chai')
const http = require('http')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const { expect } = chai
chai.use(sinonChai)

const helper = new Helper('../src/script.js')

describe('hubot-sentry', function () {
  /** @type {import('../src/types').Room} */
  let room
  beforeEach(() => {
    room = helper.createRoom()
    room.robot.adapter.client = {
      web: {
        // @ts-ignore
        conversations: { list: () => ({}) },
        // @ts-ignore
        chat: { postMessage: () => ({}) }
      }
    }
  })

  afterEach(() => room.destroy())

  describe('POST /sentry', () => {
    const sandbox = sinon.createSandbox()
    beforeEach(done => {
      sinon.replace(
        room.robot.adapter.client.web.conversations,
        'list',
        sinon.fake.resolves({
          ok: true,
          channels: [
            {
              name: 'general'
            }
          ]
        })
      )
      // @ts-ignore
      room.robot.adapter.client.web.chat.postMessage = (
        channel,
        text,
        options
      ) => {
        done()
      }
      sandbox.spy(room.robot.adapter.client.web.chat, 'postMessage')
      const postData = JSON.stringify({
        message: '',
        url:
          'https://sentry.io/organizations/my-org/issues/123456789/?referrer=webhooks_plugin',
        culprit: 'GET /api/comment/:commentId',
        level: 'error',
        project_slug: 'my-project',
        triggering_rules: ['Send a notification for new issues'],
        event: {
          culprit: 'GET /api/comment/:commentId',
          timestamp: 1558586196.707,
          exception: {
            values: [
              {
                type: 'SequelizeValidationError',
                value: '"a123213" is not a valid integer'
              }
            ]
          }
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
      const req = http.request(postOptions)
      req.write(postData)
      req.end()
    })

    it('responds with status 200 and results', () => {
      /** @type {import('../src/types').PostMessageOptions} */
      // @ts-ignore
      const options = room.robot.adapter.client.web.chat.postMessage.getCall(0)
        .args[2]
      expect(options.username).to.eql('Sentry')
      expect(options.attachments).to.deep.equal([
        {
          title: 'SequelizeValidationError - GET /api/comment/:commentId',
          title_link:
            'https://sentry.io/organizations/my-org/issues/123456789/?referrer=webhooks_plugin',
          text: '"a123213" is not a valid integer',
          color: '#E03E2F',
          footer: 'my-project via Send a notification for new issues',
          footer_icon:
            'https://raw.githubusercontent.com/getsentry/sentry/master/src/sentry/static/sentry/images/sentry-email-avatar.png',
          ts: 1558586196.707
        }
      ])
      expect(
        // @ts-ignore
        room.robot.adapter.client.web.chat.postMessage.getCall(0).args[0]
      ).to.eql('general')
    })
    afterEach(() => {
      sandbox.restore()
    })
  })
})
