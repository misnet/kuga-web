
import imageNotAvailable from '@/assets/image_not_available.png';
import _ from 'lodash';
/**
 * 对json对象按key进行排序，需要lodash程序支持
 */
export function sortKeysBy(obj, comparator) {
  let keys = _.sortBy(_.keys(obj), function (key) {
    return comparator ? comparator(obj[key], key) : key;
  });
  let newObj = {};
  _.map(keys, function (key) {
    newObj[key] = obj[key];
  });
  return newObj;
}

/**
 * 是否是网址
 * @param {} path 
 */
export function isUrl(path) {
  /* eslint no-useless-escape:0 */
  const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
  return reg.test(path);
}
/**
 * AliOSS 上传
 * @param {} option 
 */
export function ossUpload(option={}){
  let {ossSetting,file,targetPath,objectName,onFailure,onSuccess,onProgress} = option;
  if(!ossSetting  || !file){
    throw new Error('上传参数不齐全');
  }
  if(!targetPath){
    targetPath = '';
  }
  //自动生成名称
  if(!objectName && file.name){
    const fileExtension = file.name.split('.').pop().toLowerCase();
    objectName = generateUUID()+'.'+fileExtension;
  }
  try{
    const ossClient = new window.OSS.Wrapper({
        accessKeyId: ossSetting.Credentials.AccessKeyId,
        accessKeySecret: ossSetting.Credentials.AccessKeySecret,
        stsToken: ossSetting.Credentials.SecurityToken,
        region: ossSetting.Bucket.endpoint.replace('.aliyuncs.com',''),
        bucket: ossSetting.Bucket.name,
    });
    return new Promise((resolve, reject) => {
        const targetName = (targetPath + objectName).replace('//','/');
        ossClient.multipartUpload(targetName,file,{progress:onProgress}).then(data=>{
            if(typeof onSuccess  === 'function'){
              let newData = {...data};
              newData.url = ossSetting.Bucket.hostUrl + '/' + targetName;
              onSuccess(newData);
            }
        }).catch(error=>{
            if(typeof onFailure ==='function'){
                onFailure(error);
            }
        })
    });
  }catch(e){
     if(typeof onFailure==='function'){
         onFailure(e);
     }
  }
}
export function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
/**
 * Get the DPR of screen
 */
export function getDPR() {
  var dpr;
  if (window.devicePixelRatio !== undefined) {
      dpr = window.devicePixelRatio;
  } else {
      dpr = 1;
  }
  return dpr;
};
/**
 * Screen ViewPort
 */
export function getViewPort() {
  var w = parseInt(window.innerWidth);
  var h = parseInt(window.innerHeight);
  var rw = w * getDPR();
  var rh = h * getDPR();
  var dpr = getDPR();
  var s = {
      width: w,
      height: h,
      realWidth: rw,
      realHeight: rh,
      dpr: dpr
  };
  return s;
};
/**
 * Parse a URL
 * @param {*} url 
 */
export function parseURL (url) {
  var a = document.createElement('a');
  a.href = url;
  return {
      source: url,
      protocol: a.protocol.replace(':',''),
      host: a.hostname,
      port: a.port,
      query: a.search,
      params: (function(){
          var ret = {},
              seg = a.search.replace(/^\?/,'').split('&'),
              len = seg.length, i = 0, s;
          for (;i<len;i++) {
              if (!seg[i]) { continue; }
              s = seg[i].split('=');
              ret[s[0]] = s[1];
          }
          return ret;
      })(),
      file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
      hash: a.hash.replace('#',''),
      path: a.pathname.replace(/^([^\/])/,'/$1'),
      relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
      segments: a.pathname.replace(/^\//,'').split('/')
  };
}
/**
 * 取得缩略图
 * @param {*} imgurl 
 * @param {*} width 
 * @param {*} height 
 * @param {*} m 
 */
export function getThumbUrl(option={}){

  let {imgurl, width, height,m} = option;
  if(!imgurl||typeof imgurl==="undefined"){
      return imageNotAvailable;
  }
  if(!/(.*)\.(png|gif|jpg|jpeg)$/i.test(imgurl)){
    return imgurl;
  }
  if(typeof m==='undefined'){
      m='';
  }
  if(imgurl.indexOf('x-oss-process=image/resize')!=-1){
      return imgurl;
  }
  var w = getViewPort().dpr * width;
  var h = getViewPort().dpr * height;
  w  = parseInt(width);
  h  = parseInt(height);
  w  = w>4096?4096:w;
  h  = h>4096?4096:h;
  w  = w<1?1:h;
  h  = h<1?1:h;


  var urlInfo = parseURL(imgurl);
  var   isAliyun = false;
  if(urlInfo['host']!=undefined){
      //判断是否阿里云，不是的话，采用服务端的缩放程序
      if(urlInfo['host'].toLowerCase().indexOf('aliyuncs.com')!=-1){
          isAliyun = true;
      }
      if(isAliyun){
          var appendFillMode = '';
          if(m=='lfit'||m=='mfit'||m=='fill'||m=='pad'||m=='fixed'){
              appendFillMode = ',m_'+ m;
          }
          return imgurl + '?x-oss-process=image/resize,w_' + w + ',h_' + h+appendFillMode;
      }else{
          //如果服务端压力大，可以改为直接返回imgurl
          //console.log('THUMB:',Config.thumbUrl + '?src='+encodeURIComponent(imgurl)+'&w='+retinaWidth+'&h='+retinaHeight);
          //return '/thumb.php?src='+encodeURIComponent(imgurl)+'&w='+w+'&h='+h;
          //TODO:服务端缩略待设计
          return imgurl;
      }
  }else{
      return imgurl;
  }
}