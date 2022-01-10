var app=getApp()
var util=require('../utils/util')
Page({
  data: {
    load:false,
    //关键词
    keyword:"",
    //数据库数据
    DBdata: [],
     //我的页面
     myPage: false,
     //闲置分类导航栏
     categories: ["全部", "化妆类", "电器类", "学习类", "衣物类", "生活类","数码类"],
     //分类导航栏下标
    currentData: 0,
    //所要读取的数据库
    database: 'xianzhi',
    //下拉更新数据库数据个数
    nextPage:0,
    //数据库数量
    count:"",
    // 现在的时间戳 (暂时,添加到全局变量)
    nowDate: Number(new Date().getTime()),
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //页面加载时读取数据库
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
      categories:["全部", "化妆类", "电器类", "学习类", "衣物类", "生活类","数码类"],
      database:'xianzhi',
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

  // 拖到最下面更新数据
  lower: function (e) {
    var that = this;
    that.databaseLoad();
    console.log("lower")
  },

  // 调用util.js中读取数据库函数
  databaseLoad: function () {
    var that = this;
      util.allLoad(that);
  },

  //刷新信息
  refreshItem: function () {
    this.categoriesTab()
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
    util.searchLoad(that)
  },
  inputKeyword:function(e){
    var data=e.detail.value;
    this.setData({
      keyword:data,
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
    this.databaseLoad()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  post:function(){
    wx.navigateTo({
      url: '../Post/uploadxianzhi/uploadxianzhi',
    })
  },

  //跳转到点击页面
  jumpToPost: function (e) {
    var id = e.currentTarget.dataset.id
    console.log(e.currentTarget.id)
    // console.log(this.data.DBdata[id])

    // var xianzhi_data = JSON.stringify(this.data.DBdata[id])
      wx.navigateTo({
        url: '../contact_xianzhi/contact_xianzhi?id=' + e.currentTarget.dataset.id,
      })
    
  },
})