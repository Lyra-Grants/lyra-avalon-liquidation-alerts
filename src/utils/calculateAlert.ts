export default function CalculateAlert(input: any, price: any) {
  // Does this need put/call logic?
    let number = Number(input)
    let threshold = 0.15
    if (!isNaN(number)) {threshold = number/100}
    let alert = (price - (price * threshold))
    return alert
  }
