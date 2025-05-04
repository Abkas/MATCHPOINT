require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/test', (req, res) =>{
    res.send('this is a new port')
})

app.get('/login', (res, req) =>{
    res.send('<h1>PLEASE ENTER YOUR CREDIENTIALS</h1>')
})
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})

