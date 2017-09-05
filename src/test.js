const recastai = require('recastai')

const client = new recastai.request('7b38b88e159645c34bcdb90f77534738', 'en')

client.converseText('hello')
  .then(function(res) {
    if (res.action) { console.log('Action: ', res.action.slug) }
    const reply = res.reply()
    console.log('Reply: ', reply)
  })
