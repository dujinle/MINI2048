var ThirdAPI = require('ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
		startButton:cc.Node,
		gameLogo:cc.Node,
		buttonLayout:cc.Node,
		scoreLabel:cc.Node,
		kingSprite:cc.Node,
		gameStart:false,
		soundOnNode:cc.Node,
		soundOffNode:cc.Node,
    },
	shareButtonCb(){
		var param = {
			type:null,
			arg:null,
			successCallback:this.shareSuccessCb,
			failCallback:this.shareFailedCb,
			shareName:'啊啊啊',
			isWait:false
		};
		ThirdAPI.shareGame(param);
	},
	shareSuccessCb(type, shareTicket, arg){
		console.log(type, shareTicket, arg);
	},
	shareFailedCb(type,arg){
		console.log(type,arg);
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
	showStart(){
		console.log("start game board show");
		if(GlobalData.AudioSupport == false){
			this.soundOnNode.active = false;
			this.soundOffNode.active = true;
		}else{
			this.soundOnNode.active = true;
			this.soundOffNode.active = false;
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
			//分享，排行，声音效果设置
			this.layoutPos = this.buttonLayout.getPosition();
			var layoutSize = this.buttonLayout.getContentSize();
			var layoutY = (winSize.height/2 + logoSize.height/2) * -1;
			this.buttonLayout.setPosition(cc.p(this.layoutPos.x,layoutY));
			var layoutMoveTo = cc.moveTo(GlobalData.TimeActionParam.StartGameMoveTime,this.layoutPos);
			this.buttonLayout.runAction(layoutMoveTo);
			this.gameStart = true;
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
			//分享，排行，声音效果设置
			var layoutMoveTo = cc.moveTo(GlobalData.TimeActionParam.StartGameMoveTime,this.layoutPos);
			this.buttonLayout.runAction(layoutMoveTo);
		}
	},
	hideStart(callBack){
		var self = this;
		console.log("start game board hide");
		var winSize = this.node.getContentSize();
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
		this.node.runAction(cc.sequence(
			cc.delayTime(GlobalData.TimeActionParam.StartGameMoveTime),
			hideAction
		));
		/*
		setTimeout(function(){
			self.scoreLabel.active = false;
			self.kingSprite.active = false;
			self.node.active = false;
			callBack();
		},GlobalData.TimeActionParam.StartGameMoveTime * 1000 + 20);
		*/
	},
});
