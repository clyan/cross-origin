# 跨域及用户验证



# CommonServer

> 启动公共服务，其他几个项目都请求这个服务的接口，产生跨域
```bash
    npm run common
```

# JSONP

**核心原理：**

+ 利用script请求后端数据，解析执行，通过传入浏览器端存在的函数名，后端使用改函数包裹该数据，浏览器端就会执行该函数，参数就是返回的值。

  

注意点：

- 封装JSONP，为了保证每次传入到后台的函数不是同一个，使用数组，保存多个函数。
  encodeURIComponent 编码参数中可能存在的特殊符号如 & 

```JavaScript
    function JSONP({
        url,
        params = {},
        callbackKey = 'cb',
        success
    }){
        // 配置 公共地址
        JSONP.CommonUrl = JSONP.CommonUrl || '';
        // 每次调用JSONP时给JSONP.callbackId 唯一的Id，
        JSONP.callbackId = JSONP.callbackId || 0;
        let callbackId = JSONP.callbackId;
        
        // 并将页面上最终要执行的函数加入到 JSONP.callbacks中，
        JSONP.callbacks = JSONP.callbacks || [];
        JSONP.callbacks[callbackId] = success 
        // 上面两个步骤都是保证，多次调用JSONP时页面是执行同一个函数的问题。。

        // 传入到后端的函数名，通过此函数，包裹返回的数据，页面上函数的参数就能获取到服务端的内容了。
        params[callbackKey] = `JSONP.callbacks[${callbackId}]`;
    
        // 将需要传入到后端的参数拼接起来
        const paramsString = Object.keys(params).map(key => {
            //对 特殊符号进行处理如参数中的 &, 等。
            return `${key}= ${encodeURIComponent(params[key])}`
        }).join('&');

        const script = document.createElement('script');
        script.setAttribute('src', `${JSONP.CommonUrl}${url}?${paramsString}`);
        document.body.appendChild(script);
        JSONP.callbackId++;
    }
```
```bash
    npm run jsonp
```

# CORS
- **Access-Control-Allow-Origin:** 该字段是必须的。它的值要么是请求时`Origin`字段的值，要么是一个`*`，表示接受任意域名的请求。
- **Access-Control-Allow-Method:**
- **Access-Control-Allow-Headers: ** 
- **Access-Control-Allow-Credentials:** 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中,设为`true`，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为`true`，如果服务器不要浏览器发送Cookie，删除该字段即可。

- 简单请求：
  - 请求方法： `GET`, `POST`
  - 头部信息： 
    - Accept
    - Accept-Language
    - Content-Language
    - Content-Type：只限于三个值`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`
- 复杂请求：
  - 请求方法：`PUT`或`DELETE`，
  - Content-Type：application/javascript等
  - 预检请求： 预请求实际上是对服务端的一种权限请求，只有当预请求成功返回，实际请求才开始执行，同时会带上Access-Control-Request-Method 与Access-Control-Request-Headers，服务端判断是否支持，如果不支持

```bash
    npm run cors
```

# XHR
对xhr简单封装用于请求。

```js
 function ajax({
    type = 'GET',
    url,
    headers= {},
    data = null,
    contentType = "text/plain",
    timeout = 5000,
    credentials = false,
    async = true,
    success = () => {} 
}) {
    const xhr = new XMLHttpRequest();
    xhr.ontimeout = timeout;
    xhr.responseType = contentType;
    // 它指示了是否该使用类似cookies,authorization headers(头部授权)或者TLS客户端证书这一类资格证书来
    //创建一个跨站点访问控制（cross-site Access-Control）请求。在同一个站点下使用withCredentials属性是无效的。
    xhr.withCredentials = credentials;
    if(data) {
        const paramString = Object.keys(data).map((key) => {
            return  `${key}= ${encodeURIComponent(data[key])}`
        }).join('&');

        if(url.split('?').length < 2) {
            url = url + '?' + paramString;
        } else {
            url = url + '&' + paramString;
        }
    }
    console.log('url:', url);
    // 请求方式， 地址， 是否异步
    // open()方法并不会真正发送请求，而只是启动一个请求以备发送
    xhr.open(type, url, async)
    // 设置头部信息
    Object.keys(headers).forEach((key, index) => {
        xhr.setRequestHeader(key, headers[key])
    })
    xhr.onloadstart = function() {
        //console.log("xhr onloadstart")
    }
    xhr.onload = function() {
        //console.log("xhr onload")
    }
    xhr.onloadend = function() {
       // console.log("xhr onloadend")
    }
    xhr.onprogress = function() {
        //console.log("xhr onprogress")
    }
    // 使用abort终止后不会触发， 
    xhr.onreadystatechange = function() {
        // 0：未初始化。尚未调用open()方法。
        // 1：启动。已经调用open()方法，但尚未调用send()方法。
        // 2：发送。已经调用send()方法，但尚未接收到响应。
        // 3：接收。已经接收到部分响应数据。
        // 4：完成。已经接收到全部响应数据，而且已经可以在客户端使用了。
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            success(JSON.parse(xhr.responseText))
        }
    }

    // 发送请求，并发送参数
    xhr.send(data)
}
```

# JWT

**JWT:** 包含3部分，header, payload, signature组成，用`.` 连接，如：

```
xxxxxx.yyyyyy.zzzzzz
```

-  **header:** 由token的类型（‘jwt’）和算法名称（比如：HMAC, SHA256或者RSA）

例如： 

```
{
	'alg': 'HS256',
	'typ': 'JWT'
}
```

使用Base64对这个json进行编码，得到第一部分

- **payload：** 存储用户信息

例如：

```
{
	"name":  "ywy",
	"age":  "21"
}
```

使用Base64对这个json进行编码，得到第二部分

 **不要在JWT的payload或header中放置敏感信息，除非它们是加密的。**

- **Signature** 

  `为了得到签名部分，你必须有编码过的header、编码过的payload、一个秘钥，签名算法是header中指定的那个，然对它们签名即可。`

  例如：

```javascript
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

签名是用于验证消息在传递过程中有没有被更改，并且，对于使用私钥签名的token，它还可以验证JWT的发送方是否为它所称的发送方。

如果有人对头部以及载荷的内容解码之后进行修改，再进行编码的话，那么新的头部和载荷的签名和之前的签名就将是不一样的。而且，如果不知道服务器加密的时候用的密钥的话，得出来的签名也一定会是不一样的。
 服务器应用在接受到JWT后，会首先对头部和载荷的内容用同一算法再次签名。那么服务器应用是怎么知道我们用的是哪一种算法呢？别忘了，我们在JWT的头部中已经用alg字段指明了我们的加密算法了。
 如果服务器应用对头部和载荷再次以同样方法签名之后发现，自己计算出来的签名和接受到的签名不一样，那么就说明这个Token的内容被别人动过的，我们应该拒绝这个Token，返回一个HTTP 401 Unauthorized响应。

 **session + cookie验证方式：**

服务器端存储sessionI的， 下次请求带上该sessionID，一般是存在cookie中，自动发送，

问题： 

- 服务器开销大，存在内存中
- 不易拓展，集群时，不便共享

**JWT**

用户携带用户名和密码请求访问  -服务器校验用户凭据 -应用提供一个token给客户端 -客户端存储token，并且在随后的每一次请求中都带着它 -服务器校验token并返回数据.



