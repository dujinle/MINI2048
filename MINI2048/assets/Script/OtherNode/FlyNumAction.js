cc.Class({
    extends: cc.Component,

    properties: {
		numLabel:cc.Node,
    },
	onLoad(){
	},
	startFly(idx,delayTime,myNum,addScoreNum,cb){
		console.log(addScoreNum,myNum);
		if(idx == 0){
			this.numLabel.getComponent(cc.Label).string = addScoreNum + "";
		}else{
			this.numLabel.getComponent(cc.Label).string = addScoreNum + "x" + (idx + 1);
		}
		this.numLabel.color = cc.hexToColor(GlobalData.flyNumColors[myNum]);
		this.node.scale = 0.5;
		var pos = this.node.getPosition();
        var bigAction = cc.scaleTo(0.2, 1);
        var moveAction = cc.moveTo(0.5, cc.p(pos.x, pos.y + 120));
		var destroyAction = cc.callFunc(function(){
			if(cb != null){
				cb();
			}
		},this);
		
        this.node.runAction(cc.sequence(cc.delayTime(delayTime),bigAction, moveAction, cc.fadeOut(),destroyAction));
	},
});
