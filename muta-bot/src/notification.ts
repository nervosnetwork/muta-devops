const tg = require(`../env/tg`);
import * as config from './config'

import {TelegramClient} from 'messaging-api-telegram'

export default function (text) {
  if (!tg) {
    throw new Error('cannot find telegram config file, tg.json')
  }

  const key = tg['telegram_bot_key']
  const chat_id = config.DEV_MODE ?
    tg['telegram_channel_id'] :
    tg['telegram_nervos_group']

  const client = TelegramClient.connect(key)

  client.sendMessage(
    chat_id,
    text,
    {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      disable_notification: false,
    }
  );
}
