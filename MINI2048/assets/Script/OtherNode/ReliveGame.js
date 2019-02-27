var ThirdAPI = require('ThirdAPI');
var WxVideoAd = require('WxVideoAd');
cc.Class({
    extends: cc.Component,

    properties: {
		processBar:cc.Node,
		numLabel:cc.Node,
		cancleLabel:cc.Node,
		openSprite:cc.Node,
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
		if(event != null){
			this.unschedule(this.loadUpdate);
		}
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
			this.AVSuccessCb = function(arg){
				this.EventCustom.setUserData({type:'ReliveBack',action:this.action});
				this.node.dispatchEvent(this.EventCustom);
			};
			this.AVFailedCb = function(arg){
				this.showFailInfo();
			};
			WxVideoAd.initCreateReward(this.AVSuccessCb.bind(this),this.AVFailedCb.bind(this),null);
		}
	},
	cancleButtonCb(){
		try{
			this.unschedule(this.loadUpdate);
			var self = this;
			var content = '求助好友可继续游戏，要求助吗？';
			var confirmText = '原地复活';
			var cancelText = '放弃求助'
			if(this.openType == 'PropAV'){
				content = '观看视频可继续游戏，要观看吗？';
				confirmText = '视频复活';
				cancelText = '放弃复活';
			}
			wx.showModal({
				title:'复活',
				content:content,
				cancelText:cancelText,
				confirmText:confirmText,
				confirmColor:'#53679c',
				success(res){
					if (res.confirm) {
						self.continueNow(null);
					}else if(res.cancel){
						//self.schedule(self.loadUpdate,1);
						self.callback();
						self.node.removeFromParent();
						self.node.destroy();
					}
				}
			});
		}catch(err){}
	},
	shareSuccessCb(type, shareTicket, arg){
		if(this.iscallBack == false){
			console.log(type, shareTicket, arg);
			this.EventCustom.setUserData({type:'ReliveBack',action:this.action});
			this.node.dispatchEvent(this.EventCustom);
		}
		this.iscallBack = true;
	},
	shareFailedCb(type,arg){
		if(this.iscallBack == false && this.node.active == true){
			this.showFailInfo();
		}
		this.iscallBack = true;
	},
	showFailInfo(){
		try{
			var self = this;
			var content = '请分享到不同的群获得更多的好友帮助!';
			if(this.openType == 'PropAV'){
				content = '看完视频才能获得奖励，请再看一次!';
			}
			wx.showModal({
				title:'提示',
				content:content,
				cancelText:'取消',
				confirmText:'确定',
				confirmColor:'#53679c',
				success(res){
					if (res.confirm) {
						self.continueNow(null);
					}else if(res.cancel){
						self.callback();
						self.node.removeFromParent();
						self.node.destroy();
						//self.schedule(self.loadUpdate,1);
					}
				}
			});
		}catch(err){}
		/*
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
		*/
	},
	waitCallBack(action,prop,cb){
		var self = this;
		this.callback = cb;
		this.node.runAction(cc.scaleTo(0.2,1));
		this.openType = prop;
		this.action = action;
		if(this.openType == 'PropShare'){
			this.openSprite.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['share'];
		}else if(this.openType == 'PropAV'){
			this.openSprite.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['share_video'];
		}
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
