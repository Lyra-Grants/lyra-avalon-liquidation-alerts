import faunaClient from './clients/faunaClient';

const fauna = faunaClient()

export function PushToDB(data: object) {
  let query = fauna.client.query(
    fauna.cursor.Create(
      fauna.cursor.Collection('Order'),
      { data: data }
    )
  )
  query.then(response => response)
}

//
export async function idExists(id: number) {
  let arr = []
  let query = fauna.client.paginate(fauna.cursor.Match(fauna.cursor.Index('isIndexed'), id))
  await query.each((page) => {arr = page})
  if (arr[0] === id) {
    return true
  } else {
    return false
  }
}

