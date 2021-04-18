const express = require('express');
const app = new express();
const fs = require('fs');
const path = require('path');
const port = process.env.NODE_PORT;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../XHR')));

app.get('/', async (req, res)=> {
  res.type('html');
  res.end(fs.readFileSync(path.join(__dirname, './index.html')))
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})
