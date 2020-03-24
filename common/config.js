let url_config = ""
process.env.NODE_ENV
console.log(process.env)

if(process.env.NODE_ENV === 'development' && !process.env.VUE_APP_ADD){
    // 开发环境
	  url_config = 'http://10.10.64.125:8087'
	// url_config = 'http://10.10.29.64:8088/'
	// url_config = 'http://10.10.96.111:8010'
}else if(process.env.NODE_ENV === 'production' && process.env.VUE_APP_ADD==='test') {
	url_config = 'https://xxxx.xxx.com'
}else if(process.env.NODE_ENV === 'production' && process.env.VUE_APP_ADD==='uat') {

}else if(process.env.NODE_ENV === 'production' && !process.env.VUE_APP_ADD){
	//url_config = 'https://bxrcbfun.purang.com'
}else{
	// url_config = 'http://10.10.96.111:8010'
    // 生产环境
    // url_config = 'https://*****.com/'
	
}

export default url_config