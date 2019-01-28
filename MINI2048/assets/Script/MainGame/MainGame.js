var ThirdAPI = require('ThirdAPI');
var util = require('util');
var PropManager = require('PropManager');
var WxBannerAd = require('WxBannerAd');
var WxVideoAd = require('WxVideoAd');
cc.Class({
    extends: cc.Component,

    properties: {
		//按钮接收参数
		startButton:cc.Node,
		pauseButton:cc.Node,
		//道具参数
		gamePropFresh:cc.Node,
		gamePropBomb:cc.Node,
		gamePropClear:cc.Node,
		//head 参数
		kingLabel:cc.Node,
		kingSprite:cc.Node,
		scoreLabel:cc.Node,
		battleNode:cc.Node,
		
		//面板接受参数
		blocksBoard:cc.Node,
		blockBoard:cc.Node,
		mainGameBoard:cc.Node,
		startGameBoard:cc.Node,
		//其他参数
		audioManager:cc.Node,
		
    },
    onLoad () {
		console.log("onLoad start");
		if(util.isIphoneX()){
			var cvs = this.node.getComponent(cc.Canvas);
			cvs.fitHeight = true;
			cvs.fitWidth = true;
		}
		//异步加载动态数据
		this.rate = 0;
		this.resLength = 16;
		GlobalData.assets = {};
		var self = this;
		this.loadUpdate = function(){
			console.log("this.rate:" + self.rate);
			var scale = Math.floor((self.rate/self.resLength ) * 100);
			if(self.rate >= self.resLength){
				self.startButton.getComponent(cc.Button).interactable = true;
				self.unschedule(self.loadUpdate);
			}
		};
		cc.loader.loadRes("dynamicPlist", cc.SpriteAtlas, function (err, atlas) {
			for(var key in atlas._spriteFrames){
				console.log("load res :" + key);
				GlobalData.assets[key] = atlas._spriteFrames[key];
			}
			self.rate = self.rate + 1;
		});
		cc.loader.loadResDir("prefabs",function (err, assets) {
			for(var i = 0;i < assets.length;i++){
				GlobalData.assets[assets[i].name] = assets[i];
				self.rate = self.rate + 1;
				console.log("load res prefab:" + assets[i].name);
			}
		});
		this.schedule(this.loadUpdate,0.5);
		GlobalData.gameRunTimeParam.juNum = 1;
		ThirdAPI.loadLocalData();
		//监听事件传递
		this.startButton.getComponent(cc.Button).interactable = false;
		this.node.on('dispatchEvent',this.dispatchMyEvent,this);
	},
	start(){
		console.log("start");
		//初始化所有面板
		ThirdAPI.loadCDNData();
		this.initBoards();
		this.startGameBoard.getComponent("StartGame").showStart();
	},
	initBoards(){
		console.log("initBoards start");
		//this.clearGame();
		//主游戏界面初始化
		this.pauseButton.active = false;
		this.kingLabel.active = false;
		this.kingSprite.active = false;
		this.scoreLabel.active = false;
		this.gamePropFresh.active = false;
		this.gamePropBomb.active = false;
		this.gamePropClear.active = false;
		this.blockBoard.active = false;
	},
	//所有面板的button按钮 返回函数
	panelButtonCb(event,customEventData){
		var self = this;
		//继续游戏
		this.audioManager.getComponent("AudioManager").play(GlobalData.AudioParam.AudioButton);
		if(customEventData == "P_show"){
			this.pauseGameBoard = cc.instantiate(GlobalData.assets['PBPauseGameBoard']);
			this.node.addChild(this.pauseGameBoard);
			this.pauseGameBoard.setPosition(cc.p(0,0));
			this.pauseGameBoard.getComponent("PauseGame").showPause();
		}
	},
	//如果继续游戏则绘制上次的盘局信息
	resumeGameMap(){
		var blocksBoardPos = this.blocksBoard.getPosition();
		for(var i = GlobalData.RANK_TOP;i < 6;i++){
			for(var j = GlobalData.FILE_LEFT;j < 6;j++){
				var sq = GlobalData.COORD_XY(i,j);
				if(GlobalData.numMap[sq] != 0){
					var blockIdx = GlobalData.ConvertToMapId(sq);
					var item = cc.instantiate(GlobalData.assets["PBNumObject"]);
					item.getComponent("NumObject").onInit(GlobalData.numMap[sq]);
					this.mainGameBoard.addChild(item);
					var blockPos = this.blocksBoard.children[blockIdx].getPosition();
					blockPos.x = blockPos.x + blocksBoardPos.x;
					blockPos.y = blockPos.y + blocksBoardPos.y;
					item.setPosition(cc.p(blockPos.x,blockPos.y - 3));
					GlobalData.numNodeMap[sq] = item;
				}
			}
		}
		if(this.boardItem != null){
			this.boardItem.removeFromParent();
			this.boardItem.destroy();
			this.boardItem = null;
		}
		this.scoreLabel.getComponent(cc.Label).string = GlobalData.gameRunTimeParam.totalScore;
		this.scoreLabel.getComponent('NumWrap').value = GlobalData.gameRunTimeParam.totalScore;
		this.propFreshNum('PropFresh');
		this.propFreshNum('PropBomb');
		this.propFreshNum('PropHammer');
	},
	gamePropButtonCb(event, customEventData){
		console.log("gamePropButtonCb",customEventData);
		this.stopRotateProp();
		if(customEventData == "PropFresh"){
			//判断是否超过使用上限
			var propBag = PropManager.getPropBag(customEventData);
			if(propBag.useNum >= 0){
				if(GlobalData.GamePropParam.useNum[customEventData] >= propBag.useNum){
					return;
				}
			}
			//判断是否有道具可以使用
			if(GlobalData.GamePropParam.bagNum[customEventData] <= 0){
				return;
			}
			GlobalData.GamePropParam.useNum[customEventData] += 1;
			GlobalData.GamePropParam.bagNum[customEventData] -= 1;
			this.propFreshNum(customEventData);
			this.refeshNumObject(true);
		}else if(customEventData == "PropHammer"){
			//判断是否超过使用上限
			var propBag = PropManager.getPropBag(customEventData);
			if(propBag.useNum >= 0){
				if(GlobalData.GamePropParam.useNum[customEventData] >= propBag.useNum){
					return;
				}
			}
			//判断是否有道具可以使用
			if(GlobalData.GamePropParam.bagNum[customEventData] <= 0){
				//道具没有了点击跳出分享界面获取道具
				this.getShareProp(customEventData);
				return;
			}
			this.propHammerGuide = cc.instantiate(GlobalData.assets["PBHammerGuide"]);
			this.mainGameBoard.addChild(this.propHammerGuide);
			var mainPos = this.mainGameBoard.getPosition();
			this.propHammerGuide.setPosition(mainPos);
			this.propHammerGuide.getComponent("PropHammerEffect").onStart();
			this.mainGameBoard.on("pressed",this.propPressCallBack,this);
			WxBannerAd.hideBannerAd();
		}else if(customEventData == "PropBomb"){
			//判断是否超过使用上限
			var propBag = PropManager.getPropBag(customEventData);
			if(propBag.useNum >= 0){
				if(GlobalData.GamePropParam.useNum[customEventData] >= propBag.useNum){
					return;
				}
			}
			//判断是否有道具可以使用
			if(GlobalData.GamePropParam.bagNum[customEventData] <= 0){
				//道具没有了点击跳出分享界面获取道具
				this.getShareProp(customEventData);
				return;
			}
			this.propBombGuide = cc.instantiate(GlobalData.assets["PBBombGuide"]);
			this.mainGameBoard.addChild(this.propBombGuide);
			var mainPos = this.mainGameBoard.getPosition();
			this.propBombGuide.setPosition(mainPos);
			this.propBombGuide.getComponent("PropBombEffect").onStart();
			GlobalData.GamePropParam.useNum[customEventData] += 1;
			GlobalData.GamePropParam.bagNum[customEventData] -= 1;
			this.propFreshNum(customEventData);
			this.mainGameBoard.on("pressed",this.propPressCallBack,this);
			this.propBombAction(2048);
			WxBannerAd.hideBannerAd();
		}
	},
	clearGame(){
		//初始化矩阵信息
		for(var i = GlobalData.RANK_TOP;i < 6;i++){
			for(var j = GlobalData.FILE_LEFT;j < 6;j++){
				var sq = GlobalData.COORD_XY(i,j);
				//console.log(sq,GlobalData.numMap[sq]);                                                                    
				if(GlobalData.numNodeMap[sq] != 0){
					GlobalData.numNodeMap[sq].removeFromParent();
					GlobalData.numNodeMap[sq].destroy();
				}
				GlobalData.numNodeMap[sq] = 0;
				GlobalData.numMap[sq] = 0;
			}
		}
		for(var i = 0;i < this.blocksBoard.children.length;i++){
			this.blocksBoard.children[i].getComponent("BlockBoard").shadowShow(false);
		}
		if(this.boardItem != null){
			this.boardItem.removeFromParent();
			this.boardItem.destroy();
			this.boardItem = null;
		}
		//清楚运行时数据
		this.stopRotateProp();
		//GlobalData.gameRunTimeParam.gameStatus = 0;
		GlobalData.gameRunTimeParam.totalScore = 0;
		GlobalData.gameRunTimeParam.stepNum = 0;
		GlobalData.gameRunTimeParam.lastSq = 0;
		GlobalData.gameRunTimeParam.lastFreshNum = 0;
		GlobalData.gameRunTimeParam.shareTimes = 0;
		
		GlobalData.GamePropParam.bagNum.PropFresh = 0;
		GlobalData.GamePropParam.bagNum.PropHammer = 0;
		GlobalData.GamePropParam.bagNum.PropBomb = 0;
		GlobalData.GamePropParam.bagNum.PropRelive = 0;
		GlobalData.GamePropParam.useNum.PropFresh = 0;
		GlobalData.GamePropParam.useNum.PropHammer = 0;
		GlobalData.GamePropParam.useNum.PropBomb = 0;
		GlobalData.GamePropParam.useNum.PropRelive = 0;

		this.scoreLabel.getComponent(cc.Label).string = 0;
		this.scoreLabel.getComponent('NumWrap').value =0;
		this.propFreshNum('PropFresh');
		this.propFreshNum('PropBomb');
		this.propFreshNum('PropHammer');
	},
	//开始初始化主游戏界面信息
	enterGame(){
		//主游戏界面初始化
		this.pauseButton.active = true;
		this.kingLabel.active = true;
		this.kingSprite.active = true;
		this.scoreLabel.active = true;
		//道具解锁操作
		console.log("局数",GlobalData.gameRunTimeParam.juNum);
		if(GlobalData.cdnPropParam.PropUnLock.PropFresh <= GlobalData.gameRunTimeParam.juNum){
			this.gamePropFresh.active = true;
		}
		if(GlobalData.cdnPropParam.PropUnLock.PropBomb <= GlobalData.gameRunTimeParam.juNum){
			this.gamePropBomb.active = true;
		}
		if(GlobalData.cdnPropParam.PropUnLock.PropHammer <= GlobalData.gameRunTimeParam.juNum){
			this.gamePropClear.active = true;
		}
		this.blockBoard.active = true;
		this.kingLabel.getComponent(cc.Label).string = GlobalData.gameRunTimeParam.maxScore;
		if(GlobalData.gameRunTimeParam.StartGuideFlag == false){
			this.startGuideBoard();
		}
		GlobalData.gameRunTimeParam.gameStatus = 1;
		ThirdAPI.updataGameInfo();
		var params = {
			type:'initFriendRank'
		};
		ThirdAPI.getRank(params);
		this.refeshNumObject();
		this.battleNode.getComponent('BattleNode').onStart();
		//添加广告计算 最下面的节点位置所占的全屏比例 广告位置 不得超过这个节点
		if(GlobalData.cdnPropParam.PropUnLock['PropAD'] <= GlobalData.gameRunTimeParam.juNum){
			var sizeHeight = cc.winSize.height;
			var blockBoardPos = this.blockBoard.getPosition();
			//向下移 10个像素 不要挨得最下面的节点太近
			var yy = Math.abs(blockBoardPos.y) +  this.blockBoard.getContentSize().height/2 + sizeHeight/2;
			var yRate = 1 - yy/sizeHeight;
			WxBannerAd.createBannerAd(yRate);
		}
	},
	startGuideBoard(){
		var guideNode = cc.instantiate(GlobalData.assets["PBGuideStart"]);
		this.node.addChild(guideNode);
		guideNode.setPosition(cc.p(0,0));
		var block = this.blocksBoard.children[0];
		var blocksBoardPos = this.blocksBoard.getPosition();
		var blockPos = block.getPosition();
		blockPos.x = blockPos.x + blocksBoardPos.x;
		blockPos.y = blockPos.y + blocksBoardPos.y;
		guideNode.getComponent("GuideStart").showGuide(this.blockBoard.getPosition(),blockPos);
		GlobalData.gameRunTimeParam.StartGuideFlag = true;
	},
	refeshNumObject(scaleFlag = false){
		if(this.boardItem != null){
			this.boardItem.removeFromParent();
			this.boardItem.destroy();
			this.boardItem = null;
		}
		//var test = [256,512,1024,2048];
		var num = util.refreshOneNum();
		GlobalData.gameRunTimeParam.lastFreshNum = num;
		this.boardItem = cc.instantiate(GlobalData.assets["PBNumObject"]);
		if(scaleFlag == false){
			this.boardItem.getComponent("NumObject").onInit(num);
		}else{
			this.boardItem.getComponent("NumObject").scaleShow(num,this.audioManager);
		}
		this.mainGameBoard.addChild(this.boardItem);
		var blockBoardPos = this.blockBoard.getPosition();
		this.boardItem.setPosition(cc.p(blockBoardPos.x,blockBoardPos.y - 3));
		this.boardItem.on(cc.Node.EventType.TOUCH_START, this.eventTouchStart,this);
		this.boardItem.on(cc.Node.EventType.TOUCH_MOVE, this.eventTouchMove,this);
		this.boardItem.on(cc.Node.EventType.TOUCH_END, this.eventTouchEnd,this);
		this.boardItem.on(cc.Node.EventType.TOUCH_CANCEL, this.eventTouchCancel,this);
		console.log("refeshNumObject",num,GlobalData.gameRunTimeParam.stepNum,GlobalData.gameRunTimeParam.juNum);
	},
	offNodeAction(){
		this.boardItem.off(cc.Node.EventType.TOUCH_START, this.eventTouchStart,this);
		this.boardItem.off(cc.Node.EventType.TOUCH_MOVE, this.eventTouchMove,this);
		this.boardItem.off(cc.Node.EventType.TOUCH_END, this.eventTouchEnd,this);
		this.boardItem.off(cc.Node.EventType.TOUCH_CANCEL, this.eventTouchCancel,this);
	},
	//游戏规则算法
	gameLogic(){
		var self = this;
		var totalEatNum = 0;
		var sameLevelWasteTime = 0;
		var sq = GlobalData.ConvertToMapSpace(this.moveIdx);
		var x = GlobalData.FILE_X(sq);
		var y = GlobalData.RANK_Y(sq);
		var myNum = GlobalData.numMap[sq];

		var oriNode = GlobalData.numNodeMap[sq];
		console.log("gameLogic start",sq,x,y,myNum);
		//最多有四次组合[-1,1]
		GlobalData.gameRunTimeParam.lastSq = sq;
		var eatNumLevel = new Array();
		//查找并收集所有的可以合并的数字
		for(let i = 0;i < 4;i++){
			let numDic = {'key':myNum,'list':[],'eatNum':0};
			for(let j = 0;j < GlobalData.moveStep.length;j++){
				let step = GlobalData.moveStep[j];
				let tsq = GlobalData.COORD_XY(x + step[0],y + step[1]);
				//console.log("gameLogic",step,GlobalData.numMap[tsq],myNum,tsq);
				if(GlobalData.numMap[tsq] == myNum){
					numDic.list.push(GlobalData.numNodeMap[tsq]);
					numDic.eatNum += 1;
					GlobalData.numMap[tsq] = 0;
					GlobalData.numNodeMap[tsq] = 0;
					totalEatNum += 1;
				}
			}
			if(numDic.eatNum > 0){
				eatNumLevel.push(numDic);
				myNum = myNum * 2;
				GlobalData.numMap[sq] = myNum;
			}else{
				break;
			}
		}
		//console.log(eatNumLevel);
		//对可以合并的数字进行action操作
		if(eatNumLevel.length > 0){
			this.deepCallSameMerge(sq,eatNumLevel,oriNode,myNum,totalEatNum,0,0);
		}else{
			//2048 播放动作效果 退出循环
			if(myNum == 2048){
				GlobalData.numMap[sq] = 0;
				GlobalData.numNodeMap[sq] = 0;
				oriNode.getComponent("NumObject").merge2048Action(this.audioManager,sq,function(){
					console.log(GlobalData.numMap);
					oriNode.stopAllActions();
					oriNode.removeFromParent();
					oriNode.destroy();	
					self.mergeFinish();
					//console.log(GlobalData.numMap);
				});
			}else{
				this.mergeFinish();
			}
		}
	},
	mergeFinish(){
		//判断游戏是否结束
		var self = this;
		var leftNum = 0;
		for(var i = GlobalData.RANK_TOP;i < 6;i++){
			for(var j = GlobalData.FILE_LEFT;j < 6;j++){
				var fsq = GlobalData.COORD_XY(i,j);
				if(GlobalData.numMap[fsq] == 0){
					leftNum += 1;
				}
			}
		}
		//存储信息
		if(GlobalData.gameRunTimeParam.maxScore < GlobalData.gameRunTimeParam.totalScore){
			GlobalData.gameRunTimeParam.maxScore = GlobalData.gameRunTimeParam.totalScore;
		}
		if(GlobalData.gameRunTimeParam.totalScore > GlobalData.cdnGameConfig.shareADLevel){
			util.reSetPropShareOrADRate();
		}
		this.battleNode.getComponent('BattleNode').show();
		if(leftNum == 0){
			GlobalData.gameRunTimeParam.gameStatus = 0;
			this.stopRotateProp();
			//复活道具
			var propRelive = PropManager.getPropRelive();
			if(propRelive != null){
				this.reliveGameBoard = cc.instantiate(GlobalData.assets['PBReliveGameBoard']);
				this.node.addChild(this.reliveGameBoard);
				this.reliveGameBoard.setPosition(cc.p(0,0));
				this.reliveGameBoard.getComponent('ReliveGame').waitCallBack(1,propRelive,function(){
					self.reliveGameBoard.removeFromParent();
					self.reliveGameBoard.destroy();
					self.battleNode.getComponent('BattleNode').onStop();
					self.showPBGameBoard('FinishGameBoard');
					console.log("ReliveGame cancle");
				});
			}else{
				this.battleNode.getComponent('BattleNode').onStop();
				this.showPBGameBoard('FinishGameBoard');
			}
		}else if(leftNum == 1){
			GlobalData.gameRunTimeParam.stepNum += 1;
			this.boardItem = null;
			this.refeshNumObject();
			//如果剩余一个格子则进行道具的引导使用 随机一个道具进行晃动
			var propArray = new Array();
			if(GlobalData.GamePropParam.bagNum['PropFresh'] > 0){
				propArray.push('PropFresh');
			}
			var propBag = PropManager.getPropBag('PropHammer');
			if(GlobalData.GamePropParam.useNum['PropHammer'] < propBag.useNum){
				if(GlobalData.cdnPropParam.PropUnLock['PropHammer'] <= GlobalData.gameRunTimeParam.juNum){
					propArray.push('PropHammer');
				}
			}
			var propBag = PropManager.getPropBag('PropBomb');
			if(GlobalData.GamePropParam.useNum['PropBomb'] < propBag.useNum){
				if(GlobalData.cdnPropParam.PropUnLock['PropBomb'] <= GlobalData.gameRunTimeParam.juNum){
					propArray.push('PropBomb');
				}
			}
			var idx = util.getRandomIndexForArray(propArray);
			if(idx != -1){
				var propDc = propArray[idx];
				this.rotateProp(propDc);
			}
		}else{
			this.stopRotateProp();
			GlobalData.gameRunTimeParam.stepNum += 1;
			this.boardItem = null;
			this.refeshNumObject();
		}
		ThirdAPI.updataGameInfo();
	},
	rotateProp(propName){
		console.log('rotateProp ',propName);
		var rotateAction = cc.repeatForever(
			cc.sequence(
				cc.rotateBy(0.1, 10),
				cc.rotateBy(0.2, -20),
				cc.rotateBy(0.2, 20),
				cc.rotateBy(0.2, -20),
				cc.rotateBy(0.1, 10),
				cc.delayTime(1)
			)
		);
		if(propName == 'PropFresh'){
			this.gamePropFresh.runAction(rotateAction);
		}else if(propName == 'PropHammer'){
			this.gamePropClear.runAction(rotateAction);
		}else if(propName == 'PropBomb'){
			this.gamePropBomb.runAction(rotateAction);
		}
	},
	stopRotateProp(){
		this.gamePropFresh.stopAllActions();
		this.gamePropClear.stopAllActions();
		this.gamePropBomb.stopAllActions();
		this.gamePropFresh.rotation = 0;
		this.gamePropClear.rotation = 0;
		this.gamePropBomb.rotation = 0;
	},
	showPBGameBoard(type){
		if(type == 'FinishGameBoard'){
			this.finishGameBoard = cc.instantiate(GlobalData.assets['PBFinishGameBoard']);
			this.node.addChild(this.finishGameBoard);
			this.finishGameBoard.setPosition(cc.p(0,0));
			this.finishGameBoard.getComponent("FinishGame").show();
		}else if(type == 'RankGameBoard'){
			this.rankGameBorad = cc.instantiate(GlobalData.assets['PBRankGameBoard']);
			this.node.addChild(this.rankGameBorad);
			this.rankGameBorad.setPosition(cc.p(0,0));
			this.rankGameBorad.getComponent("RankGame").show();
		}
	},
	destroyGameBoard(board){
		if(board != null){
			board.removeFromParent();
			board.destroy();
		}
		return null;
	},
	deepCallSameMerge(sq,mergeArray,oriNode,finishKey,totalEatNum,totalScore,deep){
		console.log(totalEatNum,totalScore,deep);
		var self = this;
		var numDic = mergeArray.shift();
		if(numDic == null){
			this.scoreLabel.getComponent("NumWrap").startRollNum(totalScore);
			if(finishKey == 2048){
				GlobalData.numMap[sq] = 0;
				GlobalData.numNodeMap[sq] = 0;
				oriNode.getComponent("NumObject").merge2048Action(this.audioManager,sq,function(){
					console.log(GlobalData.numMap);
					oriNode.stopAllActions();
					oriNode.removeFromParent();
					oriNode.destroy();
					self.getProp(totalEatNum + 1,oriNode.getPosition());
				});
			}else{
				this.getProp(totalEatNum + 1,oriNode.getPosition());
			}
			this.mergeFinish();
		}else{
			var mergeFinishAction = function(){
				console.log('start run mergeFinishAction');
				//1.1数字合并完毕，进行效果起飞
				let addScore = (numDic.key * 2) * numDic.list.length * (deep + 1);
				GlobalData.gameRunTimeParam.totalScore += addScore;
				if(self.flyNode == null){
					self.flyNode = cc.instantiate(GlobalData.assets["PBNumFly"]);
					self.flyNode.setLocalZOrder(3);
					self.mainGameBoard.addChild(self.flyNode);
				}
				self.flyNode.stopAllActions();
				var pos = oriNode.getPosition();
				var size = oriNode.getContentSize();
				var flyNodeSize = self.flyNode.getContentSize();
				self.flyNode.setPosition(cc.p(pos.x,pos.y + size.height/2 + flyNodeSize.height/2));
				self.flyNode.getComponent("FlyNumAction").startFlyOnce(deep,numDic.key * 2,addScore);
				//oriNode.getComponent("NumObject").flyMergeScore(numDic.key,numDic.list.length,deep,addScore);
				//4.刷新数字并执行吃子结束之后的动画效果
				oriNode.getComponent("NumObject").MergeFinishNum(numDic.key * 2,self.audioManager,function(){
					self.deepCallSameMerge(sq,
						mergeArray,
						oriNode,
						finishKey,
						totalEatNum,
						totalScore + addScore,
						deep + 1
					);
				});
				//1.2播放音效
				self.audioManager.getComponent('AudioManager').play(GlobalData.AudioParam.AudioComb1 + deep);
			}
			for(let j = 0;j < numDic.list.length;j++){
				let finished = cc.callFunc(function(pthis,tsq){
					//console.log('eatNode',tsq);
					numDic.list[tsq].removeFromParent();
					numDic.list[tsq].destroy();
					if(j == numDic.list.length - 1){
						mergeFinishAction();
					}
				},this,j);
				let moveAction = cc.moveTo(GlobalData.TimeActionParam.EatNodeMoveTime,oriNode.getPosition());
				numDic.list[j].runAction(cc.sequence(moveAction,finished));
			}
		}
	},
	//获取道具操作
	getShareProp(prop){
		var propType = PropManager.getShareOrADKey(prop);
		if(propType == 'PropShare'){
			this.propKey = prop;
			this.isShareCallBack = false;
			this.shareSuccessCb = function(type, shareTicket, arg){
				console.log('main',type, shareTicket, arg);
				if(arg.isShareCallBack == true){
					return;
				}
				arg.isShareCallBack = true;
				var spriteName = null;
				var propNode = null;
				if(arg.propKey == "PropFresh"){
					spriteName = "deletePropIcon";
					propNode = arg.gamePropFresh;
				}else if(arg.propKey == "PropBomb"){
					spriteName = "bomb";
					propNode = arg.gamePropBomb;
				}else if(arg.propKey == "PropHammer"){
					spriteName = "clearPropIcon";
					propNode = arg.gamePropClear;
				}else{
					return;
				}
				var flyProp = cc.instantiate(GlobalData.assets["PBPropFly"]);
				arg.mainGameBoard.addChild(flyProp);
				flyProp.setPosition(cc.p(0,0));
				flyProp.getComponent("NumFly").startFly(0.2,spriteName,1,propNode.getPosition(),function(){
					GlobalData.GamePropParam.bagNum[arg.propKey] += 1;
					arg.propFreshNum(arg.propKey);
				});
			};
			this.shareFailedCb = function(type,arg){
				console.log(type,arg);
				if(arg.isShareCallBack == false){
					if(arg.failNode != null){
						arg.failNode.stopAllActions();
						arg.failNode.removeFromParent();
						arg.failNode.destroy();
						arg.failNode = null;
					}
					arg.failNode = cc.instantiate(GlobalData.assets['PBShareFail']);
					arg.mainGameBoard.addChild(arg.failNode);
					var actionEnd = cc.callFunc(function(){
						if(arg.failNode != null){
							arg.failNode.stopAllActions();
							arg.failNode.removeFromParent();
							arg.failNode.destroy();
							arg.failNode = null;
						}
					},arg);
					arg.failNode.runAction(cc.sequence(cc.fadeIn(0.5),cc.delayTime(1),cc.fadeOut(0.5),actionEnd));
					
				}
				arg.isShareCallBack = true;
			};
			var param = {
				type:null,
				arg:this,
				successCallback:this.shareSuccessCb,
				failCallback:this.shareFailedCb,
				shareName:prop,
				isWait:true
			};
			if(GlobalData.cdnGameConfig.shareCustomSet == 0){
				param.isWait = false;
			}
			ThirdAPI.shareGame(param);
		}
		else if(propType == 'PropAV'){
			this.propKey = prop;
			this.shareSuccessCb = function(arg){
				var spriteName = null;
				var propNode = null;
				if(arg.propKey == "PropFresh"){
					spriteName = "deletePropIcon";
					propNode = arg.gamePropFresh;
				}else if(arg.propKey == "PropBomb"){
					spriteName = "bomb";
					propNode = arg.gamePropBomb;
				}else if(arg.propKey == "PropHammer"){
					spriteName = "clearPropIcon";
					propNode = arg.gamePropClear;
				}else{
					return;
				}
				var flyProp = cc.instantiate(GlobalData.assets["PBPropFly"]);
				arg.mainGameBoard.addChild(flyProp);
				flyProp.setPosition(cc.p(0,0));
				flyProp.getComponent("NumFly").startFly(0.2,spriteName,1,propNode.getPosition(),function(){
					GlobalData.GamePropParam.bagNum[arg.propKey] += 1;
					arg.propFreshNum(arg.propKey);
				});
			};
			this.shareFailedCb = function(arg){
				if(arg.failNode != null){
					arg.failNode.stopAllActions();
					arg.failNode.removeFromParent();
					arg.failNode.destroy();
					arg.failNode = null;
				}
				arg.failNode = cc.instantiate(GlobalData.assets['PBShareFail']);
				arg.failNode.getChildByName('tipsLabel').getComponent(cc.Label).string = "看完视频才能获得奖励，请再看一次";
				arg.mainGameBoard.addChild(arg.failNode);
				var actionEnd = cc.callFunc(function(){
					if(arg.failNode != null){
						arg.failNode.stopAllActions();
						arg.failNode.removeFromParent();
						arg.failNode.destroy();
						arg.failNode = null;
					}
				},arg);
				arg.failNode.runAction(cc.sequence(cc.fadeIn(0.5),cc.delayTime(1),cc.fadeOut(0.5),actionEnd));
			};
			WxVideoAd.initCreateReward(this.shareSuccessCb,this.shareFailedCb,this);	
		}
	},
	getProp(eatNum,fromPos){
		var self = this;
		var res = PropManager.getProp(eatNum);
		console.log("getProp",eatNum,res);
		//直接获取刷新道具
		if(res == null){
			return;
		}
		//res = "PropBao_PropHammer";
		if(res == "PropFresh"){
			var flyProp = cc.instantiate(GlobalData.assets["PBPropFly"]);
			this.mainGameBoard.addChild(flyProp);
			flyProp.setPosition(fromPos);
			flyProp.getComponent("NumFly").startFly(0.3,"deletePropIcon",1,this.gamePropFresh.getPosition(),function(){
				//判断是否超过使用上限
				var propBag = PropManager.getPropBag(res);
				if(propBag.useNum >= 0){
					if(GlobalData.GamePropParam.useNum[res] >= propBag.useNum){
						return;
					}
				}
				//判断背包数量是否少于上限值
				if(GlobalData.GamePropParam.bagNum[res] < propBag.bagNum){
					GlobalData.GamePropParam.bagNum[res] += 1;
					self.propFreshNum('PropFresh');
				}
			});
		}
		var resArr = res.split("_");
		if(resArr[0] == "PropBao" || resArr[0] == "PropShare"){
			this.propGameBoard = cc.instantiate(GlobalData.assets['PBPropGameBoard']);
			this.node.addChild(this.propGameBoard);
			this.propGameBoard.setPosition(cc.p(0,0));
			this.propGameBoard.getComponent("PropGame").initLoad(fromPos,resArr[0],resArr[1]);
		}
		else if(resArr[0] == 'PropAV'){
			this.propKey = resArr[1];
			this.shareSuccessCb = function(arg){
				var spriteName = null;
				var propNode = null;
				if(arg.propKey == "PropFresh"){
					spriteName = "deletePropIcon";
					propNode = arg.gamePropFresh;
				}else if(arg.propKey == "PropBomb"){
					spriteName = "bomb";
					propNode = arg.gamePropBomb;
				}else if(arg.propKey == "PropHammer"){
					spriteName = "clearPropIcon";
					propNode = arg.gamePropClear;
				}else{
					return;
				}
				var flyProp = cc.instantiate(GlobalData.assets["PBPropFly"]);
				arg.mainGameBoard.addChild(flyProp);
				flyProp.setPosition(cc.p(0,0));
				flyProp.getComponent("NumFly").startFly(0.2,spriteName,1,propNode.getPosition(),function(){
					GlobalData.GamePropParam.bagNum[arg.propKey] += 1;
					arg.propFreshNum(arg.propKey);
				});
			};
			this.shareFailedCb = function(arg){
				if(arg.failNode != null){
					arg.failNode.stopAllActions();
					arg.failNode.removeFromParent();
					arg.failNode.destroy();
					arg.failNode = null;
				}
				arg.failNode = cc.instantiate(GlobalData.assets['PBShareFail']);
				arg.failNode.getChildByName('tipsLabel').getComponent(cc.Label).string = "看完视频才能获得奖励，请再看一次";
				arg.mainGameBoard.addChild(arg.failNode);
				var actionEnd = cc.callFunc(function(){
					if(arg.failNode != null){
						arg.failNode.stopAllActions();
						arg.failNode.removeFromParent();
						arg.failNode.destroy();
						arg.failNode = null;
					}
				},arg);
				arg.failNode.runAction(cc.sequence(cc.fadeIn(0.5),cc.delayTime(1),cc.fadeOut(0.5),actionEnd));
			};
			WxVideoAd.initCreateReward(this.shareSuccessCb,this.shareFailedCb,this);
		}
	},
	eventTouchStart(event){
		this.moveIdx = -1;
		if(this.propBombGuide != null && this.propBombGuide.isValid == true){
			this.propBombGuide.stopAllActions();
			this.propBombGuide.removeFromParent();
			this.propBombGuide.destroy();
			this.propBombGuide = null;
			GlobalData.gameRunTimeParam.lastFreshNum = 2048;
			WxBannerAd.showBannerAd();
		}
		this.initLocation = this.boardItem.getPosition();
		this.touchLocation = this.boardItem.parent.convertToNodeSpaceAR(event.getLocation());
		//console.log(this.initLocation.x,this.initLocation.y,this.touchLocation.x,this.touchLocation.y);
		var size = this.boardItem.getContentSize();
		var moveToPos = cc.p(this.touchLocation.x,this.touchLocation.y + size.height / 2);
		var moveAction = cc.moveTo(0.02,moveToPos);
		this.boardItem.runAction(moveAction);
		//console.log('poker TOUCH_START');
	},
	eventTouchMove(event){
		//console.log('poker TOUCH_MOVE',event.touch.getDelta().x,event.touch.getDelta().y);
		var delta = event.touch.getDelta();
		this.boardItem.x += delta.x;
		this.boardItem.y += delta.y;
		this.moveIdx = -1;
		var movePos = this.boardItem.getPosition();
		var box = this.blocksBoard.getBoundingBox();
		if(cc.rectContainsPoint(box,movePos)){
			//console.log("在矩形内部");
			var nearDist = 10000;
			for(var i = 0;i < this.blocksBoard.children.length;i++){
				var block = this.blocksBoard.children[i];
				//var blockPos = this.node.convertToNodeSpaceAR(block.getPosition());
				var blocksBoardPos = this.blocksBoard.getPosition();
				var blockPos = block.getPosition();
				blockPos.x = blockPos.x + blocksBoardPos.x;
				blockPos.y = blockPos.y + blocksBoardPos.y;
				var dist = util.euclDist(blockPos,movePos);
				//console.log(i,dist,blockPos.x,blockPos.y,movePos.x,movePos.y);
				if(dist <= nearDist){
					nearDist = dist;
					this.moveIdx = i;
				}
			}
			this.blockShadow();
			//console.log(this.moveIdx,nearDist);
		}else{
			this.blockShadowCancle();
		}
	},
	
	eventTouchEnd(event){
		//console.log('poker TOUCH_END');
		//如果移动的位置合法则进行移动
		if(this.moveIdx != -1){
			var sq = GlobalData.ConvertToMapSpace(this.moveIdx);
			if(GlobalData.numMap[sq] == 0){
				var block = this.blocksBoard.children[this.moveIdx];
				var blockPos = block.getPosition();
				var blocksBoardPos = this.blocksBoard.getPosition();
				blockPos.x = blockPos.x + blocksBoardPos.x;
				blockPos.y = blockPos.y + blocksBoardPos.y;
				this.boardItem.setPosition(blockPos);
				block.getComponent("BlockBoard").shadowSprite.active = false;
				this.boardItem.getComponent("NumObject").scaleBigOnce(this.audioManager);
				this.offNodeAction();
				GlobalData.numMap[sq] = parseInt(this.boardItem.getComponent("NumObject").value);
				GlobalData.numNodeMap[sq] = this.boardItem;
				this.gameLogic();
			}else{
				var moveAction = cc.moveTo(0.02,this.initLocation);
				this.boardItem.runAction(moveAction);
			}
		}else{
			var moveAction = cc.moveTo(0.02,this.initLocation);
			this.boardItem.runAction(moveAction);
		}
	},
	eventTouchCancel(event){
		//console.log('poker TOUCH_CANCEL');
		//如果移动的位置合法则进行移动
		if(this.moveIdx != -1){
			var sq = GlobalData.ConvertToMapSpace(this.moveIdx);
			if(GlobalData.numMap[sq] == 0){
				var block = this.blocksBoard.children[this.moveIdx];
				var blockPos = block.getPosition();
				var blocksBoardPos = this.blocksBoard.getPosition();
				blockPos.x = blockPos.x + blocksBoardPos.x;
				blockPos.y = blockPos.y + blocksBoardPos.y;
				this.boardItem.setPosition(blockPos);
				block.getComponent("BlockBoard").shadowSprite.active = false;
				this.boardItem.getComponent("NumObject").scaleBigOnce(this.audioManager);
				this.offNodeAction();
				GlobalData.numMap[sq] = parseInt(this.boardItem.getComponent("NumObject").value);
				GlobalData.numNodeMap[sq] = this.boardItem;
				this.gameLogic();
				return true;
			}else{
				var moveAction = cc.moveTo(0.02,this.initLocation);
				this.boardItem.runAction(moveAction);
			}
		}else{
			var moveAction = cc.moveTo(0.02,this.initLocation);
			this.boardItem.runAction(moveAction);
		}
	},
	propPressCallBack(event){
		var data = event.getUserData();
		if(data == null){
			return;
		}
		console.log(data.currentTarget.name)
		//取消按钮的传递
		if(data.currentTarget.name == 'cancleLabel'){
			this.propHammerGuide.stopAllActions();
			this.propHammerGuide.removeFromParent();
			this.propHammerGuide.destroy();
			this.propHammerGuide = null;
			this.mainGameBoard.off("pressed",this.propPressCallBack,this);
			WxBannerAd.showBannerAd();
			return;
		}else if(data.currentTarget.name == 'BombCancleLabel'){
			this.propBombGuide.stopAllActions();
			this.propBombGuide.removeFromParent();
			this.propBombGuide.destroy();
			this.propBombGuide = null;
			this.mainGameBoard.off("pressed",this.propPressCallBack,this);
			this.propBombAction(GlobalData.gameRunTimeParam.lastFreshNum);
			GlobalData.GamePropParam.useNum['PropBomb'] -= 1;
			GlobalData.GamePropParam.bagNum['PropBomb'] += 1;
			this.propFreshNum('PropBomb');
			WxBannerAd.showBannerAd();
			return;
		}
		
		var selectIdx = -1;
		var pressPos = this.mainGameBoard.convertToNodeSpaceAR(data.currentTouch.getLocation());
		var box = this.blocksBoard.getBoundingBox();
		console.log(pressPos);
		if(cc.rectContainsPoint(box,pressPos)){
			//console.log("在矩形内部");
			var nearDist = 10000;
			var blockSize = null;
			for(var i = 0;i < this.blocksBoard.children.length;i++){
				var block = this.blocksBoard.children[i];
				//var blockPos = this.node.convertToNodeSpaceAR(block.getPosition());
				var blocksBoardPos = this.blocksBoard.getPosition();
				var blockPos = block.getPosition();
				blockPos.x = blockPos.x + blocksBoardPos.x;
				blockPos.y = blockPos.y + blocksBoardPos.y;
				var dist = util.euclDist(blockPos,pressPos);
				//console.log(i,dist,blockPos.x,blockPos.y,movePos.x,movePos.y);
				if(dist <= nearDist){
					nearDist = dist;
					selectIdx = i;
				}
				blockSize = block.getContentSize();
			}
			//this.blockShadow();
			if(selectIdx != -1 && blockSize != null &&  nearDist < blockSize.width/2 && nearDist < blockSize.height/2){
				var sq = GlobalData.ConvertToMapSpace(selectIdx);
				if(GlobalData.numMap[sq] != 0 && GlobalData.numNodeMap[sq] != 0){
					//如果找到选择的格子 则取消监听事件
					var self = this;
					var selectNode = GlobalData.numNodeMap[sq];
					var selectPos = selectNode.getPosition();
					this.mainGameBoard.off("pressed",this.propPressCallBack,this);
					this.propHammerGuide.getComponent("PropHammerEffect").hammerOneNum(selectNode,function(){
						selectNode.removeFromParent();
						selectNode.destroy();
						GlobalData.numNodeMap[sq] = 0;
						GlobalData.numMap[sq] = 0;
						var block = self.blocksBoard.children[selectIdx];
						block.getComponent("BlockBoard").shadowSprite.active = false;
						self.propHammerGuide.stopAllActions();
						self.propHammerGuide.removeFromParent();
						self.propHammerGuide.destroy();
						GlobalData.GamePropParam.useNum['PropHammer'] += 1;
						GlobalData.GamePropParam.bagNum['PropHammer'] -= 1;
						self.propFreshNum('PropHammer');
						WxBannerAd.showBannerAd();
					});
				}
			}
			console.log(selectIdx,nearDist);
		}else{
			/*
			this.propHammerGuide.stopAllActions();
			this.propHammerGuide.removeFromParent();
			this.propHammerGuide.destroy();
			*/
			console.log("在矩形外部");
		}
	},
	propBombAction(num){
		if(this.boardItem != null){
			this.boardItem.removeFromParent();
			this.boardItem.destroy();
			this.boardItem = null;
		}
		
		this.boardItem = cc.instantiate(GlobalData.assets["PBNumObject"]);
		this.boardItem.getComponent("NumObject").scaleShow(num,this.audioManager);
		this.boardItem.on(cc.Node.EventType.TOUCH_START, this.eventTouchStart,this);
		this.boardItem.on(cc.Node.EventType.TOUCH_MOVE, this.eventTouchMove,this);
		this.boardItem.on(cc.Node.EventType.TOUCH_END, this.eventTouchEnd,this);
		this.boardItem.on(cc.Node.EventType.TOUCH_CANCEL, this.eventTouchCancel,this);
		this.mainGameBoard.addChild(this.boardItem);
		var blockBoardPos = this.blockBoard.getPosition();
		this.boardItem.setPosition(cc.p(blockBoardPos.x,blockBoardPos.y - 3));
		console.log("refeshNumObject",GlobalData.gameRunTimeParam.stepNum);
	},
	//道具个数发生变化
	propFreshNum(prop){
		if(prop == 'PropFresh'){
			this.gamePropFresh.getChildByName("numLabel").getComponent(cc.Label).string = "x" + GlobalData.GamePropParam.bagNum['PropFresh'];
		}else if(prop == 'PropHammer'){
			if(GlobalData.GamePropParam.bagNum['PropHammer'] > 0){
				this.gamePropClear.getChildByName("add").active = false;
				this.gamePropClear.getChildByName("numLabel").active = true;
				this.gamePropClear.getChildByName("numLabel").getComponent(cc.Label).string = "x" + GlobalData.GamePropParam.bagNum['PropHammer'];
			}else{
				this.gamePropClear.getChildByName("add").active = true;
				this.gamePropClear.getChildByName("numLabel").active = false;
			}
		}else if(prop == 'PropBomb'){
			if(GlobalData.GamePropParam.bagNum['PropBomb'] > 0){
				this.gamePropBomb.getChildByName("add").active = false;
				this.gamePropBomb.getChildByName("numLabel").active = true;
				this.gamePropBomb.getChildByName("numLabel").getComponent(cc.Label).string = "x" + GlobalData.GamePropParam.bagNum['PropBomb'];
			}else{
				this.gamePropBomb.getChildByName("add").active = true;
				this.gamePropBomb.getChildByName("numLabel").active = false;
			}
		}
	},
	dispatchMyEvent(event){
		var self = this;
		var data = event.getUserData();
		console.log('dispatchMyEvent',data);
		if(data.type != 'ReliveBack' && data.type != 'PropShareSuccess'){
			this.audioManager.getComponent("AudioManager").play(GlobalData.AudioParam.AudioButton);
		}
		//归档回调
		if(data.type == "ContinueGame"){
			this.continueGameBoard.getComponent("ContinueGame").hideBoard();
			this.startGameBoard.getComponent("StartGame").hideStaticStart(function(){
				self.resumeGameMap();
				self.enterGame();
			});
		}
		else if(data.type == "ResetGame"){
			//重新开始游戏
			this.continueGameBoard.getComponent("ContinueGame").hideBoard();
			this.startGameBoard.getComponent("StartGame").hideStaticStart(function(){
				self.clearGame();
				self.enterGame();
			});
		}
		else if(data.type == 'FRestart'){
			this.finishGameBoard = this.destroyGameBoard(this.finishGameBoard);
			GlobalData.gameRunTimeParam.juNum += 1;
			this.clearGame();
			this.initBoards();
			this.enterGame();
			//以上操作会改变游戏状态所以更新信息
			ThirdAPI.updataGameInfo();
		}
		else if(data.type == 'StartGame'){
			if(GlobalData.gameRunTimeParam.gameStatus == 1){
				this.continueGameBoard = cc.instantiate(GlobalData.assets['PBContinueGameBoard']);
				this.node.addChild(this.continueGameBoard);
				this.continueGameBoard.setPosition(cc.p(0,0));
				this.continueGameBoard.getComponent("ContinueGame").showBoard();
			}else{
				var propRelive = PropManager.getPropStart();
				if(propRelive != null){
					this.reliveGameBoard = cc.instantiate(GlobalData.assets['PBReliveGameBoard']);
					this.node.addChild(this.reliveGameBoard);
					this.reliveGameBoard.setPosition(cc.p(0,0));
					this.startGameBoard.getComponent("StartGame").hideStaticStart(function(){
						self.reliveGameBoard.getComponent('ReliveGame').waitCallBack(0,propRelive,function(){
							self.reliveGameBoard.removeFromParent();
							self.reliveGameBoard.destroy();
							self.clearGame();
							self.enterGame();	
							console.log("ReliveGame cancle");
						});
					});
				}else{
					this.startGameBoard.getComponent("StartGame").hideStart(function(){
						self.clearGame();
						self.enterGame();
					});
				}
			}
		}
		else if(data.type == "PauseContinue"){
			this.pauseGameBoard.getComponent("PauseGame").hidePause(function(){
				self.pauseGameBoard.removeFromParent();
				self.pauseGameBoard.destroy();
			});
		}
		else if(data.type == "PauseReset"){
			WxBannerAd.hideBannerAd();
			this.pauseGameBoard.getComponent("PauseGame").hidePause(function(){
				self.battleNode.getComponent('BattleNode').hide();
				self.pauseGameBoard.removeFromParent();
				self.pauseGameBoard.destroy();
				self.clearGame();
				self.initBoards();
				self.startGameBoard.getComponent("StartGame").showStart();
				//以上操作会改变游戏状态所以更新信息
				ThirdAPI.updataGameInfo();
			});
		}
		else if(data.type == 'PropShareSuccess'){
			this.propGameBoard.removeFromParent();
			this.propGameBoard.destroy();
			var spriteName = null;
			var propNode = null;
			if(data.propKey == "PropFresh"){
				spriteName = "deletePropIcon";
				propNode = this.gamePropFresh;
			}else if(data.propKey == "PropBomb"){
				spriteName = "bomb";
				propNode = this.gamePropBomb;
			}else if(data.propKey == "PropHammer"){
				spriteName = "clearPropIcon";
				propNode = this.gamePropClear;
			}else{
				return;
			}
			
			var flyProp = cc.instantiate(GlobalData.assets["PBPropFly"]);
			this.mainGameBoard.addChild(flyProp);
			flyProp.setPosition(data.startPos);
			flyProp.getComponent("NumFly").startFly(0.2,spriteName,1,propNode.getPosition(),function(){
				//判断是否超过使用上限
				var propBag = PropManager.getPropBag(data.propKey);
				if(propBag.useNum >= 0){
					if(GlobalData.GamePropParam.useNum[data.propKey] >= propBag.useNum){
						return;
					}
				}
				//判断背包数量是否少于上限值
				if(GlobalData.GamePropParam.bagNum[data.propKey] >= propBag.bagNum){
					return;
				}
				GlobalData.GamePropParam.bagNum[data.propKey] += 1;
				self.propFreshNum(data.propKey);
			});
		}
		else if(data.type == 'StartBattleSuccess'){
			this.startGameBoard.getComponent("StartGame").hideStaticStart(function(){
				self.clearGame();
				self.enterGame();
				var spriteName = null;
				var propNode = null;
				if(data.propKey == "PropFresh"){
					spriteName = "deletePropIcon";
					propNode = self.gamePropFresh;
				}else if(data.propKey == "PropBomb"){
					spriteName = "bomb";
					propNode = self.gamePropBomb;
				}else if(data.propKey == "PropHammer"){
					spriteName = "clearPropIcon";
					propNode = self.gamePropClear;
				}else{
					return;
				}
				//判断是否超过使用上限
				var propBag = PropManager.getPropBag(data.propKey);
				if(propBag.useNum >= 0){
					if(GlobalData.GamePropParam.useNum[data.propKey] >= propBag.useNum){
						return;
					}
				}
				//判断背包数量是否少于上限值
				if(GlobalData.GamePropParam.bagNum[data.propKey] >= propBag.bagNum){
					return;
				}
				var flyProp = cc.instantiate(GlobalData.assets["PBPropFly"]);
				self.mainGameBoard.addChild(flyProp);
				flyProp.setPosition(data.startPos);
				flyProp.getComponent("NumFly").startFly(0.2,spriteName,1,propNode.getPosition(),function(){
					GlobalData.GamePropParam.bagNum[data.propKey] += 1;
					ThirdAPI.updataGameInfo();
					self.propFreshNum(data.propKey);
				});
			});
		}
		else if(data.type == 'ReliveBack'){
			GlobalData.GamePropParam.bagNum.PropRelive -= 1;
			GlobalData.GamePropParam.useNum.PropRelive += 1;
			this.reliveGameBoard.removeFromParent();
			this.reliveGameBoard.destroy();
			if(data.action == 1){
				this.boardItem.removeFromParent();
				this.boardItem.destroy();
				this.boardItem = null;
				this.propBombAction(2048);
				if(GlobalData.numNodeMap[GlobalData.gameRunTimeParam.lastSq] != 0){
					GlobalData.numNodeMap[GlobalData.gameRunTimeParam.lastSq].removeFromParent();
					GlobalData.numNodeMap[GlobalData.gameRunTimeParam.lastSq].destroy();
					GlobalData.numMap[GlobalData.gameRunTimeParam.lastSq] = 0;
					GlobalData.numNodeMap[GlobalData.gameRunTimeParam.lastSq] = 0;
				}
				GlobalData.gameRunTimeParam.gameStatus = 1;
			}else{
				this.startGameBoard.getComponent("StartGame").hideStaticStart(function(){
					self.resumeGameMap();
					if(GlobalData.gameRunTimeParam.lastSq != 0){
						if(GlobalData.numNodeMap[GlobalData.gameRunTimeParam.lastSq] != 0){
							GlobalData.numNodeMap[GlobalData.gameRunTimeParam.lastSq].removeFromParent();
							GlobalData.numNodeMap[GlobalData.gameRunTimeParam.lastSq].destroy();
							GlobalData.numMap[GlobalData.gameRunTimeParam.lastSq] = 0;
							GlobalData.numNodeMap[GlobalData.gameRunTimeParam.lastSq] = 0;
						}
					}
					self.enterGame();
					self.propBombAction(2048);
				});
			}
			//以上操作会改变游戏状态所以更新信息
			ThirdAPI.updataGameInfo();
		}
		else if(data.type == 'RankView'){
			WxBannerAd.hideBannerAd();
			if(this.finishGameBoard != null){
				this.finishGameBoard.getComponent("FinishGame").isDraw = false;
			}
			this.showPBGameBoard('RankGameBoard');
		}
		else if(data.type == 'PropGameCancle'){
			if(this.finishGameBoard != null){
				WxBannerAd.showBannerAd();
			}
		}
	},
	blockShadow(){
		for(var i = 0;i < this.blocksBoard.children.length;i++){
			var block = this.blocksBoard.children[i];
			var sq = GlobalData.ConvertToMapSpace(this.moveIdx);
			if(i == this.moveIdx && GlobalData.numMap[sq] == 0){
				block.getComponent("BlockBoard").shadowSprite.active = true;
			}else{
				block.getComponent("BlockBoard").shadowSprite.active = false;
			}
		}
	},
	blockShadowCancle(){
		for(var i = 0;i < this.blocksBoard.children.length;i++){
			var block = this.blocksBoard.children[i];
			var sq = GlobalData.ConvertToMapSpace(i);
			if(GlobalData.numMap[sq] == 0){
				block.getComponent("BlockBoard").shadowSprite.active = false;
			}
		}
	}
});
