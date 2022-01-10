var util = require('../utils/util.js')
var app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: "欢迎来到南苑范校园社区生活圈，为大学生打造的社交平台，感谢您的支持",
    marqueePace: 0.5,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 414,
    size:14,
    interval: 20, // 时间间隔

    StatusBar:app.globalData.StatusBar,
    CustomBar:app.globalData.CustomBar,

    //用户openid
    openid:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //登录
    this.login();
    this.getPhoneHight();
  },
  // 获取手机屏幕可用高度
  getPhoneHight:function(){
    try {
      var res = wx.getSystemInfoSync()
      // var windowHeight = res.windowHeight
      var windowHeight = 0.88 * res.windowHeight - 10
      app.globalData.windowHeight=windowHeight
      console.log(app.globalData.windowHeight)
    } catch (e) { }
  },

   /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var length = that.data.text.length * that.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    //console.log(length,windowWidth);
 that.setData({
  length: length,
  windowWidth: windowWidth
 });
 that.scrolltxt();// 第一个字消失后立即从右边出现
 this.login();
 },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  //从云上获取用户信息
  login:function(){
    //获取用户的openid并设置为全局变量
    wx.cloud.callFunction({
      name:'login',
      complete:res=>{
        this.setData({
          openid:res.result.openid
        })
        util.getUserInCloud(this.data.openid);
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
//二手闲置
  GoToxianzhi:function(){
    wx.navigateTo({
      url: '../xianzhi/xianzhi',
    })
  },
//失物招领
  GoTolostfind:function(){
    wx.navigateTo({
      url: '../lostfind/lostfind',
    })
  },
//广场
  GoTogate:function(){
    wx.navigateTo({
      url: '../square/square',
    })
  },
//表白墙
  GoTolove:function(){
    wx.navigateTo({
      url: '../love/love',
    })
  },
  scrolltxt: function () {
    var that = this;
    var length = that.data.length;//滚动文字的宽度
    var windowWidth = that.data.windowWidth;//屏幕宽度
    if (length > windowWidth){
     var interval = setInterval(function () {
     var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
     var crentleft = that.data.marqueeDistance;
     if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
      that.setData({
      marqueeDistance: crentleft + that.data.marqueePace
      })
     }
     else {
      //console.log("替换");
      that.setData({
      marqueeDistance: 0 // 直接重新滚动
      });
      clearInterval(interval);
      that.scrolltxt();
     }
     }, that.data.interval);
    }
    else{
     that.setData({ marquee_margin:"1000"});//只显示一条不滚动右边间距加大，防止重复显示
    } 
    }
})