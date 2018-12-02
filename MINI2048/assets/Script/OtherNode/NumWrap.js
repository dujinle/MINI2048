cc.Class({
    extends: cc.Component,

    properties: {
		value:0,
		addValue:0,
    },
	startRollNum(totalScore){
		console.log("startRollNum",totalScore);
		var goNum = totalScore / GlobalData.TimeActionParam.NumRollCell;
		var goTimeCell = GlobalData.TimeActionParam.NumRollTime / goNum;
		for(var i = 0;i < totalScore;i = i + GlobalData.TimeActionParam.NumRollCell){
			var delay = (i / 2) * goTimeCell;
			//console.log("delay time",delay);
			this.addAction(delay);
		}
	},
	addAction(time){
		var self = this;
		setTimeout(function(){
			//console.log("deal time");
			GlobalData.gameRunTimeParam.totalScore += GlobalData.TimeActionParam.NumRollCell;
			self.value = GlobalData.gameRunTimeParam.totalScore;
			self.node.getComponent(cc.Label).string = GlobalData.gameRunTimeParam.totalScore;
		},time * 1000);
	}
});
