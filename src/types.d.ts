import { Adapter, Robot, DataStore } from 'hubot'

interface RTMClient {
  readonly dataStore: DataStore
}

interface Fields {
  title?: string
  value: string
  short?: boolean
}

interface Attachments {
  fallback?: string
  color?: string
  pretext?: string
  author_name?: string
  author_link?: string
  author_icon?: string
  title?: string
  title_link?: string
  text?: string
  fields?: Fields[]
  image_url?: string
  thumb_url?: string
  footer?: string
  footer_icon?: string
  ts?: number
}

interface PostMessageOptions {
  /**
   * Change how messages are treated. Defaults to `none`.
   */
  parse?: string
  /**
   * Find and link channel names and usernames.
   */
  link_names?: number | boolean
  /**
   * Structured message attachments.
   */
  attachments?: Attachments[]
  /**
   * Pass boolean to enable unfurling of primarily text-based content.
   */
  unfurl_links?: boolean
  /**
   * Pass boolean to disable unfurling of media content.
   */
  unfurl_media?: boolean
  /**
   * Set your bot's user name. Must be used in conjunction with `as_user` set to boolean, otherwise ignored.
   */
  username?: string
  /**
   * Pass boolean to post the message as the authed user, instead of as a bot. Defaults to boolean.
   */
  as_user?: boolean
  /**
   * URL to an image to use as the icon for this message. Must be used in conjunction with `as_user` set to boolean, otherwise ignored.
   */
  icon_url?: string
  /**
   * emoji to use as the icon for this message. Overrides `icon_url`. Must be used in conjunction with `as_user` set to boolean, otherwise ignored.
   */
  icon_emoji?: string
}

interface PostMessageResponse {
  ok: boolean
  channel?: string
  ts?: string
  message?: {
    text: string
    username: string
    bot_id: string
    attachments?: Attachments[]
    type: string
    subtype: string
    ts: string
  }
  error?: string
}

interface Chat {
  postMessage(
    channel: string,
    text: string,
    opts?: PostMessageOptions
  ): Promise<PostMessageResponse>
}

interface ConversationsListOptions {
  cursor?: string
  exclude_archived?: boolean
  types?: string
  limit?: number
}

interface Channel {
  id: string
  name: string
  is_channel: boolean
  is_group: boolean
  is_im: boolean
  created: number
  creator: string
  is_archived: boolean
  is_general: boolean
  unlinked: number
  name_normalized: string
  is_shared: boolean
  is_ext_shared: boolean
  is_org_shared: boolean
  pending_shared: any[]
  is_pending_ext_shared: boolean
  is_member: boolean
  is_private: boolean
  is_mpim: boolean
  topic: {
    value: string
    creator: string
    last_set: number
  }
  purpose: {
    value: string
    creator: string
    last_set: number
  }
  previous_names: string[]
  num_members: number
}

interface ConverstionsListResponse {
  ok: boolean
  channels?: Channel[]
  ts?: string
  error?: string
  response_metadata?: {
    next_cursor: string
  }
}

interface Converstions {
  list(
    opts?: ConversationsListOptions,
    optCb?: Function
  ): Promise<ConverstionsListResponse>
  info(
    channel: string,
    opts?: PostMessageOptions,
    optCb?: Function
  ): Promise<ConverstionsInfoResponse>
}

interface WebClient {
  readonly chat: Chat
  readonly conversations: Converstions
}

class SlackClient {
  readonly rtm: RTMClient
  readonly web: WebClient
}

export class SlackBot extends Adapter {
  client: SlackClient
}

export interface SlackRobot extends Robot<SlackBot> {}

export class Room {
  readonly robot: SlackRobot

  destroy (): void
}
