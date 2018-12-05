cc.Class({
    extends: cc.Component,

    properties: {
		numLabel:cc.Node,
    },
	startFlyOnce(idx,keyNum,addScore){
		if(idx == 0){
			this.numLabel.getComponent(cc.Label).string = addScore + "";
		}else{
			this.numLabel.getComponent(cc.Label).string = addScore + "x" + (idx + 1);
		}
		this.numLabel.color = cc.hexToColor(GlobalData.flyNumColors[keyNum]);
		this.node.scale = 0.5;
		var pos = this.node.getPosition();
        var bigAction = cc.scaleTo(0.2, 1);
        var moveAction = cc.moveTo(0.5, cc.p(pos.x, pos.y + 120));
		
        this.node.runAction(cc.sequence(cc.fadeIn(),bigAction, moveAction, cc.fadeOut()));
	}
});
