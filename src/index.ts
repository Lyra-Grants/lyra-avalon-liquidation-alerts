import 'dotenv/config';
import { Context, Telegraf } from 'telegraf'
import Lyra from '@lyrafinance/lyra-js'
import {PushToDB, idExists} from './queries';


export default async function bot() {
  
  const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
  const lyra = new Lyra();

  bot.start((ctx) => {ctx.reply('Welcome to Lyra Liquidation Alert Tool')})
  bot.help((ctx) => {ctx.reply('Use /track [Your-ethereum account] to check orders')})

  bot.command('test', async (ctx) => {
    let account = ctx.message.text.split(' ')[1]
    try {
      let response = await lyra.openPositions(account)
      let positions = response.map(pos => (({
        id: pos.id,
        owner: pos.owner,
        marketName: pos.marketName,
        marketAddress: pos.marketAddress,
        size:  pos.size,
        isOpen: pos.isOpen,
        isCall: pos.isCall,
        isLong: pos.isLong,
        isSettled: pos.isSettled,
        isBaseCollateral: pos.collateral?.isBase,
        liquidationPrice: pos.collateral?.liquidationPrice,
        numTrades: pos.trades().length,
        avgCostPerOption: pos.avgCostPerOption(),
        pricePerOption: pos.pricePerOption,
        realizedPnl: pos.realizedPnl(),
        realizedPnlPercent: pos.realizedPnlPercent(),
        unrealizedPnl: pos.unrealizedPnl(),
        unrealizedPnlPercent: pos.unrealizedPnlPercent(),
        expiryTimestamp: pos.expiryTimestamp,
      })));
    
      console.log("----------------------------------------")
      positions.map( async pos => {
        let isIndexed = await idExists(pos.id);
        if (isIndexed) {
          ctx.reply(`ORDER: ${pos.id} IS ALREADY BEING TRACKED`)
        } else {
          PushToDB(pos)
          ctx.reply(`NOW TRACKING ORDER: ${pos.id}`)   
        }
      });
    } catch (error) {
      
      ctx.reply(`Error 429: Too Many Requests.`)   
      console.log(error)

    }
  });


  bot.launch()

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))

};

bot()