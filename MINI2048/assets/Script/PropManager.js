let PropManager = {
	//获取道具
	getProp(mergeNum){
		//获取 刷新/宝箱的概率
		var propsRate = GlobalData.cdnPropParam.MergeParam[mergeNum];
		//随机获取一个道具 刷新或者宝箱
		var prop = this.getRandomRateKey(propsRate);
		if(prop == null){
			return null;
		}
		//随机的刷新道具
		if(prop == "PropFresh"){
			//并且道具已经开锁
			if(GlobalData.cdnPropParam.PropUnLock[prop] <= GlobalData.gameRunTimeParam.juNum){
				return prop;
			}
		}else if(prop == "PropSAB"){
			//随机的道具打开方式 分享、广告、宝箱
			propsRate = GlobalData.cdnPropParam.PropSABRate;
			prop = this.getRandomRateKey(propsRate);
			//如果是分享则判断是否解锁
			if(prop == "PropShare"){
				if(GlobalData.cdnPropParam.ShareUnLock > GlobalData.gameRunTimeParam.juNum){
					return null;
				}
			}else if(prop == "PropAD"){
				if(GlobalData.cdnPropParam.AdUnLock > GlobalData.gameRunTimeParam.juNum){
					return null;
				}
			}
			propsRate = GlobalData.cdnPropParam.SABOpenRate;
			var secondProp = this.getRandomRateKey(propsRate);;
			if(GlobalData.cdnPropParam.PropUnLock[secondProp] <= GlobalData.gameRunTimeParam.juNum){
				return prop + "_" + secondProp;;
			}
		}
		return null;
	},
	getRandomRateKey(propsRate){
		var prop = null;
		var random = Math.random();
		var randomTmp = 0;
		for(var key in propsRate){
			console.log(key,propsRate[key]);
			if(random > randomTmp && random <= propsRate[key] + randomTmp){
				prop = key;
			}
			randomTmp = randomTmp + propsRate[key];
		}
		console.log("PropManager.getProp",random,propsRate,prop);
		return prop;
	}
};
module.exports = PropManager;