import 'dotenv/config';
import { Telegraf } from 'telegraf'
import Lyra from '@lyrafinance/lyra-js'
import {PushToDB, idExists} from './queries';
import fromBigNumber from './utils/fromBigNumber';
import CalculateAlert  from './utils/calcualteAlert';
import Web3 from 'web3';

export default async function bot() {
  
  const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
  const lyra = new Lyra();
  const web3 = new Web3(process.env.RPC_URL)

  bot.start((ctx) => {ctx.reply('Welcome to Lyra Liquidation Alert Tool')})
  bot.help((ctx) => {ctx.reply('Use /track [Your-ethereum account] [Alert Threshold E.G. for 20% put 20] to check orders')})

  bot.command('track', async (ctx) => {
    let account = ctx.message.text.split(' ')[1]
    let threshold = ctx.message.text.split(' ')[2]
    //Check address is valid
    if (web3.utils.isAddress(account) === false) {
      ctx.reply(`${account} is not a valid Ethereum address`) 
    } else {
      try {
        //Query for positions
        let response = await lyra.openPositions(account)
        let positions = response.map(pos => (({
          id: pos.id,
          owner: pos.owner,
          telegramId: ctx.chat.id,
          marketName: pos.marketName,
          marketAddress: pos.marketAddress,
          strikePrice: fromBigNumber(pos.strikePrice),
          size:  fromBigNumber(pos.size),
          isOpen: pos.isOpen,
          isCall: pos.isCall,
          isLong: pos.isLong,
          isSettled: pos.isSettled,
          isLiquidated: pos.isLiquidated,
          isBaseCollateral: pos.collateral?.isBase,
          liquidationPrice: fromBigNumber(pos.collateral?.liquidationPrice),
          liquidationAlert: CalculateAlert(threshold, fromBigNumber(pos.collateral?.liquidationPrice)),
          numTrades: pos.trades().length,
          avgCostPerOption: fromBigNumber(pos.avgCostPerOption()),
          pricePerOption: fromBigNumber(pos.pricePerOption),
          realizedPnl: fromBigNumber(pos.realizedPnl()),
          realizedPnlPercent: fromBigNumber(pos.realizedPnlPercent()),
          unrealizedPnl: fromBigNumber(pos.unrealizedPnl()),
          unrealizedPnlPercent: fromBigNumber(pos.unrealizedPnlPercent()),
          expiryTimestamp: pos.expiryTimestamp,
          lastSentAlert: 0,
        })));
        //If positions init tracking
        if(Object.keys(positions).length === 0) {
          ctx.reply(`No Orders Found`)  
        } else {
            positions.map( async pos => {
              let isIndexed = await idExists(pos.id);
              if (isIndexed) {
                ctx.reply(`ORDER: ${pos.id} IS ALREADY BEING TRACKED`)
              } else {
                PushToDB(pos)
                ctx.reply(`NOW TRACKING ORDER: ${pos.id}`)   
              }
            });
        }
      } catch (error) { 
        ctx.reply(`Error: ${error}.`)   
        console.log(error)
      }
    }
  });

  bot.launch()
  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))

};

bot()