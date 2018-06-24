var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentVideoSrc:"",
    timer:"",
    face:"",
    dub:"",
    status:"ready",
    videoSrc:""
  },

  onShareAppMessage: function(res){
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  },

  saveToLocal: function(event){
    console.log("save");
    let ctx = this;
    wx.showLoading({
      title: "正在保存到本地"
    })
    wx.downloadFile({
      url: 'https://piaxi-filer.resetbypear.com/works/' + ctx.data.currentVideo + '/product.mp4', //仅为示例，并非真实的资源
      success: function (res) {
        console.log("temp=>", res.tempFilePath);
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.hideLoading();
          wx.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              console.log(res.errMsg)
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let fileServer = getApp().globalData.fileServer;
    let ctx = this;
    wx.showLoading({
      title: '玩命合成中',
    })
    this.setData({
      currentVideoSrc: decodeURIComponent(options.src),     
      currentVideo: decodeURIComponent(options.src),
      videoSrc:''// fileServer + '/works/' + options.src + '/product.mp4'
    });
    //轮询状态
    let url = 'https://piaxi.resetbypear.com/api/works/' + options.src + '/progress';
    
    let timer = setInterval(function(){
      if(ctx.data.face == 'finished' && ctx.data.dub=='finished'){
        clearInterval(ctx.data.timer);
      }else{
        utils.httpRequest(url, {
          success: (res) => {
            let data = res.data.data.tasks;
            let dub = null;
            let face = null;
            data.forEach((ele)=>{
              if(ele.type == 'face'){
                  face = ele.state;
              }else{
                dub=ele.state;
              }
            })
            console.log("dub,face",dub,face);
            // let dub = res.data.data.tasks[0].state;
            // let face = res.data.data.tasks[1].state;
            if ((dub == 'finished' && face=='finished') || (face==null && dub == 'finished') ){
              wx.hideLoading();
              ctx.setData({
                videoSrc: fileServer + '/works/' + ctx.data.currentVideoSrc + '/product.mp4',
                face: 'finished',
                dub: 'finished'
              })
              //clear(ctx.data.timer);
            }
          }
        })
      }
    },2000);

    ctx.setData({
      timer
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (res) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    clearInterval(this.data.timer);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})