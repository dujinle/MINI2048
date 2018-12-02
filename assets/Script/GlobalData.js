GlobalData = {
	//皮肤设置
	skin:'color1',
	//历史游戏的最高得分
	lastScore:0,
	//数字更新时间
	numWrapCell:2,
	numWrapTime:10,
	//开始界面效果时间
	startGameTime:0.3,
	pauseGameTime:0.3,
	//声音下标参数
	AudioButton:0,
	AudioBg:1,
	AudioComb:2,
	AudioComb1:3,
	AudioComb2:4,
	AudioComb3:5,
	AudioComb4:6,
	AudioComb5:7,
	AudioComb6:8,
	AudioDown:9,
	AudioFall:10,
	AudioSupport:true,
	//设置数字概率生成方式
	numRate:{
		2	:	0.20,		//(0-0.20]
		4	:	0.20,		//(0.20-0.40]
		8	:	0.20,		//(0.40-0.60]
		16	:	0.15,		//(0.60-0.75]
		32	:	0.15,		//(0.75-0.90]
		64	:	0.05,		//(0.90-0.95]
		128	:	0.05		//(0.95-1.0]
	},
	//游戏数字存储矩阵
	numMap:[
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0
	],
	numNodeMap:[
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0
	],
	//移动的轨迹
	moveStep:[[0,-1],[1,0],[0,1],[-1,0]],
	RANK_TOT:2,
	FILE_LEFT:2,
	// 获得格子的横坐标
	RANK_Y:function(sq) {
		return sq >> 3;
	},
	// 获得格子的纵坐标
	FILE_X:function(sq) {
		return sq & 7;
	},
	//根据x,y坐标获取真实的地址下标
	COORD_XY:function(x,y) {
		return x + (y << 3);
	},
	ConvertToMapSpace:function(id){
		var x = (id >> 2) + 2;
		var y = (id & 3) + 2;
		return x + (y << 3);
	},
};