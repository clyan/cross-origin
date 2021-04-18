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
