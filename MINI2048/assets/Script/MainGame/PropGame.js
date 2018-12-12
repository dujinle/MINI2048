var ThirdAPI = require('ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
		propKey:null,
		openType:null,
		cancelNode:cc.Node,
		bgContext:cc.Node,
		iscallBack:false,
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
		 this.EventCustom = new cc.Event.EventCustom("dispatchEvent", true);
		 this.cancelNode.active = false;
		 this.iscallBack = false;
		 this.bgContext.scale = 0.2;
	},
	initLoad(startPos,openType,prop){
		var self = this;
		this.startPos = startPos;
		this.openType = openType;
		this.propKey = prop;
		this.bgContext.runAction(cc.scaleTo(GlobalData.TimeActionParam.PropSBAScaleTime,1));
		setTimeout(function(){
			self.cancelNode.active = true;
		},1000);
	},
	buttonCb(){
		this.iscallBack = false;
		if(this.openType == "PropShare"){
			var param = {
				type:null,
				arg:this,
				successCallback:this.shareSuccessCb,
				failCallback:this.shareFailedCb,
				shareName:this.openType,
				isWait:true
			};
			if(GlobalData.cdnGameConfig.shareCustomSet == 0){
				param.isWait = false;
			}
			ThirdAPI.shareGame(param);
		}else if(this.openType == "PropAD"){
			console.log(this.openType);
		}
	},
	shareSuccessCb(type, shareTicket, arg){
		if(arg.iscallBack == false){
			console.log(type, shareTicket, arg);
			arg.EventCustom.setUserData({type:'PropShareSuccess',propKey:arg.propKey,startPos:arg.startPos});
			arg.node.dispatchEvent(arg.EventCustom);
		}
		arg.iscallBack = true;
	},
	shareFailedCb(type,arg){
		if(arg.iscallBack == false && arg.node.active == true){
			if(arg.failNode != null){
				arg.failNode.stopAllActions();
				arg.failNode.removeFromParent();
				arg.failNode.destroy();
				arg.failNode = null;
			}
			arg.failNode = cc.instantiate(GlobalData.assets['PBShareFail']);
			arg.node.addChild(arg.failNode);
			var actionEnd = cc.callFunc(function(){
				if(arg.failNode != null){
					arg.failNode.stopAllActions();
					arg.failNode.removeFromParent();
					arg.failNode.destroy();
					arg.failNode = null;
				}
			},arg);
			arg.failNode.runAction(cc.sequence(cc.fadeIn(0.5),cc.delayTime(1),cc.fadeOut(0.5),actionEnd));
			console.log(type,arg);
		}
		arg.iscallBack = true;
	},
	//道具个数发生变化
	propFreshNum(prop,propNode){
		if(prop == 'PropFresh'){
			propNode.getChildByName("numLabel").getComponent(cc.Label).string = "x" + GlobalData.GamePropParam.bagNum['PropFresh'];
		}else if(prop == 'PropHammer'){
			if(GlobalData.GamePropParam.bagNum['PropHammer'] > 0){
				propNode.getChildByName("add").active = false;
				propNode.getChildByName("numLabel").active = true;
				propNode.getChildByName("numLabel").getComponent(cc.Label).string = "x" + GlobalData.GamePropParam.bagNum['PropHammer'];
			}else{
				propNode.getChildByName("add").active = true;
				propNode.getChildByName("numLabel").active = false;
			}
		}else if(prop == 'PropBomb'){
			if(GlobalData.GamePropParam.bagNum['PropBomb'] > 0){
				propNode.getChildByName("add").active = false;
				propNode.getChildByName("numLabel").active = true;
				propNode.getChildByName("numLabel").getComponent(cc.Label).string = "x" + GlobalData.GamePropParam.bagNum['PropBomb'];
			}else{
				propNode.getChildByName("add").active = true;
				propNode.getChildByName("numLabel").active = false;
			}
		}
	},
	cancel(){
		this.node.removeFromParent();
		this.node.destroy();
	}
});
