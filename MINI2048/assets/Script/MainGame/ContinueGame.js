
cc.Class({
    extends: cc.Component,

    properties: {
		continueButton:cc.Node,
		restartButton:cc.Node,
		tipLabel:cc.Node,
    },

    onLoad () {
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
			}
         }, this.node);
		 this.tipLabel.active = false;
	},
	
	showBoard(){
		console.log("showPause game board show");
		this.node.active = true;
		this.tipLabel.active = true;
		this.restartButton.scale = 0;
		this.continueButton.scale = 0;
		var returnGameScale = cc.scaleTo(GlobalData.TimeActionParam.PauseGameMoveTime,1);
		this.continueButton.runAction(returnGameScale);
		var gotoHomeScale = cc.scaleTo(GlobalData.TimeActionParam.PauseGameMoveTime,1);
		this.restartButton.runAction(gotoHomeScale);
	},
	hideBoard(callback){
		var self = this;
		console.log("start game board hide");
		var returnGameAction = cc.scaleTo(GlobalData.TimeActionParam.PauseGameMoveTime,0.2);
		this.continueButton.runAction(returnGameAction);
		var gotoHomeAction = cc.scaleTo(GlobalData.TimeActionParam.PauseGameMoveTime,0.2);
		this.restartButton.runAction(gotoHomeAction);
		var hideAction = cc.callFunc(function(){
			self.tipLabel.active = false;
			self.node.active = false;
			callback()
		},this);
		this.node.runAction(cc.sequence(
			cc.delayTime(GlobalData.TimeActionParam.PauseGameMoveTime),
			hideAction
		));
	},
    // update (dt) {},
});
