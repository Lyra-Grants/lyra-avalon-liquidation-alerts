import faunaClient from './clients/faunaClient';

const fauna = faunaClient()

export function PushToDB(data: object) {
  let query = fauna.client.query(
    fauna.cursor.Create(
      fauna.cursor.Collection('test'),
      { data: data }
    )
  )
  query.then(response => response)
}

//
export async function idExists(id: number) {
  let arr = []
  try {
    let query = fauna.client.paginate(fauna.cursor.Match(fauna.cursor.Index('test_'), id))
    await query.each((page) => {arr = page})
  } catch (error) {
      console.log(error)
  }
  if (arr[0] === id) {
    return true
  } else {
    return false
  }
}

