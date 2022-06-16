import Lyra from "@lyrafinance/lyra-js";
import {PushToDB, idExists} from './db/queries';
import fromBigNumber from './utils/fromBigNumber';
import CalculateAlert from "./utils/calculateAlert";
const lyra = new Lyra()

// subcribe 
export default async function lyraBot(account: string, threshold: string, chatId: number, source: string){        
        //Query for positions
        let response = await lyra.openPositions(account)
        let positions = await response.map(pos => (({
          source: source,
          id: pos.id,
          owner: pos.owner,
          telegramId: chatId,
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
          return [`No Orders Found` ]
        } else {
              let message = []
              await positions.map(async pos => {
                  if (idExists(pos.id)) {
                     message.push(`ORDER: ${pos.id} IS ALREADY BEING TRACKED`)
                  } else {
                    PushToDB(pos)
                    message.push(`NOW TRACKING ORDER: ${pos.id}`)
                  }
            });
            return message
        }
}


//Watch positions
