process.env.PORT = '5000'
process.env.REQUEST_TOKEN = '7b38b88e159645c34bcdb90f77534738'
process.env.LANGUAGE = 'fr'
// Write your own configuration here:
// ...
curl -X POST -H "Content-Type: application/json" -d '{
  "greeting":[
    {
      "locale":"default",
      "text":"Hello!"
    }, {
      "locale":"en_US",
      "text":"Timeless apparel for the masses."
    }
  ] 
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=EAAV2SPNdsF0BALOT3tnFZC2qRjNx2FR8quSZBPtCG0ZAZC1zxnelgB6nCtnmZBixy4XZCN0uDaPXica5SzuAUcBGHT5e2kYyyiKZBdaIBommGdKkDsS5mR8lMUT9byKGVfYfQ1TSTwxgxDi01DyQqpIUWKtdicHwp1A6vyo3Ws5mD1ruPP8XXMM"
