const faunadb = require('faunadb') 
import 'dotenv/config';

export default function faunaClient() {
    const client = new faunadb.Client({
        secret: process.env.FAUNA_TOKEN,
        domain: 'db.fauna.com',
        port: 443,
        scheme: 'https',
      })
      const q = faunadb.query

    return {client: client, cursor: q}
}