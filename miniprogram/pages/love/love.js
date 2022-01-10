const util=require("../utils/util")
const app =getApp()
const config =require("../../config")
let dianzan=false
Page({
  data:{
    dianzanUrl:"../../images/topic_praise.png",
    love:[],
    swiperList:[],
    loveType:1,
    posteropenid:'',
    pageSize:10,
    pageNumber:1,
    initPageNumber:1,
    showGetMoreLoading:false,
    currentTime:'',
    notDataTips:false,
    newMessage:false,
    newMessageNumber:0,
    select:1,
    showselect:false,
    messagefun:Object,
    praise_number:"",
    detail:'',
    currentData:0,
  },
  onLoad:function(e){
    // 判断当前用户是否为以注册用户
    util.isRegistered()
    this.setData({
      swiperList:app.globalData.swiperList,
      select:1,
    })
    wx.showLoading({
      title: '加载中',
    });
    this.getPost();
    this.setData({
      messagefun:setInterval(function(){
        that.newMessage()
        console.log('flash')
      },config.FLASHTIME)
    })
  },
  onReady(){
  },
  onShow:function(e){
    console.log('onshow')
    //刷新信息
    var that=this
    this.setData({
      select:1
    })
    //清除定时任务
    clearInterval(this.data.messagefun)
    //刷新信息
    this.setData({
      messagefun:setInterval(function(){
        that.newmessage()
        console.log('flash')
      },config.FLASHTIME)
    })
  },
  showselect:function(){
    this.setData({
      showselect:true,
    })
  },
  praise:function(){
    if(dianzan){
      this.setData({
        dianzanUrl:"../../images/topic_praise.png"
      })
      dianzan=false;
    }else{
      this.setData({
      dianzanUrl:"../../images/color-love.png"
      })
      dianzan=true;
    }
    var _id=res.id
    const db=wx.cloud.database()
    db.collection('love')
    .doc(_id)
    .update({
      data:{
        dianzan:dianzan
      }
    })
    .then(res=>{
      console.log(res)
    })
    .catch(res=>{
      console.log(res)
    })
  },
  selected(e){
    let objType=e.target.dataset.type;
    console.log(objType)
    if(objType==1){
      this.setData({
        love:[]
      });
      this.getPost();
    }
    if(objType==2){
      this.gethotPost()
      this.setData({
        love:[]
      });
    }
    this.setData({
      select:objType,
      love:[],
    })
    this.setData({
      pageNumber:this.data.initPageNumber
    })
  },
  //获取最新帖子
  getPost:function(objType=null){
    this.setData({
      love:[]
    })
    wx.showLoading({
      title: '加载中...',
    });
    var that=this
    var tempDBdata= that.data.love
    //读取数据
    const db=wx.cloud.database()
    db.collection('love')
          .orderBy('created_at','desc')
          .get()
          .then(res=>{
            console.log("数据获取成功",res)
           // dianzan=res.data.zan
            console.log(dianzan)
            wx.hideLoading()
            this.setData({
              love:res.data,
              dianzanUrl:dianzan? "../../images/color-love.png":"../../images/topic_praise.png"
            })
          })
          .catch(res=>{
            console.log("获取失败",res)
          })
  },
  gethotPost:function(){
    this.setData({
      love:[]
    })
    wx.showLoading({
      title: '加载中...',
    });
    var that=this
    var tempDBdata= that.data.love
    const db=wx.cloud.database()
    db.collection('love')
          .orderBy('praise_number','desc')
          .get({
            success: res => {
              this.setData({
                love:tempDBdata.concat(res.data),
              })
              console.log('[数据库] [查询记录] 成功: ', this.data.love)
              
              wx.hideLoading();
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '查询记录失败'
              })
              console.error('[数据库] [查询记录] 失败：', err)
            }
          })
  },
  //创建新的消息盒子
  message:function(data){
    //评论、点赞人昵称
    var nick_name=data.nick_name
    //评论点赞人头像
    var avatar=app.globalData.swiperList
    //更新时间
    var updatetime=app.getnowtime()
    //评论、点赞内容
    var content=data.content
    //接受的用户openid
    var messageuser=data.messageuser
    //当前帖子id
    var objId=data.objId
    //帖子类型
    var obj_type=data.obj_type
    //更新消息
    const db=wx.cloud.database()
    db.collection('message').add({
      data:{
        "from_user":{
          "avatar":avatar,
          "nick_name":nick_name
        },
        "created_at":updatetime,
        "content":content,
        "isread":false,
        "messageuser":messageuser,
        "objId":objId,
        "obj_type":obj_type
      },
      success(res){},
      fail:console.log
    })
  },
  //获取新的消息盒子提醒
  newmessage:function(){
    var that=this
    const db=wx.cloud.database()
    db.collection('message')
        .orderBy('created_at','desc')
        .where({
          messageuser:app.globalData.userCloudData._openid
        })
        .limit(10)
        .get({
          seuccess(res){
            console.log('newmessage',res)
            var data=res.data
            //未读新消息数，初始化为0
            var newMessageNumber=0
            var list=[]
            for(var i=0;i<data.length;i++){
              //未读信息
              if(!data[i].isread){
                newMessageNumber=newMessageNumber+1
              }
              //未读消息id
              //list.push(data[i]._id)
            }
            //判断是否有新消息
            if(newMessageNumber>0){
              that.setData({
                newMessageNumber:newMessageNumber,
                newMessage:true
              })
            }
          }
        })
  },
  previewImage:function(e){
    var index = e.target.id
    console.log(index)
    wx.previewImage({
      current: '',  //当前预览的图片
      urls: [index],  //所有要预览的图片
    })
  },
  previewMoreImage:function(e){
    let images=e.currentTarget.dataset.obj.map(item=>{
      return item;
    });
    let url=e.target.id;
    wx.previewImage({
      urls: images,
      current:images[url]
    })
},
  post_love:function(){
    wx.navigateTo({
      url: '../Post/uploadlove/uploadlove',
    })
  },
  post_friend:function(){
    wx.navigateTo({
      url: '../Post/uploadlove/upload_friend/upload_friend',
    })
  },
  //进入消息页面
  openMessage:function(){
    console.log(app.globalData.userCloudData._openid)
    var that=this
    wx.cloud.callFunction({
      name:'Message',
      data:{
        id:app.globalData.userCloudData._openid
      },
      success:res=>{
        console.log,
        wx.navigateTo({
          url: '../message/message',
        })
        that.setData({
          newMessageNumber:0,
          newMessage:false
        })
      },
      fail:console.fail
    })
  },
  lovedetail:function(e){
    console.log("获取的数据",e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../love_list/love_list?id=' + e.currentTarget.dataset.id,
    })
  },
  // 上拉刷新
  onReachBottom:function(){
    this.setData({
      showGetMoreLoading:true
    });
    
  },
  //下拉加载
  onPullDownRefresh:function(){
    this.setData({
      pageNumber:this.data.initPageNumber,
      love:[]
    });
    
  },
  onHide:function(){
    console.log('onhidden')
    clearInterval(this.data.messagefun)
  }
})