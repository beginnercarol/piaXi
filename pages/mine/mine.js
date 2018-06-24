// pages/mine/mine.js
var utils = require("../../utils/util.js");
var fileServer = getApp().globalData.fileServer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
    grids:[{
      id: 1,
      poster: '../../src/smile.jpeg',
      videoLen: 14000
    }, {
      id: 2,
      poster: '../../src/chop.jpeg',
      videoLen: 14000
    }, {
      id: 3,
      poster: '../../src/happy.jpeg',
      videoLen: 14000
    }, {
      id: 4,
      poster: '../../src/panda.jpeg',
      videoLen: 14000
    }],
    videoSrc:"",
    isPanelVisible: false
  },

  togglePopPanel: function (event) {
    console.log("togglePopPanel", this.data.isPanelVisible);
    let ctx = this;
    let dataSet = event.currentTarget.dataset;
    console.log("dataSet=>",dataSet,ctx.data.isPanelVisible);
    let workId = dataSet.workId;
    if(ctx.data.isPanelVisible){
      //this.videoContext && this.videoContext.pause();
      console.log("visible=>pause");
      this.videoContext && this.videoContext.pause();
    }else{
      console.log("invisible=>play");
      this.videoContext && this.videoContext.seek(0);
      this.videoContext && this.videoContext.play();
    }
    this.setData({
      isPanelVisible: !ctx.data.isPanelVisible,
      // videoSrc: fileServer + '/works/' + workId + '/product.mp4'
      videoSrc: fileServer + '/videos/1/original.mp4'
    })
    console.log("panel",ctx.data.isPanelVisible);
  },

  closePanel: function(event) {
    console.log("Close",event.target,this.videoContext);
    this.videoContext && this.videoContext.seek(0);    
    this.videoContext && this.videoContext.pause();
    console.log("Close", event.target, this.videoContext);
    if(event.target.id!="myVideo"){
      this.setData({
        isPanelVisible: false,
      });
    }
  },

  visitorLogin: function () {
    let ctx = this;
    console.log("visi=>",getApp().globalData.userInfo);
    utils.loginFunc();
    wx.getSetting({
      success: res => {
        console.log("success")
        if (res.authSetting['scope.userInfo']) {
          console.log("getSetting");
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log("login=>", res.userInfo);
              ctx.setData({
                userInfo: res.userInfo
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (ctx.userInfoReadyCallback) {
                ctx.userInfoReadyCallback(res)
              }
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
    utils.loginFunc();
    this.videoContext = wx.createVideoContext("myVideo");
    let ctx = this;
    let userInfo = getApp().globalData.userInfo;
    ctx.setData({
      userInfo: userInfo
    });
    utils.httpRequest('https://piaxi.resetbypear.com/api/works',{
      method:"GET",
      "Content-Type": "application/json",
      success: (res)=>{
        let works = res.data.works;
        let temp = [];
        for(let i=0; i<temp.length; i++){
          temp.push({
            id: works[i]["works_id"],
            name: works[i]["name"],
            poster: fileServer + '/videos/' + works[i]["video_id"] + '/' + 'poster.jpg',
            videoLen: works[i]["duration"] * 1000,
            videoId: works[i]["video_id"]
          })
          ctx.setData({
            grids: temp,
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
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