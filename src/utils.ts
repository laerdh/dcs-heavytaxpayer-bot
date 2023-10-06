import { verifyKey } from 'discord-interactions';

export function VerifyDiscordRequest(clientKey: any) {
  return function (req: any, res: any, buf: any, encoding: any) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

export async function DiscordRequest(endpoint: any, options: any) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests

  console.log('Options.body: ', options.body)

  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'HeavyTaxPayerBot, 1.0.0)',
    },
    ...options
  });
  
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log('Request status: ', res.status);
    throw new Error(JSON.stringify(data));
  }

  console.log('Command reposnse: ', res)
  // return original response
  return res;
}