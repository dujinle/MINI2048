var ThirdAPI = require('./common/ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
		//按钮接收参数
		startButton:cc.Node,
		gameRefreshButton:cc.Node,
		pauseButton:cc.Node,
		//head 参数
		kingLabel:cc.Node,
		kingSprite:cc.Node,
		scoreLabel:cc.Node,
		
		//面板接受参数
		blocksBoard:cc.Node,
		blockBoard:cc.Node,
		mainGameBoard:cc.Node,
		startGameBoard:cc.Node,
		pauseGameBoard:cc.Node,
		//其他参数
		totalScore:0,
		audioManager:cc.Node,
		
    },
    onLoad () {
		
	},
	start(){
		//初始化所有面板
		this.initBoards();
	},
	initBoards(){
		this.startGameBoard.getComponent("StartGame").showStart();
		this.startButton.getComponent(cc.Button).interactable = false;
		//主游戏界面初始化
		this.pauseButton.active = false;
		this.kingLabel.active = false;
		this.kingSprite.active = false;
		this.scoreLabel.active = false;
		this.gameRefreshButton.active = false;
		this.blockBoard.active = false;
		//初始化矩阵信息
		for(var i = GlobalData.RANK_TOP;i < 8;i++){
			for(var j = GlobalData.FILE_LEFT;j < 8;j++){
				var sq = GlobalData.COORD_XY(i,j);
				GlobalData.numNodeMap[sq] = 0;
				GlobalData.numMap[sq] = 0;
			}
		}
	},
	gameStartCb(){
		//关闭开始界面进入游戏主界面
		this.audioManager.getComponent("AudioManager").play(GlobalData.AudioButton);
		this.startGameBoard.getComponent("StartGame").hideStart();
		this.enterGame();
	},
	gamePauseCb(){
		this.audioManager.getComponent("AudioManager").play(GlobalData.AudioButton);
		this.pauseGameBoard.getComponent("PauseGame").showPause();
	},
	//开始初始化主游戏界面信息
	enterGame(){
		//主游戏界面初始化
		this.pauseButton.active = true;
		this.kingLabel.active = true;
		this.kingSprite.active = true;
		this.scoreLabel.active = true;
		this.gameRefreshButton.active = true;
		this.blockBoard.active = true;
		this.refeshNumObject();
		this.kingLabel.getComponent(cc.Label).string = GlobalData.lastScore;
	},
	refeshNumObject(){
		var num = ThirdAPI.getRandomNum(GlobalData.numRate);
		if(this.boardItem != null){
			this.boardItem.removeFromParent();
			this.boardItem.destroy();
			this.boardItem = null;
		}
		this.boardItem = cc.instantiate(GlobalData.assets["PBNumObject"]);
		this.boardItem.getComponent("NumObject").onInit(num);
		this.boardItem.on(cc.Node.EventType.TOUCH_START, this.eventTouchStart,this);
		this.boardItem.on(cc.Node.EventType.TOUCH_MOVE, this.eventTouchMove,this);
		this.boardItem.on(cc.Node.EventType.TOUCH_END, this.eventTouchEnd,this);
		this.boardItem.on(cc.Node.EventType.TOUCH_CANCEL, this.eventTouchCancel,this);
		this.mainGameBoard.addChild(this.boardItem);
		this.boardItem.setPosition(this.blockBoard.getPosition());
		console.log(num);
	},
	offNodeAction(){
		this.boardItem.off(cc.Node.EventType.TOUCH_START, this.eventTouchStart,this);
		this.boardItem.off(cc.Node.EventType.TOUCH_MOVE, this.eventTouchMove,this);
		this.boardItem.off(cc.Node.EventType.TOUCH_END, this.eventTouchEnd,this);
		this.boardItem.off(cc.Node.EventType.TOUCH_CANCEL, this.eventTouchCancel,this);
	},
	//游戏规则算法
	gameLogic(){
		var sq = GlobalData.ConvertToMapSpace(this.moveIdx);
		var x = GlobalData.FILE_X(sq);
		var y = GlobalData.RANK_Y(sq);
		var myNum = GlobalData.numMap[sq];
		console.log("gameLogic",sq,x,y);
		//最多有四次组合[-1,1]
		for(var i = 0;i < 4;i++){
			var eatNum = 0;
			var oriNode = GlobalData.numNodeMap[sq];
			for(var j = 0;j < GlobalData.moveStep.length;j++){
				var step = GlobalData.moveStep[j];
				var tsq = GlobalData.COORD_XY(x + step[0],y + step[1]);
				//console.log("gameLogic",step,GlobalData.numMap[tsq],myNum,tsq);
				if(GlobalData.numMap[tsq] == myNum){
					var node = GlobalData.numNodeMap[tsq];
					oriNode.getComponent("NumObject").eatNode(node);
					GlobalData.numMap[tsq] = 0;
					GlobalData.numNodeMap[tsq] = 0;
					eatNum = eatNum + 1;
				}
			}
			console.log(eatNum,myNum);
			if(eatNum > 0){
				this.totalScore = this.totalScore + myNum * eatNum + myNum;
				this.scoreLabel.getComponent("NumWrap").addNum(myNum * (eatNum + 1));
				myNum = myNum * 2;
				GlobalData.numMap[sq] = myNum;
				oriNode.getComponent("NumObject").freshNum(myNum);	
			}
		}
	},
	eventTouchStart(event){
		this.initLocation = this.boardItem.getPosition();
		this.touchLocation = this.boardItem.parent.convertToNodeSpaceAR(event.getLocation());
		console.log(this.initLocation.x,this.initLocation.y,this.touchLocation.x,this.touchLocation.y);
		var size = this.boardItem.getContentSize();
		var moveToPos = cc.p(this.touchLocation.x,this.touchLocation.y + size.height / 2);
		var moveAction = cc.moveTo(0.02,moveToPos);
		this.boardItem.runAction(moveAction);
		console.log('poker TOUCH_START');
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
				var dist = ThirdAPI.euclDist(blockPos,movePos);
				console.log(i,dist,blockPos.x,blockPos.y,movePos.x,movePos.y);
				if(dist <= nearDist){
					nearDist = dist;
					this.moveIdx = i;
				}
			}
			this.blockShadow();
			console.log(this.moveIdx,nearDist);
		}
	},
	
	eventTouchEnd(event){
		console.log('poker TOUCH_END');
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
				this.boardItem.getComponent("NumObject").scaleBigOnce();
				this.offNodeAction();
				GlobalData.numMap[sq] = parseInt(this.boardItem.getComponent("NumObject").value);
				GlobalData.numNodeMap[sq] = this.boardItem;
				this.gameLogic();
				this.boardItem = null;
				this.refeshNumObject();
				return true;
			}
		}
		var moveAction = cc.moveTo(0.02,this.initLocation);
		this.boardItem.runAction(moveAction);
	},
	eventTouchCancel(event){
		console.log('poker TOUCH_CANCEL');
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
				this.boardItem.getComponent("NumObject").scaleBigOnce();
				this.offNodeAction();
				GlobalData.numMap[sq] = parseInt(this.boardItem.getComponent("NumObject").value);
				GlobalData.numNodeMap[sq] = this.boardItem;
				this.gameLogic();
				this.boardItem = null;
				this.refeshNumObject();
				return true;
			}
		}
		var moveAction = cc.moveTo(0.02,this.initLocation);
		this.boardItem.runAction(moveAction);
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
	}
    // update (dt) {},
});
