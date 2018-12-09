GlobalData = {
	//皮肤设置
	skin:'color1',
	cdnWebsite: "https://alicdn.zhituokeji.com/",
	//历史游戏的最高得分
	gameRunTimeParam:{
		StartGuideFlag:false,
		gameStatus:0,
		totalScore:0,
		maxScore:0,
		lastSq:0,		//最后一次棋子的位置
		lastFreshNum:0,
		shareTimes:0,
		stepNum:0,
		gold:0,
		juNum:0		//当前第几局
	},
	cdnGameConfig:{
		minShareTime:2,
		gameModel:'crazy',
		shareSuccessWeight:[1,1,0.8,0.8,0.6]
	},
	//设置数字概率生成方式
	cdnNumRate:{
		30:{
			2:0.10,
			4:0.10,
			8:0.10,
			16:0.10,
			32:0.10,
			64:0,	
			128:0	
		},
		60:{
			2:0.10,
			4:0.10,
			8:0.10,
			16:0.10,
			32:0.10,
			64:0.10,	
			128:0	
		},
		80:{
			2:0.10,
			4:0.10,
			8:0.10,
			16:0.10,
			32:0.10,
			64:0.10,	
			128:0.05
		},
		100:{
			2:0.10,
			4:0.10,
			8:0.10,
			16:0.10,
			32:0.10,
			64:0.10,	
			128:0.05,
			256:0.05
		},
		120:{
			2:0.10,
			4:0.10,
			8:0.10,
			16:0.10,
			32:0.10,
			64:0.10,	
			128:0.05,
			256:0.05,
			512:0.05
		},
		140:{
			2:0.10,
			4:0.10,
			8:0.10,
			16:0.10,
			32:0.10,
			64:0.10,	
			128:0.05,
			256:0.05,
			512:0.05,
			1024:0.02
		}
	},
	//数字更新时间
	TimeActionParam:{
		GuideMoveTime:2,			//引导动画时间
		EatNodeMoveTime:0.2,		//被吃掉的子移动时间
		EatNodeSameDelayTime:0,		//同类子移动延迟单元
		EatNodeOtherDelayTime:0.05,	//不同类子被吃间隔时间
		EatNodeBigTime:0.1,			//数字变大的时间这个值需要x2
		RefreshNodeTime:0.3,		//刷新数字的时间
		NumRollCell:2,				//数字roll的单元
		NumRollTime:0.2,			//数字刷新时长
		EatFlyTimeCell:0.5,			//数字飞的时间总时长 EatFlyTimeCell * 2.5
		StartGameMoveTime:0.3,		//开始界面的效果
		PauseGameMoveTime:0.3		//暂停游戏界面的时间
	},
	//数字颜色设置
	flyNumColors: {
        2: '#f6f2e8',
        4: '#30c900',
        8: '#eb6f00',
        16: '#ee5351',
        32: '#eeca07',
        64: '#079fcb',
        128: '#005cad',
        256: '#a64efb',
        512: '#c021ff',
        1024: '#05deac',
		2048: '#f3eee4'
    },
	//声音下标参数
	//游戏中音效参数不可改变
	AudioSupport:true,
	AudioParam:{
		AudioBg:0,
		AudioButton:1,
		AudioFall:2,
		AudioComb1:3,
		AudioComb2:4,
		AudioComb3:5,
		AudioComb4:6,
		AudioComb5:7,
		AudioComb6:8,
		AudioClearLight:9
	},
	//道具概率参数
	GamePropParam:{
		bagNum:{
			PropFresh:0,
			PropHammer:0,
			PropBomb:0,
			PropRelive:0
		},
		useNum:{
			PropFresh:0,
			PropHammer:0,
			PropBomb:0,
			PropRelive:0
		}
	},
	cdnPropParam:{	//道具自定义参数
		MergeParam:{	//合并数字出现刷新或者其他概率
			2:{
				PropFresh:0,
				PropSAB:0
			},
			3:{
				PropSAB:0,
				PropFresh:0.3
			},
			4:{
				PropFresh:0.7,
				PropSAB:0.3
			},
			5:{
				PropFresh:0,
				PropSAB:1
			}
		},
		PropUnLock:{	//道具解锁盘数
			PropFresh:1,
			PropHammer:3,
			PropSAB:3,
			PropBomb:3,
			PropAD:3,		//分享广告解锁盘数
			PropShare:3,
			PropRelive:1
		},
		PropReliveRate:0.5,
		SABOpenRate:{		//打开宝箱获取道具的概率
			PropFresh:0.4,
			PropHammer:0.3,
			PropBomb:0.3
		},
		PropParam:{
			//刷新概率参数设置
			PropFresh:{
				bagNum:5,
				useNum:-1,
			},
			//锤子概率参数设置
			PropHammer:{
				bagNum:2,
				useNum:2
			},
			//炸弹概率参数设置
			PropBomb:{
				bagNum:2,
				useNum:2
			},
			//复活概率参数设置
			PropRelive:{
				bagNum:1,
				useNum:1
			}
		},
		//不同的模式对应的概率不同 可以动态配置
		PropShareOrADRate:{
			crazy:{
				isJushu:50,
				unLock:{
					PropHammer:{
						PropShare:0.3,
						PropAD:0.7
					},
					PropBomb:{
						PropShare:0.3,
						PropAD:0.7
					},
					PropSAB:{
						PropShare:0.7,
						PropAD:0.3
					},
					PropRelive:{
						PropShare:0.3,
						PropAD:0.7
					}
				},
				lock:{
					PropHammer:{
						PropShare:0.3,
						PropAD:0.7
					},
					PropBomb:{
						PropShare:0.3,
						PropAD:0.7
					},
					PropSAB:{
						PropShare:1,
						PropAD:0
					},
					PropRelive:{
						PropShare:0.3,
						PropAD:0.7
					}
				}
			},
			normal:{
				isJushu:10,
				unLock:{
					PropHammer:{
						PropShare:0.3,
						PropAD:0.7
					},
					PropBomb:{
						PropShare:0.3,
						PropAD:0.7
					},
					PropSAB:{
						PropShare:0.7,
						PropAD:0.3
					},
					PropRelive:{
						PropShare:0.3,
						PropAD:0.7
					}
				},
				lock:{
					PropHammer:{
						PropShare:0.3,
						PropAD:0.7
					},
					PropBomb:{
						PropShare:0.3,
						PropAD:0.7
					},
					PropSAB:{
						PropShare:0,
						PropAD:1
					},
					PropRelive:{
						PropShare:0.3,
						PropAD:0.7
					}
				}
			}
		}
	},
	cdnShareImages:["res/raw-assets/resources/shareImages/shareDefault.d3b6b.png"],
	cdnTexts:["你介意男生玩这个游戏吗?"],
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
	RANK_TOP:2,
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
		var x = (id & 3) + 2;
		var y = (id >> 2) + 2;
		var sq = x + (y << 3);
		//console.log("ConvertToMapSpace",id,sq);
		return sq;
	},
	ConvertToMapId:function(sq){
		var x = (sq & 7) - 2;
		var y = (sq >> 3) - 2;
		var id = x + (y << 2);
		//console.log("ConvertToMapId",sq,id);
		return id;
	},
};