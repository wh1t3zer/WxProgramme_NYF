var util=require('../utils/util')
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     //分类
     categories: ["全部", "化妆类", "电器类", "学习类", "衣物类", "生活类"],
     //分类导航栏下标
     currentData: 0,
    //所要读取的数据库
    database: 'xianzhi',
    //数据库数量
    count: "",
    //数据库数据
    DBdata: [],
     //下拉更新数据库数据个数
     nextPage: 0,
     //我的页面
     myPage: true,
     //用户openid
     user_openid: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user_openid:app.globalData.userCloudData._openid,
    })
    this.categoriesTab();
  },
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
      categories:["全部", "化妆类", "电器类", "学习类", "衣物类", "生活类"],
      database:'xianzhi',
      currentData:this.data.currentData,
    })
    this.userLoad();
    setTimeout(() => {
      var isload_data = JSON.stringify(this.data.DBdata)
      if(isload_data){
       this.setData({
         load:true
       })
      }
    }, 500);
  },

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
    that.userLoad();
    console.log("lower")
  },
   // 调用util.js中读取数据库函数
   userLoad: function () {
    var that = this;
      console.log('ask:', that.data.database);
      util.userLoad(that);
  },
  //刷新页面
  refreshItem: function () {
    this.categoriesTab()
  },
  //跳转到点击页面
  jumpToPost: function (e) {
    var id = e.currentTarget.id
    console.log(e.currentTarget.id)
    console.log(this.data.DBdata[id])
    var xianzhi_data = JSON.stringify(this.data.DBdata[id])
    wx.navigateTo({
      url: '../contact_xianzhi/contact_xianzhi?xianzhi_data=' + xianzhi_data

    })
  },
  //删除商品
  deleteGood: function(e) {
    var that=this
    var id = e.currentTarget.id
    //获得帖子id
    var xianzhi_id = this.data.DBdata[id]._id
    var goods_name = this.data.DBdata[id].title
    wx.showModal({
      title: '删除物品',
      content: goods_name,
      success(res) {
        //用户点击删除就删除帖子
        if (res.confirm) {
          const db = wx.cloud.database()
           // 删除云上的帖子的图片
        that.removeImage(that.data.DBdata[id].imgs)
          db.collection('xianzhi').doc(xianzhi_id).remove({
            //删除成功显示提示
            success: function (res) {
              console.log("删除成功")
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
              })
              that.setData({
                DBdata: [],
                nextPage: 0,
              })
              that.refreshItem();
              that.userLoad();
            }
          })
        }
      }
    })
  },
   // 删除云上的图片
   removeImage: function (imgs) {
    console.log(imgs)
    // 不删除默认图片
    if(imgs[0]!="cloud://yf-ab2989.7966-yf-ab2989-1258230310/没有实物图.png"){
      wx.cloud.deleteFile({
        fileList: imgs
      }).then(res => {
        console.log(res.fileList)
      }).catch(error => {
      })
      console.log("成功删除图片")
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (res) {
    // 计算屏幕可用高度
    try {
      const res = wx.getSystemInfoSync()
      console.log(res.windowHeight)
      this.setData({
        windowHeight:0.8*res.windowHeight-10
      })
    } catch (e) {}
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