function ajax({
    type = 'GET',
    url,
    headers= {},
    data = null,
    contentType = "text/plain",
    timeout = 5000,
    credentials = false,
    async = true,
    success = () => {},
    error = ()=> {}
}) {
    const xhr = new XMLHttpRequest();
    xhr.ontimeout = timeout;
    xhr.responseType = contentType;
    // 它指示了是否该使用类似cookies,authorization headers(头部授权)或者TLS客户端证书这一类资格证书来
    //创建一个跨站点访问控制（cross-site Access-Control）请求。在同一个站点下使用withCredentials属性是无效的。
    xhr.withCredentials = credentials;
    if(data) {
        const paramString = Object.keys(data).map((key) => {
            return  `${key}=${encodeURIComponent(data[key])}`
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
    xhr.onerror = function(err) {
        error(err);
    }
    // 使用abort终止后不会触发， 
    xhr.onreadystatechange = function() {
        // 0：未初始化。尚未调用open()方法。
        // 1：启动。已经调用open()方法，但尚未调用send()方法。
        // 2：发送。已经调用send()方法，但尚未接收到响应。
        // 3：接收。已经接收到部分响应数据。
        // 4：完成。已经接收到全部响应数据，而且已经可以在客户端使用了。
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.status === 200) {
                success(JSON.parse(xhr.responseText))
            } else if(xhr.status === 401){
                error({code: 401, status:'err', msg: '认证失败，请检查是否token是否有效'});
            }
        } 
    }

    // 发送请求，并发送参数
    xhr.send(data)
}