// pages/material/index.js
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoSrc: "https://piaxi-filer.resetbypear.com/videos/1/original.mp4",
    workUrl: "",
    video_id: 1,
    vedio_length: 0,
    role_id: 1,
    works_id: 2,
    saveDisabled: true,
    imgArray: [{
      img_id: 0,
      imgSrc: '../../src/role.png',
      checked: false
    }, {
      img_id: 1,
      imgSrc: '../../src/role.png',
      checked: false      
    }, {
      img_id: 2,
      imgSrc: '../../src/role.png',
      checked: false      
    }],
    files: [],
    file_web_root: 'https://piaxi-filer.resetbypear.com/',
    api_web_root: 'https://piaxi.resetbypear.com/api/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.videoContext = wx.createVideoContext('myVideo');
    var that = this;
    var video_url = that.data.file_web_root + "videos/" + options.src + "/original.mp4";
    that.setData({
      video_id: options.src,
      video_length: options.length,
      videoSrc: video_url
    })
    console.log("videoSrc=>", that.data.videoSrc);
    utils.httpRequest(that.data.api_web_root + 'videos/' + that.data.video_id,{
      method: 'GET',
      success: (res)=>{
        let roles = res.data.data.roles;
        console.log(roles)
        let temp = [];
        //获取视频中的roles
        for (let i = 0; i < roles.length; i++) {
          temp.push({
            img_id: roles[i]["role_id"],
            checked: false,
            imgSrc: that.data.file_web_root + 'roles/' + roles[i]["role_id"] + '/role.jpg'
            })
        }
        if(temp[0]){
          temp[0].checked = true;
        }
        that.setData({
          imgArray: temp,
          role_id: temp[0].img_id 
        });
        console.log("imgArray=>", that.data.imgArray)
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
    this.videoContext && this.videoContext.pause();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.videoContext && this.videoContext.pause();
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
  
  },

  authorizeCamera: function(e) {
    var that = this;
    wx.authorize({
      scope: 'scope.camera',
      success: function(res) {
        wx.chooseImage({
          sourceType: ['album', 'camera'],
          success: function (res) {
            that.setData({
              files: that.data.files = res.tempFilePaths,
              saveDisabled: false
            });
          }
        });
      }
    });
  },

  faceAndSound: function(){
    var that = this;
    utils.httpRequest(that.data.api_web_root + 'works', {
      method: 'POST',
      data: {
        video_id: that.data.video_id
      },
      success: (res) => {
        that.setData({
          works_id: res.data.data.works_id
        });
        wx.uploadFile({
          url: that.data.file_web_root + 'works/' + that.data.works_id + '/face.jpg',
          filePath: that.data.files[0],
          name: 'user-face',
          success: function (res) {
            utils.httpRequest(that.data.api_web_root + 'works/' + that.data.works_id + '/face-replacing', {
              method: 'POST',
              data: {
                role_id: that.data.role_id
              },
              success: () => {
                console.log('file uploaded');
                that.videoContext && that.videoContext.pause();
                wx.navigateTo({
                  url: '../edit/edit?src=' + that.data.video_id + '&length=' + that.data.video_length + '&worksId=' + that.data.works_id
                })
              }
            })
          }
        });
        console.log("workid",that.data.works_id);        
      }
    });
  },

  enterSound: function() { 
    let that = this;
    utils.httpRequest(that.data.api_web_root + 'works', {
      method: 'POST',
      data: {
        video_id: that.data.video_id
      },
      success: (res) => {
        console.log("res=>",res)
        that.setData({
          works_id: res.data.data.works_id
        });
        console.log("workId=>",that.data.works_id);
        this.videoContext && this.videoContext.pause();
        wx.navigateTo({
          url: '../edit/edit?src=' + that.data.video_id + '&length=' + that.data.video_length + '&worksId=' + that.data.works_id
        })
      }
    });
    
  },

  radioChange: function(e) {
    var that = this;
    console.log("radio value=>", e.detail.value)
    that.setData({
      role_id: e.detail.value
    })
    console.log(that.data.role_id)
  }
})

