const express = require('express');
const expressJwt = require("express-jwt");
const jwt = require('jsonwebtoken');
const path = require('path')
const app = new express();
const fs = require('fs');

const port = process.env.NODE_PORT || 3003;

app.use(express.static(path.join(__dirname, '../XHR')));
app.use((req,res, next)=> {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Method': '*',
    'Access-Control-Allow-Headers': '*',
  })
  next();
})
// jwt中间件, 用于验证Token, 默认是从header的Authorization中获取token
app.use(expressJwt({
  credentialsRequired: true, //允许无 Token 请求
  algorithms: ['HS256'],
  secret: "secret12345"//加密密钥，可换
}).unless({
    path: ["/login",'/']//添加不需要token验证的路由 
}));


app.get('/', async (req, res)=> {
    res.type('html');
    res.end(fs.readFileSync(path.join(__dirname, './index.html'),{ encoding:'utf-8' }))
})

app.post('/login', function (req, res) {
    const { name, pwd } = req.query;
    if(name === '123' && pwd === '123') {
          // 注意默认情况 Token 必须以 Bearer+空格 开头
          // payload, 密钥,  options, expiresIn为paylad的过期时间。
          const token = 'Bearer ' + jwt.sign(
            {
              _id: name,
            },
            'secret12345',
            {
              expiresIn: 3600 * 24 * 3
            }
          )
          res.json({
            status: 'ok',
            token: token 
          })
    } else {
        res.json({
          code: 250,
          msg: '用户名或密码不正确'
        })
    };
})
app.get('/info', async (req, res)=> {
  res.json({
    code: 200,
    status: 'ok',
    msg: '获取成功',
    data: {
      name: 'ywy'
    }
  })
})
app.listen(port, ()=> {
    console.log(`http://127.0.0.1:${port}`);
})