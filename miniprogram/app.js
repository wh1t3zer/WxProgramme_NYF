//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
       env: 'cloud1-8gy5it9pf79305cf',
        traceUser: true,
      })
    }

    wx.getSystemInfo({
      success: e=>{
        this.globalData.StatusBar=e.statusBarHeight;
        let custom=wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom=custom;
        this.globalData.CustomBar=custom.bottom+custom.top-e.statusBarHeight;
      }
    })

  },
   // 获取当前时间
   getnowtime: function() {
    var date = new Date
    var year = date.getFullYear().toString()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    if (hour.toString().length === 1) {
        hour = '0' + hour.toString()
    } else if (minute.toString().length === 1) {
        minute = '0' + minute.toString()
    } else if (second.toString().length === 1) {
        second = '0' + second.toString()
    }

    var nowtime = year + '/' + month.toString() + '/' + day.toString() + ' ' + hour + ":" + minute + ":" + second
    return nowtime
},
  globalData:{
    param: false,
    userInfo:null,
    reloadHome:false,
    swiperList:[{
      id:0,
      type:'image',
      url:'cloud://cloud1-8gy5it9pf79305cf.636c-cloud1-8gy5it9pf79305cf-1306549006/touxiang/1.png'
    },
    {
      id:1,
      type:'image',
      url:'cloud://cloud1-8gy5it9pf79305cf.636c-cloud1-8gy5it9pf79305cf-1306549006/touxiang/2.png'
    },
    {
      id:2,
      type:'image',
      url:'cloud://cloud1-8gy5it9pf79305cf.636c-cloud1-8gy5it9pf79305cf-1306549006/touxiang/3.png'
    },
    {
      id:3,
      type:'image',
      url:'cloud://cloud1-8gy5it9pf79305cf.636c-cloud1-8gy5it9pf79305cf-1306549006/touxiang/4.png'
    },
    {
      id:4,
      type:'image',
      url:'cloud://cloud1-8gy5it9pf79305cf.636c-cloud1-8gy5it9pf79305cf-1306549006/touxiang/5.png'
    },
    {
      id:5,
      type:'image',
      url:'cloud://cloud1-8gy5it9pf79305cf.636c-cloud1-8gy5it9pf79305cf-1306549006/touxiang/6.png'
    },
    {
      id:6,
      type:'image',
      url:'cloud://cloud1-8gy5it9pf79305cf.636c-cloud1-8gy5it9pf79305cf-1306549006/touxiang/7.png'
    }],
  },
  getParam:function(callback){}
})
