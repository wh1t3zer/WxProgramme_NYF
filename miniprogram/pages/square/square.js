var app=getApp()
var util=require("../utils/util")

Page({
  data:{
    load:false,
    //关键词
    keyword:"",
    //数据库数据
    DBdata: [],
     //我的页面
     myPage: false,
     //闲置分类导航栏
     categories: ["首页", "心情", "组队", "学习", "吐槽", "求助","其他"],
     //分类导航栏下标
    currentData: 0,
    //所要读取的数据库
    database: 'square',
    //下拉更新数据库数据个数
    nextPage:0,
    //数据库数量
    count:"",
    // 现在的时间戳 (暂时,添加到全局变量)
    nowDate: Number(new Date().getTime()),
    swiperList:[],
  },
  post:function(){
    wx.navigateTo({
      url: '../Post/uploadtiezi/uploadtiezi',
    })
  },
   //页面加载时读取数据库
   onLoad: function (options) {
    this.setData({
      nowDate:Number(new Date().getTime()),
      swiperList:app.globalData.swiperList
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
      categories:["首页", "心情", "组队", "学习", "吐槽", "求助","其他"],
      database:'square',
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
   //判断物品的类型
   bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      type_index: e.detail.value,
      fabu_type:this.data.types[e.detail.value]
    })
  },
  search:function(){
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
  // 调用util.js中读取数据库函数
  databaseLoad: function () {
    var that = this;
      util.allLoad(that);
  },
squaredetail:function(e){
  console.log(e.currentTarget.dataset.id)
  wx.navigateTo({
    url: '../square_list/square_list?id=' + e.currentTarget.dataset.id,
  })
}
})