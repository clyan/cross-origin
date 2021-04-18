const express = require('express');
const app = new express();
const path = require('path');
var cookieParser = require('cookie-parser');

const port = process.env.NODE_PORT;
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res)=> {
  res.type('text');
  res.end("公共接口")
})

// CORS测试接口
app.get('/cors', async (req, res)=> {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Method': '*',
      'Access-Control-Allow-Headers': '*',
    })
    res.json({
      name:'ywy',
      age:'age'
    })
})

// 普通ajax请求
app.get('/ajax', async (req, res)=> {
  const { name, age } = req.query;
  res.josn({
    name,
    age
  })
})

// JSONP测试接口
app.get('/jsonp', async (req, res)=> {
  const { name, age } = req.query;
  res.josn({
    name,
    age
  })
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})
