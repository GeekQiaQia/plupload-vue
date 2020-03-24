import request from '../common/request.js'


const api = {}
const PORT1 = 'baseinfo'


api.GetSignature= params => request.globalRequest(`/system/video/signature.htm`, 'POST', params, 4) ;

api.uploadAuthVideo= params => request.globalRequest(`/system/upload_auth_video.htm`, 'POST', params, 4) ;

// 获取阿里云签名
api.serverURL="/system/video/signature.htm";


export default api