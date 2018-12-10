var ThirdAPI = require('ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
		processBar:cc.Node,
		numLabel:cc.Node,
		cancleLabel:cc.Node,
		rate:10,
		action:0,
		openType:null,
		callback:null,
    },
    onLoad () {
		var self = this;
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
		this.numLabel.getComponent(cc.Label).string = 10;
		this.processBar.getComponent(cc.ProgressBar).progress = 1;
		this.cancleLabel.runAction(cc.fadeOut());
		this.node.scale = 0.5;
	},
	continueNow(event){
		this.unschedule(this.loadUpdate);
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
	cancleButtonCb(){
		console.log('cancleButtonCb');
		this.unschedule(this.loadUpdate);
		this.node.removeFromParent();
		this.node.destroy();
		this.callback();
	},
	shareSuccessCb(type, shareTicket, arg){
		if(arg.iscallBack == false){
			console.log(type, shareTicket, arg);
			arg.EventCustom.setUserData({type:'ReliveBack',action:arg.action});
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
	waitCallBack(action,prop,cb){
		var self = this;
		this.callback = cb;
		this.node.runAction(cc.scaleTo(0.2,1));
		this.openType = prop;
		this.action = action;
		this.loadUpdate = function(){
			self.rate = self.rate - 1;
			this.numLabel.getComponent(cc.Label).string = self.rate;
			var scale = self.rate/10;
			console.log(scale);
			self.processBar.getComponent(cc.ProgressBar).progress = scale;
			if(self.rate <= 0){
				self.unschedule(self.loadUpdate);
				cb();
			}
		};
		this.schedule(this.loadUpdate,1);
		this.cancleLabel.runAction(cc.sequence(cc.delayTime(4),cc.fadeIn()));
	}
});
