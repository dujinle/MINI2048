var ThirdAPI = require('ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
		propKey:null,
		propFresh:cc.Node,
		propBomb:cc.Node,
		propHammer:cc.Node,
		cancelNode:cc.Node,
		mainGameBoard:cc.Node,
    },

    onLoad () {
		cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchMoved: function (touch, event) {            // 触摸移动时触发
            },
            onTouchEnded: function (touch, event) {            // 点击事件结束处理
			}
         }, this.node);
	},
	initLoad(startPos,openType,prop){
		var self = this;
		this.node.active = true;
		this.cancelNode.active = false;
		this.openType = openType;
		this.startPos = startPos;
		this.propKey = prop;
		setTimeout(function(){
			self.cancelNode.active = true;
		},1000);
	},
	buttonCb(){
		if(this.openType == "PropShare"){
			var param = {
				type:null,
				arg:this,
				successCallback:this.shareSuccessCb,
				failCallback:this.shareFailedCb,
				shareName:this.openType,
				isWait:false
			};
			ThirdAPI.shareGame(param);
		}else if(this.openType == "PropAD"){
			console.log(this.openType);
		}else if(this.openType == "PropBao"){
			this.flyPropOpen();
		}
	},
	shareSuccessCb(type, shareTicket, arg){
		console.log(type, shareTicket, arg);
		arg.flyPropOpen();
	},
	flyPropOpen(){
		var self = this;
		if(this.propKey != null){
			this.node.active = false;
			
			var mainGameBoard = this.mainGameBoard;
			var spriteName = null;
			var propNode = null;
			if(this.propKey == "PropFresh"){
				spriteName = "deletePropIcon";
				propNode = this.propFresh;
			}else if(this.propKey == "PropBomb"){
				spriteName = "bomb";
				propNode = this.propBomb;
			}else if(this.propKey == "PropHammer"){
				spriteName = "clearPropIcon";
				propNode = this.propHammer;
			}else{
				return;
			}
			//判断是否超过使用上限
			if(GlobalData.cdnPropParam.PropParam[this.propKey].useNum >= 0){
				if(GlobalData.GamePropParam.useNum[this.propKey] >= GlobalData.cdnPropParam.PropParam[this.propKey].useNum){
					return;
				}
			}
			//判断背包数量是否少于上限值
			if(GlobalData.GamePropParam.bagNum[this.propKey] >= GlobalData.cdnPropParam.PropParam[self.propKey].bagNum){
				return;
			}
			var flyProp = cc.instantiate(GlobalData.assets["PBPropFly"]);
			mainGameBoard.addChild(flyProp);
			flyProp.setPosition(this.startPos);
			flyProp.getComponent("NumFly").startFly(0.2,spriteName,1,propNode.getPosition(),function(){
				GlobalData.GamePropParam.bagNum[self.propKey] += 1;
				propNode.getChildByName("numLabel").getComponent(cc.Label).string = "x" + GlobalData.GamePropParam.bagNum[self.propKey];
			});
		}
	},
	shareFailedCb(type,arg){
		console.log(type,arg);
	},
	cancel(){
		this.node.active = false;
	}
});
