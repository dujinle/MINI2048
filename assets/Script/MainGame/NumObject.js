
cc.Class({
    extends: cc.Component,

    properties: {
		value:0,
		bgSprite:cc.Node,
		transDuration:0.1,
		pressedScale:1.2
    },
    onInit(num) {
		this.value = num;
		var spriteFrameName = GlobalData.skin + '_' + num;
		this.bgSprite.getComponent(cc.Sprite).spriteFrame = GlobalData.assets[spriteFrameName];
	},
	scaleBigOnce(){
		this.initScale = this.node.scale;
		var scaleUpAction = cc.scaleTo(this.transDuration, this.pressedScale);
        var scaleDownAction = cc.scaleTo(this.transDuration, this.initScale);
		this.node.runAction(cc.sequence(scaleUpAction,scaleDownAction));
	},
	freshNum(num){
		this.onInit(num);
		this.scaleBigOnce();
	},
	eatNode(node){
		var moveAction = cc.moveTo(0.1,this.node.getPosition());
		var destroyAction = cc.callFunc(function(){
			//self.freshNum(node.getComponent("NumObject").value + self.value);
			node.removeFromParent();
			node.destroy();
		},this);
		node.runAction(cc.sequence(moveAction,destroyAction));
	}
});
