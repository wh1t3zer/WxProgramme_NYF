var app=getApp()
var util=require("../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load:false,
    //失物类别
    categories: ["全部","寻找失物","拾物寻主"],
     //分类导航栏下标
     currentData: 0,
     //所要读取的数据库
    database: 'shiwuzhaoling',
    //数据库数量
    count: "",
    //数据库数据
    DBdata: [],
     //下拉更新数据库数据个数
     nextPage: 0,
     //我的页面
     myPage: false,
    // 现在的时间戳 (暂时,添加到全局变量)
    nowDate: Number(new Date().getTime()),
  },
  post_findlost:function(){
    wx.navigateTo({
      url: '../Post/uploadfind/uploadfind',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nowDate:Number(new Date().getTime()),
    })
    this.categoriesTab();
    app.globalData.nowDate = this.data.nowDate;
  },
  //更改类别下标
  categoriesTab: function (e) {
    if(e){
    this.setData({
      currentData:e.currentTarget.dataset.index
    });
  }
    console.log(this.data.currentData)

    var that =this;
    that.setData({
      DBdata:[],
      nextPage:0,
      count:0,
      categories:["全部","寻找失物","拾物寻主"],
      database:'shiwuzhaoling',
      currentData:this.data.currentData
    })
    this.databaseLoad();
    setTimeout(() => {
      var isload_data = JSON.stringify(this.data.DBdata)
      if(isload_data){
       this.setData({
         load:true
       })
      }
    }, 500);
  },
  //更新副导航栏下标
  categoriesChange: function (e) {
    let current = e.detail.current;
    let source = e.detail.source
    //console.log(source);
    // 这里的source是判断是否是手指触摸 触发的事件
    if (source === 'touch') {
      this.setData({
        currentData: current,
      })
      console.log(this.data.currentData)
    }
  },
  // 调用util.js中读取数据库函数
  databaseLoad: function () {
    var that = this;
      util.allLoad(that);
  },
  //验证搜索栏
  search:function(e){
    this.setData({
      DBdata:[],
      nextPage:0,
    })
    if(this.data.keyword==''){
      this.setData({
        keyword:'.',
      })
    }
    var that=this
    util.searchshiwu(that)
  },
  inputKeyword:function(e){
    var data=e.detail.value;
    this.setData({
      keyword:data,
    })
  },
  godetail:function(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../lostfind_list/lostfind_list?id=' + e.currentTarget.dataset.id
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