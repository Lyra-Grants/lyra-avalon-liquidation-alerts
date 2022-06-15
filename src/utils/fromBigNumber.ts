import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'

export default function fromBigNumber(number: BigNumber, decimals = 18): number {
  try {
    return parseFloat(formatUnits(number.toString(), decimals))
  } catch (error) {
    return null
  }
  
}