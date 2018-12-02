cc.Class({
    extends: cc.Component,

    properties: {
		value:0,
		addValue:0,
    },
	addNum(num){
		this.addValue = num;
		console.log(this.addValue);
		for(var i = 0;i < this.addValue;i = i + 2){
			var delay = (i / 2) * GlobalData.numWrapTime;
			console.log("delay time",delay);
			this.addAction(delay);
		}
	},
	addAction(time){
		var self = this;
		setTimeout(function(){
			//console.log("deal time");
			self.value = self.value + GlobalData.numWrapCell;
			self.node.getComponent(cc.Label).string = self.value;
		},time);
	}
});
