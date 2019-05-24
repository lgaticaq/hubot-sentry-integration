'use strict'

const Helper = require('hubot-test-helper')
const { expect } = require('chai')
const http = require('http')
const querystring = require('querystring')

const helper = new Helper('../src/script.js')

describe('hubot-sentry', function () {
  beforeEach(() => {
    this.room = helper.createRoom()
    this.room.robot.adapter.client = {
      rtm: {
        dataStore: {
          getChannelByName: to => {
            const channels = {
              '#general': { id: 'R00000001', name: 'general' }
            }
            return channels[to]
          }
        }
      }
    }
  })

  afterEach(() => this.room.destroy())

  context('POST /sentry', () => {
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
      const postData = querystring.stringify({
        payload: JSON.stringify({
          parse: 'none',
          username: 'Sentry',
          attachments: [
            {
              color: '#f43f20',
              fields: [
                {
                  short: true,
                  value: 'Escaleno visto-bueno',
                  title: 'Project'
                }
              ],
              fallback: '[Escaleno visto-bueno] Hola mundo',
              title_link:
                'https://sentry.io/escaleno/visto-bueno/issues/180903558/',
              title: 'Hola mundo'
            }
          ],
          channel: '#visto-bueno'
        })
      })
      const postOptions = {
        hostname: 'localhost',
        port: 8080,
        path: '/sentry',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
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
      expect(this.postMessage.options.parse).to.eql('none')
      expect(this.postMessage.options.username).to.eql('Sentry')
      expect(this.postMessage.options.attachments).to.eql([
        {
          color: '#f43f20',
          fields: [
            {
              short: true,
              value: 'Escaleno visto-bueno',
              title: 'Project'
            }
          ],
          fallback: '[Escaleno visto-bueno] Hola mundo',
          title_link:
            'https://sentry.io/escaleno/visto-bueno/issues/180903558/',
          title: 'Hola mundo'
        }
      ])
      expect(this.postMessage.options.channel).to.eql('#visto-bueno')
    })
  })

  context('POST /sentry without channel', () => {
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
      const postData = querystring.stringify({
        payload: JSON.stringify({
          parse: 'none',
          username: 'Sentry',
          attachments: [
            {
              color: '#f43f20',
              fields: [
                {
                  short: true,
                  value: 'Escaleno visto-bueno',
                  title: 'Project'
                }
              ],
              fallback: '[Escaleno visto-bueno] Hola mundo',
              title_link:
                'https://sentry.io/escaleno/visto-bueno/issues/180903558/',
              title: 'Hola mundo'
            }
          ]
        })
      })
      const postOptions = {
        hostname: 'localhost',
        port: 8080,
        path: '/sentry',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
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
      expect(this.postMessage.options.parse).to.eql('none')
      expect(this.postMessage.options.username).to.eql('Sentry')
      expect(this.postMessage.options.attachments).to.eql([
        {
          color: '#f43f20',
          fields: [
            {
              short: true,
              value: 'Escaleno visto-bueno',
              title: 'Project'
            }
          ],
          fallback: '[Escaleno visto-bueno] Hola mundo',
          title_link:
            'https://sentry.io/escaleno/visto-bueno/issues/180903558/',
          title: 'Hola mundo'
        }
      ])
      expect(this.postMessage.options.channel).to.eql('general')
    })
  })
})
