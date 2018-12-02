
cc.Class({
    extends: cc.Component,

    properties: {
		gotoHomeButton:cc.Node,
		returnGame:cc.Node,
    },

    onLoad () {
		this.node.active = false;
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
	},
	showPause(){
		console.log("showPause game board show");
		this.node.active = true;
		this.gotoHomeButton.scale = 0;
		this.returnGame.scale = 0;
		var returnGameScale = cc.scaleTo(GlobalData.pauseGameTime,1);
		this.returnGame.runAction(returnGameScale);
		var gotoHomeScale = cc.scaleTo(GlobalData.pauseGameTime,1);
		this.gotoHomeButton.runAction(gotoHomeScale);
	},
	hideStart(){
		var self = this;
		console.log("start game board hide");
		this.node.active = true;
		this.gotoHomeButton.scale = 0;
		this.returnGame.scale = 0;
		var scaleUpAction = cc.scaleTo(GlobalData.pauseGameTime,0);
		this.returnGame.runAction(scaleUpAction);
		this.gotoHomeButton.runAction(scaleUpAction);

		setTimeout(function(){
			self.node.active = false;
		},GlobalData.pauseGameTime * 1000 + 20);
	}
    // update (dt) {},
});
