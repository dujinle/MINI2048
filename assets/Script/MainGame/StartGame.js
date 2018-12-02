
cc.Class({
    extends: cc.Component,

    properties: {
		rate:0,
		resLength:0,
		startButton:cc.Node,
		gameLogo:cc.Node,
		buttonLayout:cc.Node,
		scoreLabel:cc.Node,
		kingSprite:cc.Node,
    },

    onLoad () {
		this.node.active = false;
		this.startButton.getComponent(cc.Button).interactable = false;
		this.resLength = 23;
		if(GlobalData.assets == null){
			GlobalData.assets = {};
			this.loadRes();
			this.schedule(this.loadUpdate,0.5);
		}
	},
	showStart(){
		console.log("start game board show");
		this.node.active = true;
		this.scoreLabel.active = true;
		this.kingSprite.active = true;
		this.scoreLabel.getComponent(cc.Label).string = GlobalData.lastScore;
		var winSize = this.node.getContentSize();
		//logo 效果设置
		var logoPos = this.gameLogo.getPosition();
		var logoSize = this.gameLogo.getContentSize();
		var logoY = winSize.height/2 + logoSize.height/2;
		this.gameLogo.setPosition(cc.p(logoPos.x,logoY));
		var logoMoveTo = cc.moveTo(GlobalData.startGameTime,logoPos);
		this.gameLogo.runAction(logoMoveTo);
		//开始效果设置
		var startPos = this.startButton.getPosition();
		var startSize = this.startButton.getContentSize();
		var startX = (startSize.width/2 + winSize.width/2) * -1;
		this.startButton.setPosition(cc.p(startX,startPos.y));
		var startMoveTo = cc.moveTo(GlobalData.startGameTime,startPos);
		this.startButton.runAction(startMoveTo);
		//分享，排行，声音效果设置
		var layoutPos = this.buttonLayout.getPosition();
		var layoutSize = this.buttonLayout.getContentSize();
		var layoutY = (winSize.height/2 + logoSize.height/2) * -1;
		this.buttonLayout.setPosition(cc.p(layoutPos.x,layoutY));
		var layoutMoveTo = cc.moveTo(GlobalData.startGameTime,layoutPos);
		this.buttonLayout.runAction(layoutMoveTo);
	},
	hideStart(){
		var self = this;
		console.log("start game board hide");
		var winSize = this.node.getContentSize();
		//logo 效果设置
		var logoPos = this.gameLogo.getPosition();
		var logoSize = this.gameLogo.getContentSize();
		var logoY = winSize.height/2 + logoSize.height/2;
		var logoMoveTo = cc.moveTo(GlobalData.startGameTime,cc.p(logoPos.x,logoY));
		this.gameLogo.runAction(logoMoveTo);
		//开始效果设置
		var startPos = this.startButton.getPosition();
		var startSize = this.startButton.getContentSize();
		var startX = (startSize.width/2 + winSize.width/2) * -1;
		var startMoveTo = cc.moveTo(GlobalData.startGameTime,cc.p(startX,startPos.y));
		this.startButton.runAction(startMoveTo);
		//分享，排行，声音效果设置
		var layoutPos = this.buttonLayout.getPosition();
		var layoutSize = this.buttonLayout.getContentSize();
		var layoutY = (winSize.height/2 + logoSize.height/2) * -1;
		var layoutMoveTo = cc.moveTo(GlobalData.startGameTime,cc.p(layoutPos.x,layoutY));
		this.buttonLayout.runAction(layoutMoveTo);
		setTimeout(function(){
			self.scoreLabel.active = false;
			self.kingSprite.active = false;
			self.node.active = false;
		},GlobalData.startGameTime * 1000 + 20);
	},
	loadUpdate(){
		cc.log("this.rate:" + this.rate);
		var scale = Math.floor((this.rate/this.resLength ) * 100);
		if(this.rate >= this.resLength){
			this.unschedule(this.loadUpdate);
			this.startButton.getComponent(cc.Button).interactable = true;
		}
	},
	//异步加载数据
	loadRes(){
		var self = this;
		cc.loader.loadResDir("numsAtlas",cc.SpriteFrame,function (err, assets) {
			for(var i = 0;i < assets.length;i++){
				GlobalData.assets[assets[i].name] = assets[i];
				self.rate = self.rate + 1;
				cc.log("load res :" + assets[i].name);
			}
		});
		cc.loader.loadResDir("prefabs",function (err, assets) {
			for(var i = 0;i < assets.length;i++){
				GlobalData.assets[assets[i].name] = assets[i];
				self.rate = self.rate + 1;
				cc.log("load res prefab:" + assets[i].name);
			}
		});
	},
    // update (dt) {},
});
