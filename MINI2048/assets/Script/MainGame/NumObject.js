
cc.Class({
    extends: cc.Component,

    properties: {
		value:0,
		bgSprite:cc.Node,
		pressedScale:1.2,
		flyNode:null,
		audioSources:{
			type:cc.AudioSource,
			default:[]
		},
    },
    onInit(num) {
		this.value = num;
		var spriteFrameName = GlobalData.skin + '_' + num;
		this.bgSprite.getComponent(cc.Sprite).spriteFrame = GlobalData.assets[spriteFrameName];
	},
	merge2048Action(delayTime,sq,callback){
		console.log("merge2048Action",sq);
		var self = this;
		var ESAction = cc.callFunc(function(){
			var E1Sprite = new cc.Node("E1");
			var sprite = E1Sprite.addComponent(cc.Sprite);
			sprite.spriteFrame = GlobalData.assets["eliminate_1"];
			self.node.addChild(E1Sprite);
			
			var E2Sprite = new cc.Node("E2");
			sprite = E2Sprite.addComponent(cc.Sprite);
			sprite.spriteFrame = GlobalData.assets["eliminate_2"];
			self.node.addChild(E2Sprite);
			
			var E3Sprite = new cc.Node("E3");
			sprite = E3Sprite.addComponent(cc.Sprite);
			sprite.spriteFrame = GlobalData.assets["eliminate_3"];
			self.node.addChild(E3Sprite);
			console.log(E1Sprite.scale);
			E1Sprite.scale = 1;
			E2Sprite.scale = 1;
			E3Sprite.scale = 1;
			self.bgSprite.runAction(cc.sequence(cc.delayTime(delayTime),cc.fadeOut(0.1)));
			console.log(E1Sprite.getContentSize());
			var scaleBig1 = cc.scaleTo(0.3,2);
			E1Sprite.runAction(cc.sequence(scaleBig1.clone(),cc.fadeOut(0.1)));
			E2Sprite.runAction(cc.sequence(cc.delayTime(0.3),scaleBig1.clone(),cc.fadeOut(0.1)));
			E3Sprite.runAction(cc.sequence(cc.delayTime(0.6),scaleBig1.clone(),cc.fadeOut(0.1)));
			self.play(GlobalData.AudioParam.AudioClearLight);
		});
		
		var numAction = cc.callFunc(function(){
			var x = GlobalData.FILE_X(sq);
			var y = GlobalData.RANK_Y(sq);
			for(var j = 0;j < GlobalData.moveStep.length;j++){
				var step = GlobalData.moveStep[j];
				var tsq = GlobalData.COORD_XY(x + step[0],y + step[1]);
				if(GlobalData.numMap[tsq] != 0){
					GlobalData.numNodeMap[tsq].removeFromParent();
					GlobalData.numNodeMap[tsq].destroy();
				}
				GlobalData.numNodeMap[tsq] = 0;
				GlobalData.numMap[tsq] = 0;
			}
			console.log("merge2048Action",sq);
			callback();
		},this);
		this.node.runAction(cc.sequence(cc.delayTime(delayTime),ESAction));
		this.node.runAction(cc.sequence(cc.delayTime(delayTime + 1.2),numAction));
	},
	flyEatFinishNode(idx,delayTime,eatValue,totalScore,scoreLabel){
		//数字合并之后 分数飞到label的效果
		var self = this;
		if(this.flyNode == null){
			this.flyNode = cc.instantiate(GlobalData.assets["PBNumFly"]);
			this.node.parent.addChild(this.flyNode);
		}
		//刷新分数
		this.rollNumFromLabel = function(){
			if(totalScore <= 0){
				this.unschedule(this.rollNumFromLabel);
				return;
			}
			totalScore -= GlobalData.TimeActionParam.NumRollCell;
			GlobalData.gameRunTimeParam.totalScore += GlobalData.TimeActionParam.NumRollCell;
			scoreLabel.getComponent(cc.Label).string = GlobalData.gameRunTimeParam.totalScore;
		}
		var pos = this.node.getPosition();
		var size = this.node.getContentSize();
		var flyNodeSize = this.flyNode.getContentSize();
		this.flyNode.setPosition(cc.p(pos.x,pos.y + size.height/2 + flyNodeSize.height/4));
		console.log("totalScore",totalScore,idx);
		var actionEnd = cc.callFunc(function(){
			self.flyNode.stopAllActions();
			self.flyNode.getComponent("FlyNumAction").numLabel.setPosition(cc.p(0,0));
			self.flyNode.getComponent("FlyNumAction").startFly(
				idx,
				0,
				eatValue,
				totalScore,
				function(){
					//开始刷新分数
					scoreLabel.getComponent("NumWrap").startRollNum(totalScore);
				}
			);
		},this)
		this.node.runAction(cc.sequence(cc.delayTime(delayTime),actionEnd));
	},
	//动画增大一次这里加入延迟参数 多次执行的时候延迟一下
	scaleBigOnce(delayTime){
		var self = this;
		this.initScale = this.node.scale;
		var scaleUpAction = cc.scaleTo(GlobalData.TimeActionParam.EatNodeBigTime, this.pressedScale);
        var scaleDownAction = cc.scaleTo(GlobalData.TimeActionParam.EatNodeBigTime, this.initScale);
		var playAudioAction = cc.callFunc(function(){
			self.play(GlobalData.AudioParam.AudioFall);
		},this);
		this.node.runAction(cc.sequence(cc.delayTime(delayTime),scaleUpAction,scaleDownAction));
		this.node.runAction(cc.sequence(cc.delayTime(delayTime),playAudioAction));
	},
	scaleShow(num){
		var self = this;
		var delayTime = 0;
		this.initScale = this.node.scale;
		this.node.scale = 0;
		this.onInit(num);
		var scaleUpAction = cc.scaleTo(GlobalData.TimeActionParam.RefreshNodeTime, this.pressedScale);
        var scaleDownAction = cc.scaleTo(GlobalData.TimeActionParam.RefreshNodeTime, this.initScale);
		var playAudioAction = cc.callFunc(function(){
			self.play(GlobalData.AudioParam.AudioFall);
		},this);
		this.node.runAction(cc.sequence(cc.delayTime(delayTime),scaleUpAction,scaleDownAction));
		this.node.runAction(cc.sequence(cc.delayTime(GlobalData.TimeActionParam.RefreshNodeTime),playAudioAction));
	},
	eatFinishNum(num,delayTime){
		var self = this;
		var callFunc = cc.callFunc(function(){
			self.onInit(num);
		},this);
		this.node.runAction(cc.sequence(cc.delayTime(delayTime),callFunc));
		this.scaleBigOnce(delayTime);
	},
	eatOtherNode(idx,node){
		//1.移动节点到主节点上
		var moveAction = cc.moveTo(GlobalData.TimeActionParam.EatNodeMoveTime,this.node.getPosition());
		//2.释放节点内存
		var destroyAction = cc.callFunc(function(){
			node.removeFromParent();
			node.destroy();
		},this);
		node.runAction(cc.sequence(
			cc.delayTime(GlobalData.TimeActionParam.EatNodeOtherDelayTime * idx),
			moveAction,
			destroyAction
		));
	},
	//播放吃子的音效
	eatNodeAudioPlay(idx,delayTime){
		var self = this;
		//播放音效
		var playAudioAction = cc.callFunc(function(){
			self.play(GlobalData.AudioParam.AudioComb1 + idx);
		},this);
		this.node.runAction(cc.sequence(cc.delayTime(delayTime),playAudioAction));
	},
	play(type){
		if(GlobalData.AudioSupport == true){
			this.audioSources[type].getComponent(cc.AudioSource).play();
		}
	}
});
