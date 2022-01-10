var app =getApp()


//获取用户是否已经注册
function getUserInCloud(openid){
  const db = wx.cloud.database()
  db.collection('users').where({
    _openid:openid,
  })
  .get({
    success:function(res){
      //读取第一个数据(后期修改用户上传只能上传一次，修改)

      //判断 如果是未注册的没填写信息的用户，将pass设置为0

      if(res.data.length==0){
        app.globalData.userCloudData={}
        app.globalData.userCloudData.pass="0"
        app.globalData.userCloudData._openid=openid;
        console.log(app.globalData.userCloudData._openid)
        console.log(app.globalData.userCloudData.pass)
      }
      else{
        app.globalData.userCloudData=res.data[0]
        console.log(app.globalData.userCloudData)
      }

    }
  })
}

//判断是否为注册用户
function isRegistered(){
  //判断当前用户是否为注册用户
  if(!app.globalData.userCloudData){
    wx.cloud.callFunction({
      name:'login',
      complete:res=>{
        console.log('callFunciton test result:',res)
        getUserInCloud(res.result.openid);
      }
    })
  }
  else if (app.globalData.userCloudData.pass==="0"){
    wx.redirectTo({
      url: '../../Mine/registered/registered?show=true'
    })
  }
  else if (!app.globalData.userCloudData.pass){
    wx.redirectTo({
      url: '../../Mine/userInfo/userInfo?show=true'
    })
  }
  else{
    return true
  }
}

//在云数据库上查找用户接收数据(查找10条)
function searchLoad(that) {
  var tempDBdata = that.data.DBdata
  var tempNextPage = that.data.nextPage
  const db = wx.cloud.database()
  const _=db.command
  //查询所有用户的闲置二手信息
  db.collection(that.data.database)
    .where({
      "content": db.RegExp({
        regexp: that.data.keyword,
        options: 'i',
      }),
    })
    .orderBy('date', 'desc')
    .skip(that.data.nextPage)
    .limit(10) // 限制返回数量为 10 条
    .get({
      //成功读取写入数据
      success: res => {
        that.setData({
          DBdata: tempDBdata.concat(res.data),
          nextPage: tempNextPage + 10
        })
        console.log('[数据库] [查询记录] 成功: ', that.data.DBdata)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
}

//在云数据库上查找所有数据
function allLoad(that) {
  var tempDBdata= that.data.DBdata
  var tempNextPage = that.data.nextPage
  const db = wx.cloud.database()
  //查询所有用户的闲置二手信息
  db.collection(that.data.database)
    .orderBy('date', 'desc')
    .skip(that.data.nextPage)
    .limit(10) // 限制返回数量为 10 条
    .get({
      //成功读取写入数据
      success: res => {
        that.setData({
          DBdata: tempDBdata.concat(res.data),
          nextPage: tempNextPage + 10
        })
        console.log('[数据库] [查询记录] 成功: ', that.data.DBdata)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
}

//在云数据库上查找指定用户数据(查找10条)
function userLoad(that) {

  var tempDBdata = that.data.DBdata
  var tempNextPage = that.data.nextPage 
  const db = wx.cloud.database()
  //查询所有用户的闲置二手信息
  db.collection(that.data.database)
    .where({
      "_openid": that.data.user_openid
      })
    .orderBy('date', 'desc')
    .skip(that.data.nextPage)
    .limit(10) // 限制返回数量为 10 条
    .get({
      //成功读取写入数据
      success: res => {
        that.setData({
          DBdata: tempDBdata.concat(res.data),
          nextPage: tempNextPage + 10
        })
        console.log('[数据库] [查询记录] 成功: ', that.data.DBdata)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
}


function onlyLoad(that){
  var tempDBdata=that.data.DBdata
  var tempNextPage = that.data.nextPage
  const db = wx.cloud.database()
  db.collection(that.data.database)
  .orderBy('date', 'desc')
  .skip(that.data.nextPage)
  .limit(10) // 限制返回数量为 10 条
  .get({
    success: function(res) {
      that.setData({
        DBdata: tempDBdata.concat(res.data),
        nextPage: tempNextPage + 10
      })
      console.log('[数据库] [查询记录] 成功: ', that.data.DBdata)
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      console.error('[数据库] [查询记录] 失败：', err)
    }
  })
}

//在云数据库上查找用户接收数据(查找10条)
function searchshiwu(that) {
  var tempDBdata = that.data.DBdata
  var tempNextPage = that.data.nextPage
  const db = wx.cloud.database()
  const _=db.command
  //查询所有用户的闲置二手信息
  db.collection(that.data.database)
    .where(_.or([{
      "content":db.RegExp({
        regexp:that.data.keyword,
        options:'i',
      })
    },
    {
      "things":db.RegExp({
        regexp:that.data.keyword,
        options:'i',
      })
    }
  ]))
    .orderBy('date', 'desc')
    .skip(that.data.nextPage)
    .limit(10) // 限制返回数量为 10 条
    .get({
      //成功读取写入数据
      success: res => {
        that.setData({
          DBdata: tempDBdata.concat(res.data),
          nextPage: tempNextPage + 10
        })
        console.log('[数据库] [查询记录] 成功: ', that.data.DBdata)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
}

function getData(date){
  var dateY=date.getFullYear()+'-';
  var dateM=(date.getMonth() + 1 < 10 ? '0' +(date.getMonth() + 1):date.getMonth()+ 1) +'-';
  var dateD=date.getDate() + '';
  date=dateY+dateM+dateD;
  return date
}

module.exports.getUserInCloud = getUserInCloud;
module.exports.isRegistered=isRegistered;
module.exports.allLoad = allLoad;
module.exports.userLoad = userLoad;
module.exports.searchLoad = searchLoad;
module.exports.onlyLoad=onlyLoad;
module.exports.searchshiwu=searchshiwu;