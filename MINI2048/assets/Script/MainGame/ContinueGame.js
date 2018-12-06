
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
		 this.EventCustom = new cc.Event.EventCustom("dispatchEvent", true);
	},
	//继续游戏按钮回调
	onContinueCb(event){
		this.EventCustom.setUserData({type:'ContinueGame'});
		this.node.dispatchEvent(this.EventCustom);
	},
	//重新开始按钮回调
	onResetCb(event){
		this.EventCustom.setUserData({type:'ResetGame'});
		this.node.dispatchEvent(this.EventCustom);
	},
	showBoard(){
		this.node.active = true;
	},
	hideBoard(){
		this.node.active = false;
	}
});
