const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const loginFunc = (reRequest) => {
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      let code = res.code;
     // console.log("Code=>",code);
      httpRequest('https://piaxi.resetbypear.com/api/sessions',{
        method: 'POST',
        data: {
          code
        }
        ,success:(res)=>{
          if (res.statusCode == '200') {
            let xCookie = "";
            let xCookieList = res.header['Set-Cookie'].split(";");
            for (let i = 0; i < xCookieList.length; i++) {
              let temp = xCookieList[i].split("=");
              if (temp[0] == 'piaxi-session-id') {
                xCookie = temp[1];
                break;
              }
            }
            if (xCookie) {
              console.log("xCookie=>", xCookie);
              wx.setStorageSync("xCookie", xCookie);
              reRequest && reRequest();
            }
          } else {
            console.log('login fail');
          }
        },fail:(res)=>{
        console.log("connect fail");
      }});
    }
  })
}

const httpRequest = (url,config) => {
  let xCookie = "";
  try {
    xCookie = wx.getStorageSync('xCookie');
    wx.request({
      url: url,
      header: {
        cookie: "piaxi-session-id=" + xCookie,
        "Content-Type": config.contentType || 'application/json',
      },
      method: config.method || 'GET',
      data: config.data,
      success:(res)=>{
          if(res.statusCode == '200') {
             config.success && config.success(res);
          } else if(res.statusCode == '401') {
            loginFunc(() => { httpRequest(url, config) });
          }
      },
      fail: (res)=>{
        console.log('fail');
        config.fail && config.fail(res);
      }
    });
  } catch (e) {
    // Do something when catch error
    console.log("Error when fetch cookie");
  }
  
}


module.exports = {
  formatTime: formatTime,
  loginFunc: loginFunc,
  httpRequest: httpRequest
}
