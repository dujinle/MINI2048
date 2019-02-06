var WxVideoAd = require('WxVideoAd');
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
		},2000);
	},
	buttonCb(){
		this.iscallBack = false;
		if(this.openType == "PropShare"){
			var param = {
				type:null,
				arg:null,
				successCallback:this.shareSuccessCb.bind(this),
				failCallback:this.shareFailedCb.bind(this),
				shareName:this.openType,
				isWait:true
			};
			if(GlobalData.cdnGameConfig.shareCustomSet == 0){
				param.isWait = false;
			}
			ThirdAPI.shareGame(param);
		}else if(this.openType == "PropAV"){
			console.log(this.openType);
			this.AVSuccessCb = function(arg){
				this.EventCustom.setUserData({
					type:'StartBattleSuccess',
					propKey:'PropBomb',
					startPos:cc.p(0,0)
				});
				this.node.dispatchEvent(this.EventCustom);
			}.bind(this);
			this.AVFailedCb = function(arg){
				this.showFailInfo("看完视频才能获得奖励，请再看一次");
			}.bind(this);
			WxVideoAd.initCreateReward(this.AVSuccessCb,this.AVFailedCb,this);
		}
	},
	shareSuccessCb(type, shareTicket, arg){
		if(this.iscallBack == false){
			console.log(type, shareTicket, arg);
			this.EventCustom.setUserData({type:'PropShareSuccess',propKey:this.propKey,startPos:this.startPos});
			this.node.dispatchEvent(this.EventCustom);
		}
		this.iscallBack = true;
	},
	shareFailedCb(type,arg){
		if(this.iscallBack == false && this.node.active == true){
			this.showFailInfo(null);
			console.log(type,arg);
		}
		this.iscallBack = true;
	},
	showFailInfo(msg){
		if(this.failNode != null){
			this.failNode.stopAllActions();
			this.failNode.removeFromParent();
			this.failNode.destroy();
			this.failNode = null;
		}
		this.failNode = cc.instantiate(GlobalData.assets['PBShareFail']);
		this.node.addChild(this.failNode);
		if(msg != null){
			this.failNode.getChildByName('tipsLabel').getComponent(cc.Label).string = msg;
		}
		var actionEnd = cc.callFunc(function(){
			if(this.failNode != null){
				this.failNode.stopAllActions();
				this.failNode.removeFromParent();
				this.failNode.destroy();
				this.failNode = null;
			}
		}.bind(this),this);
		this.failNode.runAction(cc.sequence(cc.fadeIn(0.5),cc.delayTime(1),cc.fadeOut(0.5),actionEnd));
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
		this.EventCustom.setUserData({type:'PropGameCancle'});
		this.node.dispatchEvent(this.EventCustom);
		this.node.removeFromParent();
		this.node.destroy();
	}
});
