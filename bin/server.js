// This is a naive server - do not use this code in production

const https = require('https')
const fs = require('fs')
const path = require('path')

const opts = {
  key: fs.readFileSync(path.join('../certs/key.pem')),
  cert: fs.readFileSync(path.join('../certs/cert.pem'))
}

const CONTENT_ROOT = path.join(__dirname, '../content')
const LIB = path.join(__dirname, 'node_modules/nats.ws/nats.js')
https.createServer(opts, (req, res) => {
  if (req.url === '/') {
    req.url = '/index.html'
  }
  let t = path.join(CONTENT_ROOT, req.url)
  t = path.resolve(t)
  // don't allow access outside of the content node_modules or content root
  if (t.indexOf(CONTENT_ROOT) === -1) {
    res.writeHead(400)
    res.end()
    return
  }
  fs.readFile(t, (err, data) => {
    if (err) {
      res.writeHead(404)
      console.warn(`error reading ${t}: ${err.toString()}`)
      res.end()
    } else {
      res.writeHead(200)
      res.end(data)
    }
  })
}).listen(1443, '127.0.0.1', () => {
  console.info('server listening at https://127.0.0.1:1443')
  console.info('serving files from', CONTENT_ROOT)
})

