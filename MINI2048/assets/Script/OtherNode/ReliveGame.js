cc.Class({
    extends: cc.Component,

    properties: {
		processBar:cc.Node,
		numLabel:cc.Node,
		rate:10,
		openType:null,
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
	},
	continueNow(event){
		if(this.iscallBack == false){
			this.unschedule(this.loadUpdate);
		}
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
			ThirdAPI.shareGame(param);
		}else if(this.openType == "PropAD"){
			console.log(this.openType);
		}
	},
	shareSuccessCb(type, shareTicket, arg){
		if(arg.iscallBack == false){
			console.log(type, shareTicket, arg);
			this.EventCustom.setUserData({type:'ReliveBack'});
			this.node.dispatchEvent(this.EventCustom);
		}
		arg.iscallBack = true;
	},
	shareFailedCb(type,arg){
		if(arg.iscallBack == false && arg.node.active == true){
			var failNode = cc.instantiate(GlobalData.assets['PBShareFail']);
			arg.node.addChild(failNode);
			var actionEnd = cc.callFunc(function(){
				failNode.removeFromParent();
				failNode.destroy();
			},arg);
			failNode.runAction(cc.sequence(cc.fadeIn(0.5),cc.delayTime(1),cc.fadeOut(0.5),actionEnd));
		}
		arg.iscallBack = true;
	},
	waitCallBack(prop,cb){
		this.openType = prop;
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
	}
});
