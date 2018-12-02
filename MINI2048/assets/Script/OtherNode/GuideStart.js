cc.Class({
    extends: cc.Component,

    properties: {
		guideNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		var self = this;
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
				self.hideGuide();
			}
        }, this.node);
		this.guideNode.active = false;
	},
	showGuide(startPos,endPos){
		var self = this;
		this.guideNode.setPosition(startPos);
		this.guideNode.active = true;
		var callFunc = cc.callFunc(function(){
			self.guideNode.setPosition(startPos);
		});
		var moveEnd = cc.moveTo(GlobalData.TimeActionParam.GuideMoveTime,endPos);
		var repeat = cc.repeatForever(cc.sequence(moveEnd,callFunc));
		this.guideNode.runAction(repeat);
	},
	hideGuide(){
		this.guideNode.stopAllActions();
		this.node.removeFromParent();
		this.node.destroy();
	}
});
