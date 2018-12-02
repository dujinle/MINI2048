var ThirdAPI = require('ThirdAPI');
var util = require('util');
var PropManager = require('PropManager');
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
		
		//面板接受参数
		blocksBoard:cc.Node,
		blockBoard:cc.Node,
		mainGameBoard:cc.Node,
		continueGameBoard:cc.Node,
		startGameBoard:cc.Node,
		pauseGameBoard:cc.Node,
		finishGameBoard:cc.Node,
		rankGameBorad:cc.Node,
		propGameBoard:cc.Node,
		//其他参数
		totalScore:0,
		audioManager:cc.Node,
		
    },
    onLoad () {
		console.log("onLoad start");
		//异步加载动态数据
		this.rate = 0;
		this.resLength = 7;
		GlobalData.assets = {};
		var self = this;
		this.loadUpdate = function(){
			console.log("this.rate:" + self.rate);
			var scale = Math.floor((self.rate/self.resLength ) * 100);
			if(self.rate >= self.resLength){
				self.unschedule(self.loadUpdate);
				self.startButton.getComponent(cc.Button).interactable = true;
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
		this.startButton.getComponent(cc.Button).interactable = false;
		this.schedule(this.loadUpdate,0.5);
		ThirdAPI.loadLocalData();
	},
	start(){
		console.log("start");
		//初始化所有面板
		ThirdAPI.loadCDNData();
		this.initBoards();
		if(GlobalData.gameRunTimeParam.gameStatus == 1){
			this.continueGameBoard.getComponent("ContinueGame").showBoard();
		}else{
			this.startGameBoard.getComponent("StartGame").showStart();
		}
	},
	initBoards(){
		console.log("initBoards start");
		//this.clearGame();
		this.continueGameBoard.active = false;
		this.finishGameBoard.active = false;
		this.rankGameBorad.active = false;
		this.propGameBoard.active = false;
		
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
		if(customEventData == "C_continue"){
			this.continueGameBoard.getComponent("ContinueGame").hideBoard(function(){
				self.resumeGameMap();
				self.enterGame();
				//以上操作会改变游戏状态所以更新信息
				ThirdAPI.updataGameInfo();
			});
		}else if(customEventData == "C_restart"){
			//重新开始游戏
			this.continueGameBoard.getComponent("ContinueGame").hideBoard(function(){
				GlobalData.gameRunTimeParam.gameStatus = 0;
				self.startGameBoard.getComponent("StartGame").showStart();
				//以上操作会改变游戏状态所以更新信息
				ThirdAPI.updataGameInfo();
			});
			
		}else if(customEventData == "S_start"){
			this.startGameBoard.getComponent("StartGame").hideStart(function(){
				GlobalData.gameRunTimeParam.juNum += 1;
				self.clearGame();
				self.enterGame();
				//以上操作会改变游戏状态所以更新信息
				ThirdAPI.updataGameInfo();
			});
		}else if(customEventData == "P_continue"){
			this.pauseGameBoard.getComponent("PauseGame").hidePause();
		}else if(customEventData == "P_exit"){
			this.pauseGameBoard.getComponent("PauseGame").hidePause(function(){
				GlobalData.gameRunTimeParam.gameStatus = 0;
				self.clearGame();
				self.initBoards();
				self.startGameBoard.getComponent("StartGame").showStart();
				//以上操作会改变游戏状态所以更新信息
				ThirdAPI.updataGameInfo();
			});
		}else if(customEventData == "F_restart"){
			this.finishGameBoard.getComponent("FinishGame").hide();
			GlobalData.gameRunTimeParam.juNum += 1;
			this.clearGame();
			this.initBoards();
			this.enterGame();
			//以上操作会改变游戏状态所以更新信息
			ThirdAPI.updataGameInfo();
		}else if(customEventData == "R_exit"){
			this.rankGameBorad.getComponent("RankGame").hide();
		}else if(customEventData == "R_show"){
			if(this.finishGameBoard.active == true){
				this.finishGameBoard.getComponent("FinishGame").isDraw = false;
			}
			this.rankGameBorad.getComponent("RankGame").show();
		}else if(customEventData == "P_show"){
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
		this.gamePropFresh.getChildByName("numLabel").getComponent(cc.Label).string = "x" + GlobalData.GamePropParam.bagNum["PropFresh"];
		this.gamePropBomb.getChildByName("numLabel").getComponent(cc.Label).string = "x" + GlobalData.GamePropParam.bagNum["PropBomb"];
		this.gamePropClear.getChildByName("numLabel").getComponent(cc.Label).string = "x" + GlobalData.GamePropParam.bagNum["PropHammer"];
	},
	gamePropButtonCb(event, customEventData){
		console.log("gamePropButtonCb",customEventData);
		if(customEventData == "PropFresh"){
			//判断是否超过使用上限
			if(GlobalData.cdnPropParam.PropParam[customEventData].useNum >= 0){
				if(GlobalData.GamePropParam.useNum[customEventData] >= GlobalData.cdnPropParam.PropParam[customEventData].useNum){
					return;
				}
			}
			//判断是否有道具可以使用
			if(GlobalData.GamePropParam.bagNum[customEventData] <= 0){
				return;
			}
			GlobalData.GamePropParam.useNum[customEventData] += 1;
			GlobalData.GamePropParam.bagNum[customEventData] -= 1;
			this.gamePropFresh.getChildByName("numLabel").getComponent(cc.Label).string = "x" + GlobalData.GamePropParam.bagNum[customEventData];
			this.refeshNumObject(true);
		}else if(customEventData == "PropHammer"){
			//判断是否超过使用上限
			if(GlobalData.cdnPropParam.PropParam[customEventData].useNum >= 0){
				if(GlobalData.GamePropParam.useNum[customEventData] >= GlobalData.cdnPropParam.PropParam[customEventData].useNum){
					return;
				}
			}
			//判断是否有道具可以使用
			if(GlobalData.GamePropParam.bagNum[customEventData] <= 0){
				return;
			}
			this.propHammerGuide = cc.instantiate(GlobalData.assets["PBHammerGuide"]);
			this.mainGameBoard.addChild(this.propHammerGuide);
			var mainPos = this.mainGameBoard.getPosition();
			this.propHammerGuide.setPosition(mainPos);
			this.propHammerGuide.getComponent("PropHammerEffect").onStart();
			GlobalData.GamePropParam.useNum[customEventData] += 1;
			GlobalData.GamePropParam.bagNum[customEventData] -= 1;
			this.gamePropClear.getChildByName("numLabel").getComponent(cc.Label).string = "x" + GlobalData.GamePropParam.bagNum[customEventData];
			this.mainGameBoard.on("pressed",this.propPressCallBack,this);
		}else if(customEventData == "PropBomb"){
			//判断是否超过使用上限
			if(GlobalData.cdnPropParam.PropParam[customEventData].useNum >= 0){
				if(GlobalData.GamePropParam.useNum[customEventData] >= GlobalData.cdnPropParam.PropParam[customEventData].useNum){
					return;
				}
			}
			//判断是否有道具可以使用
			if(GlobalData.GamePropParam.bagNum[customEventData] <= 0){
				return;
			}
			this.propBombGuide = cc.instantiate(GlobalData.assets["PBBombGuide"]);
			this.mainGameBoard.addChild(this.propBombGuide);
			var mainPos = this.mainGameBoard.getPosition();
			this.propBombGuide.setPosition(mainPos);
			this.propBombGuide.getComponent("PropBombEffect").onStart();
			GlobalData.GamePropParam.useNum[customEventData] += 1;
			GlobalData.GamePropParam.bagNum[customEventData] -= 1;
			this.gamePropBomb.getChildByName("numLabel").getComponent(cc.Label).string = "x" + GlobalData.GamePropParam.bagNum[customEventData];
			this.propBombAction();
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
		
		GlobalData.gameRunTimeParam.gameStatus = 0;
		GlobalData.gameRunTimeParam.totalScore = 0;
		GlobalData.gameRunTimeParam.stepNum = 0;

		GlobalData.GamePropParam.bagNum.PropFresh = 0;
		GlobalData.GamePropParam.bagNum.PropHammer = 0;
		GlobalData.GamePropParam.bagNum.PropBomb = 0;
		GlobalData.GamePropParam.useNum.PropFresh = 0;
		GlobalData.GamePropParam.useNum.PropHammer = 0;
		GlobalData.GamePropParam.useNum.PropBomb = 0;

		this.scoreLabel.getComponent(cc.Label).string = 0;
		this.gamePropFresh.getChildByName("numLabel").getComponent(cc.Label).string = "x" + GlobalData.GamePropParam.bagNum["PropFresh"];
		this.gamePropBomb.getChildByName("numLabel").getComponent(cc.Label).string = "x" + GlobalData.GamePropParam.bagNum["PropBomb"];
		this.gamePropClear.getChildByName("numLabel").getComponent(cc.Label).string = "x" + GlobalData.GamePropParam.bagNum["PropHammer"];
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
		this.refeshNumObject();
		this.kingLabel.getComponent(cc.Label).string = GlobalData.gameRunTimeParam.maxScore;
		if(GlobalData.gameRunTimeParam.StartGuideFlag == false){
			this.startGuideBoard();
		}
		GlobalData.gameRunTimeParam.gameStatus = 1;
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
		//var test = [256,512,1024];
		var num = -1;//test[GlobalData.gameRunTimeParam.stepNum % 3];
		while(num == -1){
			var lastKey = 140;
			for(var key in GlobalData.cdnNumRate){
				if(GlobalData.gameRunTimeParam.stepNum <= key){
					lastKey = key;
					break;
				}
			}
			num = util.getRandomNum(GlobalData.cdnNumRate[lastKey]);
		}
		if(this.boardItem != null){
			this.boardItem.removeFromParent();
			this.boardItem.destroy();
			this.boardItem = null;
		}
		this.boardItem = cc.instantiate(GlobalData.assets["PBNumObject"]);
		if(scaleFlag == false){
			this.boardItem.getComponent("NumObject").onInit(num);
		}else{
			this.boardItem.getComponent("NumObject").scaleShow(num);
		}
		this.boardItem.on(cc.Node.EventType.TOUCH_START, this.eventTouchStart,this);
		this.boardItem.on(cc.Node.EventType.TOUCH_MOVE, this.eventTouchMove,this);
		this.boardItem.on(cc.Node.EventType.TOUCH_END, this.eventTouchEnd,this);
		this.boardItem.on(cc.Node.EventType.TOUCH_CANCEL, this.eventTouchCancel,this);
		this.mainGameBoard.addChild(this.boardItem);
		var blockBoardPos = this.blockBoard.getPosition();
		this.boardItem.setPosition(cc.p(blockBoardPos.x,blockBoardPos.y - 3));
		console.log("refeshNumObject",num,GlobalData.gameRunTimeParam.stepNum);
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
		var sq = GlobalData.ConvertToMapSpace(this.moveIdx);
		var x = GlobalData.FILE_X(sq);
		var y = GlobalData.RANK_Y(sq);
		var myNum = GlobalData.numMap[sq];

		var oriNode = GlobalData.numNodeMap[sq];
		var oriPos = oriNode.getPosition();
		var eatTag = false;
		console.log("gameLogic start",sq,x,y,myNum);
		//最多有四次组合[-1,1]
		var totalEatNum = 0;
		var sameLevelWasteTime = 0;
		for(var i = 0;i < 4;i++){
			var eatNum = 0;
			sameLevelWasteTime = GlobalData.TimeActionParam.EatNodeOtherDelayTime * i;
			
			//直接投入的2048 播放动作效果 退出循环
			if(myNum == 2048){
				GlobalData.numMap[sq] = 0;
				GlobalData.numNodeMap[sq] = 0;
				oriNode.getComponent("NumObject").merge2048Action(sameLevelWasteTime,sq,function(){
					//console.log(sq);
					oriNode.stopAllActions();
					oriNode.removeFromParent();
					oriNode.destroy();	
					//console.log(GlobalData.numMap);
				});
				sameLevelWasteTime += 1.2;
				break;
			}
			
			for(var j = 0;j < GlobalData.moveStep.length;j++){
				var step = GlobalData.moveStep[j];
				var tsq = GlobalData.COORD_XY(x + step[0],y + step[1]);
				//console.log("gameLogic",step,GlobalData.numMap[tsq],myNum,tsq);
				if(GlobalData.numMap[tsq] == myNum){
					//1,子被吃掉动画
					oriNode.getComponent("NumObject").eatOtherNode(i,GlobalData.numNodeMap[tsq]);
					GlobalData.numMap[tsq] = 0;
					GlobalData.numNodeMap[tsq] = 0;
					eatNum = eatNum + 1;
					sameLevelWasteTime += GlobalData.TimeActionParam.EatNodeSameDelayTime;
				}
			}
			console.log("once",i,eatNum,myNum);
			totalEatNum = totalEatNum + eatNum;
			if(eatNum > 0){
				var addScore = (myNum + myNum) * eatNum * (i + 1);
				sameLevelWasteTime += GlobalData.TimeActionParam.EatNodeMoveTime;
				//1.1判断是否合成的2048
				if(myNum * 2 == 2048){
					oriNode.getComponent("NumObject").merge2048Action(sameLevelWasteTime,sq,function(){
						console.log(oriNode.getNumberOfRunningActions());
						oriNode.stopAllActions();
						oriNode.removeFromParent();
						oriNode.destroy();
						GlobalData.numMap[sq] = 0;
						GlobalData.numNodeMap[sq] = 0;
					});
					sameLevelWasteTime += 1.2;
					break;
				}else{
					//2.数字合并完毕，进行效果起飞
					oriNode.getComponent("NumObject").flyEatFinishNode(
						i,sameLevelWasteTime,
						myNum * 2,addScore,this.scoreLabel);
					
					//3.音效播放
					oriNode.getComponent("NumObject").eatNodeAudioPlay(i,sameLevelWasteTime);
					//4.刷新数字并执行吃子结束之后的动画效果
					oriNode.getComponent("NumObject").eatFinishNum(myNum * 2,sameLevelWasteTime);
					myNum = myNum * 2;
					GlobalData.numMap[sq] = myNum;
					eatTag = true;
				}
			}else{
				break;
			}
			
		}
		//等待上边执行完毕
		setTimeout(function(){
			if(eatTag == true){
				self.getProp(totalEatNum + 1,oriPos);
			}
		
			//判断游戏是否结束
			var finishTag = true;
			for(var i = GlobalData.RANK_TOP;i < 6;i++){
				for(var j = GlobalData.FILE_LEFT;j < 6;j++){
					var fsq = GlobalData.COORD_XY(i,j);
					//console.log(sq,GlobalData.numMap[sq]);
					if(GlobalData.numMap[fsq] == 0){
						finishTag = false;
						break;
					}
				}
			}
			if(finishTag == true){
				//存储信息
				if(GlobalData.gameRunTimeParam.maxScore < GlobalData.gameRunTimeParam.totalScore){
					GlobalData.gameRunTimeParam.maxScore = GlobalData.gameRunTimeParam.totalScore;
				}
				GlobalData.gameRunTimeParam.gameStatus = 0;
				//ThirdAPI.updataGameInfo();
				self.finishGameBoard.getComponent("FinishGame").show();
			}else{
				GlobalData.gameRunTimeParam.stepNum += 1;
				self.boardItem = null;
				self.refeshNumObject();
			}
			ThirdAPI.updataGameInfo();
		},sameLevelWasteTime * 1000);
	},
	//获取道具操作
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
				if(GlobalData.cdnPropParam.PropParam[res].useNum >= 0){
					if(GlobalData.GamePropParam.useNum[res] >= GlobalData.cdnPropParam.PropParam[res].useNum){
						return;
					}
				}
				//判断背包数量是否少于上限值
				if(GlobalData.GamePropParam.bagNum[res] < GlobalData.cdnPropParam.PropParam[res].bagNum){
					GlobalData.GamePropParam.bagNum[res] += 1;
					self.gamePropFresh.getChildByName("numLabel").getComponent(cc.Label).string = "x" + GlobalData.GamePropParam.bagNum[res];
				}
			});
		}
		var resArr = res.split("_");
		if(resArr[0] == "PropBao" || resArr[0] == "PropShare"){
			this.propGameBoard.getComponent("PropGame").initLoad(fromPos,resArr[0],resArr[1]);
		}
	},
	eventTouchStart(event){
		this.moveIdx = -1;
		if(this.propBombGuide != null && this.propBombGuide.isValid == true){
			this.propBombGuide.getComponent("PropBombEffect").cancleButtonCb();
		}
		this.initLocation = this.boardItem.getPosition();
		this.touchLocation = this.boardItem.parent.convertToNodeSpaceAR(event.getLocation());
		console.log(this.initLocation.x,this.initLocation.y,this.touchLocation.x,this.touchLocation.y);
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
				this.boardItem.getComponent("NumObject").scaleBigOnce(0);
				this.offNodeAction();
				GlobalData.numMap[sq] = parseInt(this.boardItem.getComponent("NumObject").value);
				GlobalData.numNodeMap[sq] = this.boardItem;
				this.gameLogic();
				return true;
			}
		}
		var moveAction = cc.moveTo(0.02,this.initLocation);
		this.boardItem.runAction(moveAction);
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
				this.boardItem.getComponent("NumObject").scaleBigOnce(0);
				this.offNodeAction();
				GlobalData.numMap[sq] = parseInt(this.boardItem.getComponent("NumObject").value);
				GlobalData.numNodeMap[sq] = this.boardItem;
				this.gameLogic();
				return true;
			}
		}
		var moveAction = cc.moveTo(0.02,this.initLocation);
		this.boardItem.runAction(moveAction);
	},
	propPressCallBack(event){
		var data = event.getUserData();
		var selectIdx = -1;
		var pressPos = this.mainGameBoard.convertToNodeSpaceAR(data.currentTouch.getLocation());
		var box = this.blocksBoard.getBoundingBox();
		console.log(pressPos);
		if(cc.rectContainsPoint(box,pressPos)){
			//console.log("在矩形内部");
			var nearDist = 10000;
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
			}
			//this.blockShadow();
			if(selectIdx != -1){
				var sq = GlobalData.ConvertToMapSpace(this.moveIdx);
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
					});
				}
			}
			console.log(selectIdx,nearDist);
		}else{
			this.propHammerGuide.stopAllActions();
			this.propHammerGuide.removeFromParent();
			this.propHammerGuide.destroy();
			console.log("在矩形外部");
		}
	},
	propBombAction(){
		if(this.boardItem != null){
			this.boardItem.removeFromParent();
			this.boardItem.destroy();
			this.boardItem = null;
		}
		this.boardItem = cc.instantiate(GlobalData.assets["PBNumObject"]);
		this.boardItem.getComponent("NumObject").scaleShow(2048);
		this.boardItem.on(cc.Node.EventType.TOUCH_START, this.eventTouchStart,this);
		this.boardItem.on(cc.Node.EventType.TOUCH_MOVE, this.eventTouchMove,this);
		this.boardItem.on(cc.Node.EventType.TOUCH_END, this.eventTouchEnd,this);
		this.boardItem.on(cc.Node.EventType.TOUCH_CANCEL, this.eventTouchCancel,this);
		this.mainGameBoard.addChild(this.boardItem);
		var blockBoardPos = this.blockBoard.getPosition();
		this.boardItem.setPosition(cc.p(blockBoardPos.x,blockBoardPos.y - 3));
		console.log("refeshNumObject",GlobalData.gameRunTimeParam.stepNum);
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
    // update (dt) {},
});
