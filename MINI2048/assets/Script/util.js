let util = {
	getRandomIndexForArray(array){
		if(array == null || array.length == 0){
			return -1;
		}
		var random = Math.floor(Math.random()*array.length);
		return random;
	},
	//节点距离计算欧式公式
	euclDist:function(pos1,pos2){
		var a = pos1.x - pos2.x;
		var b = pos1.y - pos2.y;
		var dist = Math.sqrt(a * a + b * b);
		return dist;
	},
	reSetPropShareOrADRate(){
		var ucPropSAB = GlobalData.cdnPropParam.PropShareOrADRate.crazy.unLock.PropSAB;
		var cPropSAB = GlobalData.cdnPropParam.PropShareOrADRate.crazy.lock.PropSAB;
		var unPropSAB = GlobalData.cdnPropParam.PropShareOrADRate.normal.unLock.PropSAB;
		var nPropSAB = GlobalData.cdnPropParam.PropShareOrADRate.normal.lock.PropSAB;
		ucPropSAB.PropShare = GlobalData.cdnGameConfig.PropShare;
		ucPropSAB.PropAD = GlobalData.cdnGameConfig.PropAD;
		
		cPropSAB.PropShare = GlobalData.cdnGameConfig.PropShare;
		cPropSAB.PropAD = GlobalData.cdnGameConfig.PropAD;
		
		unPropSAB.PropShare = GlobalData.cdnGameConfig.PropShare;
		unPropSAB.PropAD = GlobalData.cdnGameConfig.PropAD;
		
		nPropSAB.PropShare = GlobalData.cdnGameConfig.PropShare;
		nPropSAB.PropAD = GlobalData.cdnGameConfig.PropAD;
	},
	//获取随机数
	getRandomNum:function(rateType){
		var randomNumber = Math.random();
		var startRate = 0.0;
		//console.log("getRandomNum",randomNumber);
		for(var num in rateType){
			var rateTmp = rateType[num];
			if(randomNumber > startRate && randomNumber <= startRate + rateTmp){
				//console.log("getRandomNum",num);
				return num;
			}
			startRate += rateTmp;
		}
		
		//这里返回2 避免rateType设置错误导致无效
		return -1;
	},
	refreshOneNum(){
		var num = -1;//test[GlobalData.gameRunTimeParam.stepNum % test.length];
		if(GlobalData.gameRunTimeParam.juNum <= 15){
			while(num == -1){
				var lastKey = 'default';
				for(var key in GlobalData.cdnNumRate){
					if(GlobalData.gameRunTimeParam.stepNum <= key){
						lastKey = key;
						break;
					}
				}
				num = this.getRandomNum(GlobalData.cdnNumRate[lastKey]);
			}
		}else{
			while(num == -1){
				var lastKey = 'default';
				for(var key in GlobalData.cdnNumRate15){
					if(GlobalData.gameRunTimeParam.stepNum <= key){
						lastKey = key;
						break;
					}
				}
				num = this.getRandomNum(GlobalData.cdnNumRate15[lastKey]);
			}
		}
		return num;
	},
	isArrayFn:function(value){
		if (typeof Array.isArray === "function") {
			return Array.isArray(value);
		}else{
			return Object.prototype.toString.call(value) === "[object Array]";
		}
	},
	//复制对象，如果存在属性则更新
	updateObj:function (newObj,obj,constKey) {
		if(typeof obj !== 'object'){
			console.log('not a object data');
			return;
		}
		//如果是一个数组对象则直接复制
		for(var key in obj){
			if(constKey == key){
				newObj[key] = obj[key];
			}else if(newObj[key] == null){
				newObj[key] = obj[key];
			}else if(typeof obj[key] !== 'object'){
				newObj[key] = obj[key];
			}else if(this.isArrayFn(obj[key])){
				newObj[key] = obj[key];
			}else if(typeof obj[key] == 'object'){
				this.updateObj(newObj[key],obj[key],constKey);
			}
		}
	},
	httpGET:function(url,param,cb){
		var xhr = cc.loader.getXMLHttpRequest();
		if(param == null){
			xhr.open("GET", url,false);
		}else{
			xhr.open("GET", url + "?" + param,false);
		}
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
				var result = JSON.parse(xhr.responseText);
				cb(xhr.status,result);
			}else{
				cb({"code":xhr.status,"message":xhr.message});
			}
		};
		xhr.send(null);
	},
	isIphoneX:function(){
		var size = cc.view.getFrameSize();
        var flag = (size.width == 375 && size.height == 812)
               ||(size.width == 812 && size.height == 375);
		return flag;
	},
	compareVersion:function(v1, v2) {
		v1 = v1.split('.')
		v2 = v2.split('.')
		const len = Math.max(v1.length, v2.length)
		while (v1.length < len) {
			v1.push('0')
		}
		while (v2.length < len) {
			v2.push('0')
		}
		for (let i = 0; i < len; i++) {
			const num1 = parseInt(v1[i])
			const num2 = parseInt(v2[i])
			if (num1 > num2) {
				return 1
			} else if (num1 < num2) {
				return -1
			}
		}
		return 0
	}
};
module.exports = util;