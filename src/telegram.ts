import 'dotenv/config';
import { Telegraf } from 'telegraf'
import Web3 from 'web3';
import LyraBot from './lyraBot';


// telegram listen
export default async function telegram() {
  const telegram = new Telegraf(process.env.TELEGRAM_TOKEN)
  const web3 = new Web3(process.env.RPC_URL)
  telegram.start((ctx) => {ctx.reply('Welcome to Lyra Liquidation Alert Tool')})
  telegram.help((ctx) => {ctx.reply('Use /track [Your-ethereum account] [Alert Threshold E.G. for 20% put 20] to check orders')})
  telegram.command('track', async (ctx) => {
    let account = ctx.message.text.split(' ')[1]
    let threshold = ctx.message.text.split(' ')[2]
    //Check address is valid
    if (web3.utils.isAddress(account) === false) {
      ctx.reply(`${account} is not a valid Ethereum address`) 
    } else {
      const res = await LyraBot(account, threshold, ctx.chat.id, 'telegram')
        res.map( r => {
          ctx.reply(r)
        }) 
    }
  });
  telegram.launch()
  // Enable graceful stop
  process.once('SIGINT', () => telegram.stop('SIGINT'))
  process.once('SIGTERM', () => telegram.stop('SIGTERM'))
};

// send message


