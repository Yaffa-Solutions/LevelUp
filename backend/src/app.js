const express = require('express')
const app = express()
const profileRoutes = require('./routes/profileRoutes')

app.use(express.json())
app.use('/api/profiles', profileRoutes)

app.listen(3000, () => console.log('port 3000'))
