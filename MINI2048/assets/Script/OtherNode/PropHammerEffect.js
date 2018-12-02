cc.Class({
    extends: cc.Component,

    properties: {
		//演示动画节点
		handleNode:cc.Node,
		hammerNode:cc.Node,
		numItemNode:cc.Node,
		//使用道具节点
		hammerRealNode:cc.Node,
    },
	onLoad(){
		this.hammerRealNode.active = false;
		var self = this;
		var EventCustom = new cc.Event.EventCustom("pressed", true);
		cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
            onTouchBegan: function (touch, event) {
				EventCustom.setUserData(event);
				self.node.dispatchEvent(EventCustom);
                return true;
            },
            onTouchMoved: function (touch, event) {            // 触摸移动时触发
            },
            onTouchEnded: function (touch, event) {            // 点击事件结束处理
			}
        }, this.node);
	},
	start(){
		//this.onStart();
	},
	onStart(){
		this.node.active = true;
		var self = this;
		this.startEffect(function(){
			self.startEffect(function(){
				self.node.getChildByName("propBg").active = false;
				self.node.getChildByName("bgSprite").active = false;
				self.node.getChildByName("cancleBg").active = false;
			});
		});
	},
	cancleButtonCb(){
		this.node.getChildByName("propBg").active = false;
		this.node.getChildByName("bgSprite").active = false;
		this.node.getChildByName("cancleBg").active = false;
	},
    startEffect(callback){
		this.numItemNode.runAction(cc.fadeIn(0));
		this.handleEffect(callback);
	},
	handleEffect(callback){
		var self = this;
		this.handlePos = this.handleNode.getPosition();
		var handleSize = this.handleNode.getContentSize();
		var endPos = this.numItemNode.getPosition();
		var moveToNode = cc.moveTo(0.5,cc.p(endPos.x,endPos.y + 5));
		var pressRotate = cc.moveTo(0.2,cc.p(endPos.x,endPos.y));
		var callFunc = cc.callFunc(function(){
			self.handleNode.setPosition(self.handlePos);
			self.handleNode.runAction(cc.fadeIn(0));
			self.hammerEffect(callback);
		},this);
		this.handleNode.runAction(cc.sequence(moveToNode,pressRotate,cc.delayTime(0.2),cc.fadeOut(0.2),callFunc));
	},
	hammerEffect(callback){
		var self = this;
		this.hammerPos = this.hammerNode.getPosition();
		var hammerSize = this.hammerNode.getContentSize();
		var endPos = this.numItemNode.getPosition();
		var moveToNode = cc.moveTo(0.5,cc.p(endPos.x + hammerSize.width/2,endPos.y + 5));
		var pressAction = cc.sequence(cc.rotateTo(0.2,-30),cc.rotateTo(0.2,0));
		var moveToOrig = cc.moveTo(0.5,this.hammerPos);
		var callFunc = cc.callFunc(function(){
			self.numItemNode.runAction(cc.fadeOut(0.2));
		},this);
		var actionEnd = cc.callFunc(function(){
			callback();
		},this);
		this.hammerNode.runAction(cc.sequence(moveToNode,pressAction,callFunc,moveToOrig,actionEnd));
	},
	hammerOneNum(itemNode,callback){
		var endPos = itemNode.getPosition();
		this.hammerRealNode.active = true;
		var hammerSize = this.hammerRealNode.getContentSize();
		var hammerScale = this.hammerRealNode.scale;
		this.hammerRealNode.setPosition(cc.p(endPos.x + hammerSize.width * hammerScale,endPos.y - 100));
		
		this.hammerPos = this.hammerRealNode.getPosition();
		
		
		var moveToNode = cc.moveTo(0.5,cc.p(endPos.x + hammerSize.width * hammerScale,endPos.y + 10));
		var pressAction = cc.sequence(cc.rotateTo(0.2,-30),cc.rotateTo(0.2,0));
		var moveShow = cc.spawn(moveToNode,cc.fadeIn(0.5));
		var moveHide = cc.spawn(cc.moveTo(0.5,this.hammerPos),cc.fadeOut(0.5));
		
		var callFunc = cc.callFunc(function(){
			itemNode.runAction(cc.fadeOut(0.2));
		},this);
		var actionEnd = cc.callFunc(function(){
			callback();
		},this);
		this.hammerRealNode.runAction(cc.sequence(moveShow,pressAction,callFunc,moveHide,actionEnd));
	}
});
