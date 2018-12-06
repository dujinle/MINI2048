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
	isArrayFn:function(value){
		if (typeof Array.isArray === "function") {
			return Array.isArray(value);
		}else{
			return Object.prototype.toString.call(value) === "[object Array]";
		}
	},
	//复制对象，如果存在属性则更新
	updateObj:function (newObj,obj) {
		if(typeof obj !== 'object'){
			console.log('not a object data');
			return;
		}
		//如果是一个数组对象则直接复制
		for(var key in obj){
			if(newObj[key] == null){
				newObj[key] = obj[key];
			}else if(typeof obj[key] !== 'object'){
				newObj[key] = obj[key];
			}else if(this.isArrayFn(obj[key])){
				newObj[key] = obj[key];
			}else if(typeof obj[key] == 'object'){
				this.updateObj(newObj[key],obj[key]);
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
	}
};
module.exports = util;