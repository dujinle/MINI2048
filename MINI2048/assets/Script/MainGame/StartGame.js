var ThirdAPI = require('ThirdAPI');
var PropManager = require('PropManager');
var WxVideoAd = require('WxVideoAd');
cc.Class({
    extends: cc.Component,

    properties: {
		startButton:cc.Node,
		battleButton:cc.Node,
		gameLogo:cc.Node,
		buttonLayout:cc.Node,
		scoreLabel:cc.Node,
		kingSprite:cc.Node,
		gameStart:false,
		soundOnNode:cc.Node,
		soundOffNode:cc.Node,
		innerChain:cc.Node,
		oneInner:cc.Node,
    },
	onLoad(){
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
	},
	refreshGame(){
		if(this.innerChain.active == true){
			this.initInnerChain(0);
		}
		if(GlobalData.gameRunTimeParam.juNum >= GlobalData.cdnPropParam.PropUnLock['PropBattle']){
			this.battleButton.active = true;
		}else{
			this.battleButton.active = false;
		}
	},
	initInnerChain(time){
		var self = this;
		this.innerChain.active = false;
		if(GlobalData.cdnPropParam.PropUnLock.PropLocker <= GlobalData.gameRunTimeParam.juNum){
			this.innerChain.getComponent('ScrollLinkGame').createAllLinkGame(GlobalData.cdnOtherGameDoor.locker);
			this.node.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(function(){
				self.innerChain.active = true;
			})));
		}
		if(GlobalData.cdnPropParam.PropUnLock.PropInner <= GlobalData.gameRunTimeParam.juNum){
			this.oneInner.getComponent('LockerItem').setLinkGame(GlobalData.cdnOtherGameDoor.InnerChain);
		}
	},
	shareButtonCb(){
		var param = {
			type:null,
			arg:null,
			successCallback:this.shareSuccessCb.bind(this),
			failCallback:this.shareFailedCb.bind(this),
			shareName:'啊啊啊',
			isWait:false
		};
		ThirdAPI.shareGame(param);
	},
	soundButtonCb(){
		if(GlobalData.AudioSupport == false){
			this.soundOnNode.active = true;
			this.soundOffNode.active = false;
			GlobalData.AudioSupport = true;
		}else{
			GlobalData.AudioSupport = false;
			this.soundOnNode.active = false;
			this.soundOffNode.active = true;
		}
	},
	rankButtonCb(){
		this.EventCustom.setUserData({type:'RankView'});
		this.node.dispatchEvent(this.EventCustom);
	},
	startButtonCb(){
		this.EventCustom.setUserData({type:'StartGame'});
		this.node.dispatchEvent(this.EventCustom);
	},
	shareSuccessCb(type, shareTicket, arg){
		console.log(type, shareTicket, arg);
	},
	shareFailedCb(type,arg){
		console.log(type,arg);
	},
	battleButtonCb(){
		if(this.prop == null){
			this.prop = PropManager.getShareOrADKey('PropBattle');
		}
		if(this.prop == 'PropShare'){
			this.isShareCallBack = false;
			var param = {
				type:null,
				arg:null,
				successCallback:this.sharePropSuccessCb.bind(this),
				failCallback:this.sharePropFailedCb.bind(this),
				shareName:this.prop,
				isWait:true
			};
			if(GlobalData.cdnGameConfig.shareCustomSet == 0){
				param.isWait = false;
			}
			ThirdAPI.shareGame(param);
		}
		else if(this.prop == 'PropAV'){
			this.AVSuccessCb = function(arg){
				this.EventCustom.setUserData({
					type:'StartBattleSuccess',
					propKey:'PropBomb',
					startPos:cc.p(0,0)
				});
				this.prop = null;
				this.node.dispatchEvent(this.EventCustom);
			}.bind(this);
			this.AVFailedCb = function(arg){
				this.showFailInfo("看完视频才能获得奖励，请再看一次");
			}.bind(this);
			WxVideoAd.initCreateReward(this.AVSuccessCb,this.AVFailedCb,null);
		}
	},
	sharePropSuccessCb(type, shareTicket, arg){
		this.isShareCallBack = true;
		this.EventCustom.setUserData({
			type:'StartBattleSuccess',
			propKey:'PropBomb',
			startPos:cc.p(0,0)
		});
		this.prop = null;
		this.node.dispatchEvent(this.EventCustom);
	},
	sharePropFailedCb(type,arg){
		if(this.isShareCallBack == false){
			this.showFailInfo(null);
		}
		this.isShareCallBack = true;
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
	showStart(){
		console.log("start game board show");
		if(GlobalData.AudioSupport == false){
			this.soundOnNode.active = false;
			this.soundOffNode.active = true;
		}else{
			this.soundOnNode.active = true;
			this.soundOffNode.active = false;
		}
		if(GlobalData.gameRunTimeParam.juNum >= GlobalData.cdnPropParam.PropUnLock['PropBattle']){
			this.battleButton.active = true;
		}else{
			this.battleButton.active = false;
		}
		if(this.gameStart == false){
			this.node.active = true;
			this.scoreLabel.active = true;
			this.kingSprite.active = true;
			this.scoreLabel.getComponent(cc.Label).string = GlobalData.gameRunTimeParam.maxScore;
			var winSize = this.node.getContentSize();
			//logo 效果设置
			this.logoPos = this.gameLogo.getPosition();
			var logoSize = this.gameLogo.getContentSize();
			var logoY = winSize.height/2 + logoSize.height/2;
			this.gameLogo.setPosition(cc.p(this.logoPos.x,logoY));
			var logoMoveTo = cc.moveTo(GlobalData.TimeActionParam.StartGameMoveTime,this.logoPos);
			this.gameLogo.runAction(logoMoveTo);
			//开始效果设置
			this.startPos = this.startButton.getPosition();
			var startSize = this.startButton.getContentSize();
			var startX = (startSize.width/2 + winSize.width/2) * -1;
			this.startButton.setPosition(cc.p(startX,this.startPos.y));
			var startMoveTo = cc.moveTo(GlobalData.TimeActionParam.StartGameMoveTime,this.startPos);
			this.startButton.runAction(startMoveTo);
			
			//挑战效果设置
			this.battlePos = this.battleButton.getPosition();
			var battleSize = this.battleButton.getContentSize();
			var battleX = (battleSize.width/2 + winSize.width/2);
			this.battleButton.setPosition(cc.p(battleX,this.battlePos.y));
			var battleMoveTo = cc.moveTo(GlobalData.TimeActionParam.StartGameMoveTime,this.battlePos);
			if(GlobalData.gameRunTimeParam.juNum >= GlobalData.cdnPropParam.PropUnLock['PropBattle']){
				this.battleButton.runAction(battleMoveTo);
			}
			//分享，排行，声音效果设置
			this.layoutPos = this.buttonLayout.getPosition();
			var layoutSize = this.buttonLayout.getContentSize();
			var layoutY = (winSize.height/2 + logoSize.height/2) * -1;
			this.buttonLayout.setPosition(cc.p(this.layoutPos.x,layoutY));
			var layoutMoveTo = cc.moveTo(GlobalData.TimeActionParam.StartGameMoveTime,this.layoutPos);
			this.buttonLayout.runAction(layoutMoveTo);
			this.gameStart = true;
			this.initInnerChain(GlobalData.TimeActionParam.StartGameMoveTime);
		}else{
			this.node.active = true;
			this.scoreLabel.active = true;
			this.kingSprite.active = true;
			this.scoreLabel.getComponent(cc.Label).string = GlobalData.gameRunTimeParam.maxScore;
			//logo 效果设置
			var logoMoveTo = cc.moveTo(GlobalData.TimeActionParam.StartGameMoveTime,this.logoPos);
			this.gameLogo.runAction(logoMoveTo);
			//开始效果设置
			var startMoveTo = cc.moveTo(GlobalData.TimeActionParam.StartGameMoveTime,this.startPos);
			this.startButton.runAction(startMoveTo);
			//挑战效果设置
			var battleMoveTo = cc.moveTo(GlobalData.TimeActionParam.StartGameMoveTime,this.battlePos);
			if(GlobalData.gameRunTimeParam.juNum >= GlobalData.cdnPropParam.PropUnLock['PropBattle']){
				this.battleButton.runAction(battleMoveTo);
			}
			//分享，排行，声音效果设置
			var layoutMoveTo = cc.moveTo(GlobalData.TimeActionParam.StartGameMoveTime,this.layoutPos);
			this.buttonLayout.runAction(layoutMoveTo);
		}
	},
	hideStaticStart(callBack){
		var self = this;
		//this.node.active = false;
		console.log("start game board hide");
		var winSize = this.node.getContentSize();
		if(GlobalData.gameRunTimeParam.juNum >= GlobalData.cdnPropParam.PropUnLock['PropBattle']){
			this.battleButton.active = true;
		}else{
			this.battleButton.active = false;
		}
		//logo 效果设置
		var logoPos = this.gameLogo.getPosition();
		var logoSize = this.gameLogo.getContentSize();
		var logoY = winSize.height/2 + logoSize.height/2;
		this.gameLogo.setPosition(cc.p(logoPos.x,logoY));
		//开始效果设置
		var startPos = this.startButton.getPosition();
		var startSize = this.startButton.getContentSize();
		var startX = (startSize.width/2 + winSize.width/2) * -1;
		this.startButton.setPosition(cc.p(startX,startPos.y));
		//挑战效果设置
		var battlePos = this.battleButton.getPosition();
		var battleSize = this.battleButton.getContentSize();
		var battleX = (battleSize.width/2 + winSize.width/2);
		this.battleButton.setPosition(cc.p(battleX,battlePos.y));

		//分享，排行，声音效果设置
		var layoutPos = this.buttonLayout.getPosition();
		var layoutSize = this.buttonLayout.getContentSize();
		var layoutY = (winSize.height/2 + logoSize.height/2) * -1;
		this.buttonLayout.setPosition(cc.p(layoutPos.x,layoutY));
		
		var hideAction = cc.callFunc(function(){
			self.scoreLabel.active = false;
			self.kingSprite.active = false;
			self.node.active = false;
			callBack();
		},this);
		if(this.node.active != false){
			this.node.runAction(hideAction);
		}else{
			callBack();
		}
	},
	hideStart(callBack){
		var self = this;
		console.log("start game board hide");
		var winSize = this.node.getContentSize();
		if(GlobalData.gameRunTimeParam.juNum >= GlobalData.cdnPropParam.PropUnLock['PropBattle']){
			this.battleButton.active = true;
		}else{
			this.battleButton.active = false;
		}
		//logo 效果设置
		var logoPos = this.gameLogo.getPosition();
		var logoSize = this.gameLogo.getContentSize();
		var logoY = winSize.height/2 + logoSize.height/2;
		var logoMoveTo = cc.moveTo(GlobalData.TimeActionParam.StartGameMoveTime,cc.p(logoPos.x,logoY));
		this.gameLogo.runAction(logoMoveTo);
		//开始效果设置
		var startPos = this.startButton.getPosition();
		var startSize = this.startButton.getContentSize();
		var startX = (startSize.width/2 + winSize.width/2) * -1;
		var startMoveTo = cc.moveTo(GlobalData.TimeActionParam.StartGameMoveTime,cc.p(startX,startPos.y));
		this.startButton.runAction(startMoveTo);
		//挑战效果设置
		var battlePos = this.battleButton.getPosition();
		var battleSize = this.battleButton.getContentSize();
		var battleX = (battleSize.width/2 + winSize.width/2);
		var battleMoveTo = cc.moveTo(GlobalData.TimeActionParam.StartGameMoveTime,cc.p(battleX,battlePos.y));
		if(GlobalData.gameRunTimeParam.juNum >= GlobalData.cdnPropParam.PropUnLock['PropBattle']){
			this.battleButton.runAction(battleMoveTo);
		}
		//分享，排行，声音效果设置
		var layoutPos = this.buttonLayout.getPosition();
		var layoutSize = this.buttonLayout.getContentSize();
		var layoutY = (winSize.height/2 + logoSize.height/2) * -1;
		var layoutMoveTo = cc.moveTo(GlobalData.TimeActionParam.StartGameMoveTime,cc.p(layoutPos.x,layoutY));
		this.buttonLayout.runAction(layoutMoveTo);
		
		var hideAction = cc.callFunc(function(){
			self.scoreLabel.active = false;
			self.kingSprite.active = false;
			self.node.active = false;
			callBack();
		},this);
		if(this.node.active == true){
			this.node.runAction(cc.sequence(
				cc.delayTime(GlobalData.TimeActionParam.StartGameMoveTime),
				hideAction
			));
		}else{
			callBack();
		}
	},
});
