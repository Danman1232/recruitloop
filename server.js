// server.js
const jsonServer   = require('json-server')
const server       = jsonServer.create()
const router       = jsonServer.router('db.json')
const middlewares  = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Login endpoint issues a fake JWT that includes username & role
server.post('/login', (req, res) => {
  const { username, password } = req.body
  const user = router.db
    .get('users')
    .find({ username, password })
    .value()

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  // Base64-encode a minimal payload: { sub, role, exp }
  const payload = Buffer.from(
    JSON.stringify({
      sub:  user.username,
      role: user.role,
      exp:  Math.floor(Date.now() / 1000) + 60 * 60  // 1 hour
    })
  ).toString('base64')

  // Construct a dummy JWT: header.payload.signature
  const token = `xxx.${payload}.signature`

  res.json({ token })
})

// Mount the rest of json-server’s routes (GET /users, /jobs, /agencies, etc.)
server.use(router)

server.listen(4000, () => {
  console.log('Mock API running at http://localhost:4000')
})
