 var util = require('../../utils/util')
const app = getApp()

Page({
  data:{
    // 判断是否为管理员
    admin: false,
    userData:[],
    //头像列表
    swiperList: [],
    openid:"",
  },
  
  onload:function(){
    //判断是否为管理员界面
    this.showAdmin();
    //初始化用户数据
    this.setData({
      swiperList:app.globalData.swiperList,
      userData:app.globalData.userCloudData
    })
  },


  onShow:function(options){
    //判断是否为管理员页面
    this.showAdmin();

    this.setData({
      swiperList:app.globalData.swiperList,
      userData:app.globalData.userCloudData
    })
     this.login();
  },

  login:function(){
    //获取用户的openid并设置为全局变量
    wx.cloud.callFunction({
      name:'login',
      complete: res=>{
        console.log('callFunction test result ',res)
        this.setData({
          openid:res.result.openid
        })
        util.getUserInCloud(this.data.openid);
      }
    })
  },


  //判断是否显示管理员入口
  showAdmin:function(){
    if(app.globalData.userCloudData.admin){
      this.setData({
        admin:true
      })
    }
  },



//关于我们
about:function(){
  wx.navigateTo({
    url: '../about/about',
  })
},
feedback:function(){
  wx.navigateTo({
    url: '../feedback/feedback',
  })
},

  //检查用户是否已经注册(决定点击跳转到的页面)
  checkUser:function(){
    console.log(this.data.userData)
    if(app.globalData.userCloudData.pass==="0"){
      wx.navigateTo({
        url: '../registered/registered'
      })
    }else{
      wx.navigateTo({
        url: '../userInfo/userInfo',
      })
    }
  },
  GoTofabu:function(){
    wx.navigateTo({
      url: '../../publish/publish',
    })
  },
})