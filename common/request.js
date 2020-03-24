import urlConfig from './config.js'

const request = {}
const headers = {}
const PORT1 = '/baseinfo'

	
request.globalRequest = (url, method, data, power) => {
	

	/*     权限判断 因为有的接口请求头可能需要添加的参数不一样，所以这里做了区分
	== 不通过access_token校验的接口
	== 文件下载接口列表
	== 验证码登录 */
    let token=uni.getStorageSync("token");
	
    switch (power){
        case 1:
            headers['Content-Type'] = 'application/x-www-form-urlencoded'
            break;
        case 2:
            headers['Authorization'] = 'Basic a3N1ZGlfcGM6a3N1ZGlfcGM='
            break;
        case 3:
            responseType = 'blob'
            break;
		case 4:
		   headers['content-type']= 'application/x-www-form-urlencoded;charset-UTF-8'
		   break;
        default:
            headers['Authorization'] = `Bearer ${
                this.$store.getters.userInfo
            }`
            headers['TENANT-ID'] = this.$store.getters.userInfo.tenant_id
            break;
    }
	if(token){
		 headers['authorize-token'] = token
	}
            
    return uni.request({
        url: urlConfig + url,
        method,
        data: data,
        dataType: 'json',
        header: headers
    }).then(res => {
		let result=res[1];
		if(result.data.code=='10005'){
			uni.navigateTo({
				url:'/pages/register/register'
			})
		}
		return result;
    }).catch(parmas => {

　　　　　　switch (parmas.code) {
　　　　　　　　case 401:
　　　　　　　　　　uni.clearStorageSync()
　　　　　　　　　　break
　　　　　　　　default:
　　　　　　　　　　uni.showToast({
　　　　　　　　　　　　title: parmas.message,
　　　　　　　　　　　　icon: 'none'
　　　　　　　　　　})
　　　　　　　　　　return Promise.reject()
　　　　　　　　　　break
　　　　　　}

　　})
 } 

export default request