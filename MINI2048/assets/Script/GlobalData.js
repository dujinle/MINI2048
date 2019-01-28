GlobalData = {
	//皮肤设置
	skin:'color1',
	cdnWebsite: "https://alicdn.zhituokeji.com/",
	cdnFileDefaultPath:"minigame/mini2048/cdnParam1.2.0.2.json",
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
	cdnOtherGameDoor:{
		locker:[
			{
				hideRate:0.5,
				hotFlag:1,
				name:"2048六角正版",
				appid:"wxc796e8cabc773566",
				logo:"https://alicdn.zhituokeji.com/minigame/scrollLinkGameImage/icon_sixAngle.png"
			},
			{
				hideRate:0.5,
				hotFlag:1,
				name:"绝地求升",
				appid:"wx2bc7cdb0119bb86b",
				logo:"https://alicdn.zhituokeji.com/minigame/scrollLinkGameImage/icon_snow.png"
			},
			{
				hideRate:0.5,
				hotFlag:1,
				name:"无尽钓鱼",
				appid:"wx52f8dec006405bf6",
				logo:"https://alicdn.zhituokeji.com/minigame/scrollLinkGameImage/icon_fishmaster.png"
			},
			{
				hideRate:0.5,
				hotFlag:0,
				name:"俄罗斯2048",
				appid:"wx6838d3562692630c",
				logo:"https://alicdn.zhituokeji.com/minigame/scrollLinkGameImage/icon_2048clear.png"
			},
			{
				hideRate:0.5,
				hotFlag:0,
				name:"绝地求升",
				appid:"wx2bc7cdb0119bb86b",
				logo:"https://alicdn.zhituokeji.com/minigame/scrollLinkGameImage/icon_snow.png"
			},
			{
				hideRate:0.5,
				hotFlag:0,
				name:"无尽钓鱼",
				appid:"wx52f8dec006405bf6",
				logo:"https://alicdn.zhituokeji.com/minigame/scrollLinkGameImage/icon_fishmaster.png"
			}
		],
		InnerChain:{
			hotFlag:0,
			name:"2048六角正版",
			appid:"wxc796e8cabc773566",
			logo:"https://alicdn.zhituokeji.com/minigame/scrollLinkGameImage/icon_sixAngle.png"
		}
	},
	cdnGameConfig:{
		refreshBanner:0,		//0 关闭	1打开
		minShareTime:2.8,
		gameModel:'crazy',
		shareSuccessWeight:[1,1,1,1,1],
		shareADLevel:50000,
		PropShare:0.5,
		PropAV:0.5,
		shareCustomSet:1		//0 关闭 自定义分享 1打开自定义分享
	},
	//设置数字概率生成方式
	cdnNumRate:{
		20: {
            2: 0.20833333333333334,
            4: 0.3333333333333333,
            8: 0.041666666666666664,
            16: 0.4166666666666667,
            32: 0,
            64: 0,
            128: 0
        },
        45: {
            2: 0.1935483870967742,
            4: 0.25806451612903225,
            8: 0.06451612903225806,
            16: 0.0967741935483871,
            32: 0.22580645161290322,
            64: 0.16129032258064516,
            128: 0
        },
        60: {
            2: 0.1875,
            4: 0.25,
            8: 0.125,
            16: 0.125,
            32: 0.0625,
            64: 0.0625,
            128: 0.1875
        },
        80: {
            2: 0.11764705882352941,
            4: 0.17647058823529413,
            8: 0.23529411764705882,
            16: 0.11764705882352941,
            32: 0.11764705882352941,
            64: 0.058823529411764705,
            128: 0.11764705882352941,
            256: 0.058823529411764705
        },
        100: {
            2: 0.10869565217391304,
            4: 0.16304347826086957,
            8: 0.21739130434782608,
            16: 0.13043478260869565,
            32: 0.05434782608695652,
            64: 0.05434782608695652,
            128: 0.16304347826086957,
            256: 0.05434782608695652,
            512: 0.05434782608695652
        },
        default: {
            2: 0.11235955056179775,
            4: 0.16853932584269662,
            8: 0.2247191011235955,
            16: 0.0898876404494382,
            32: 0.056179775280898875,
            64: 0.056179775280898875,
            128: 0.16853932584269662,
            256: 0.056179775280898875,
            512: 0.056179775280898875,
            1024: 0.011235955056179775
        }
	},
	cdnNumRate15:{
        "30": {
            "2": 0.2,
            "4": 0.2,
            "8": 0.2,
            "16": 0.2,
            "32": 0.2,
            "64": 0,
            "128": 0
        },
        "60": {
            "2": 0.15384615384615385,
            "4": 0.15384615384615385,
            "8": 0.23076923076923078,
            "16": 0.23076923076923078,
            "32": 0.15384615384615385,
            "64": 0.07692307692307693,
            "128": 0
        },
        "90": {
            "2": 0.14285714285714285,
            "4": 0.14285714285714285,
            "8": 0.21428571428571427,
            "16": 0.21428571428571427,
            "32": 0.14285714285714285,
            "64": 0.07142857142857142,
            "128": 0.07142857142857142
        },
        "110": {
            "2": 0.13333333333333333,
            "4": 0.13333333333333333,
            "8": 0.2,
            "16": 0.2,
            "32": 0.13333333333333333,
            "64": 0.06666666666666667,
            "128": 0.06666666666666667,
            "256": 0.06666666666666667
        },
        "130": {
            "2": 0.125,
            "4": 0.125,
            "8": 0.1875,
            "16": 0.1875,
            "32": 0.1875,
            "64": 0.0625,
            "128": 0.0625,
            "256": 0.0375,
            "512": 0.025
        },
        "default": {
            "2": 0.12195121951219512,
            "4": 0.12195121951219512,
            "8": 0.18292682926829268,
            "16": 0.18292682926829268,
            "32": 0.18292682926829268,
            "64": 0.06097560975609756,
            "128": 0.06097560975609756,
            "256": 0.036585365853658534,
            "512": 0.024390243902439025,
            "1024": 0.024390243902439025
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
		PropSBAScaleTime:0.3,		//宝箱弹出效果时间
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
				PropSAB:0.2,
				PropFresh:0.2
			},
			4:{
				PropFresh:0.45,
				PropSAB:0.3
			},
			5:{
				PropFresh:0,
				PropSAB:1
			}
		},
		PropUnLock:{	//道具解锁盘数
			PropFresh:1,
			PropHammer:4,
			PropSAB:2,
			PropBomb:4,
			PropAD:3,		//分享广告解锁盘数
			PropAV:3,
			PropShare:2,
			PropRelive:3,
			PropBattle:3,
			PropInner:3,
			PropLocker:3
		},
		PropReliveRate:1,
		SABOpenRate:{		//打开宝箱获取道具的概率
			PropFresh:1,
			PropHammer:0,
			PropBomb:0
		},
		PropParam:{
			//刷新概率参数设置
			PropFresh:{
				bagNum:20,
				useNum:-1,
			},
			//锤子概率参数设置
			PropHammer:{
				15:{
					bagNum:1,
					useNum:1
				},
				30:{
					bagNum:2,
					useNum:2
				},
				default:{
					bagNum:3,
					useNum:3
				}
			},
			//炸弹概率参数设置
			PropBomb:{
				15:{
					bagNum:1,
					useNum:1
				},
				30:{
					bagNum:2,
					useNum:2
				},
				default:{
					bagNum:3,
					useNum:3
				}
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
						PropAV:0.7
					},
					PropBomb:{
						PropShare:0.3,
						PropAV:0.7
					},
					PropSAB:{
						PropShare:0.7,
						PropAV:0.3
					},
					PropRelive:{
						PropShare:1,
						PropAV:0
					},
					PropBattle:{
						PropShare:0.7,
						PropAV:0.3
					}
				},
				lock:{
					PropHammer:{
						PropShare:0.3,
						PropAV:0.7
					},
					PropBomb:{
						PropShare:0.3,
						PropAV:0.7
					},
					PropSAB:{
						PropShare:1,
						PropAV:0
					},
					PropRelive:{
						PropShare:1,
						PropAV:0
					},
					PropBattle:{
						PropShare:1,
						PropAV:0
					}
				}
			},
			normal:{
				isJushu:10,
				unLock:{
					PropHammer:{
						PropShare:0.3,
						PropAV:0.7
					},
					PropBomb:{
						PropShare:0.3,
						PropAV:0.7
					},
					PropSAB:{
						PropShare:0.7,
						PropAV:0.3
					},
					PropRelive:{
						PropShare:0.3,
						PropAV:0.7
					},
					PropBattle:{
						PropShare:0.7,
						PropAV:0.3
					}
				},
				lock:{
					PropHammer:{
						PropShare:0.3,
						PropAV:0.7
					},
					PropBomb:{
						PropShare:0.3,
						PropAV:0.7
					},
					PropSAB:{
						PropShare:0,
						PropAV:1
					},
					PropRelive:{
						PropShare:0.3,
						PropAV:0.7
					},
					PropBattle:{
						PropShare:0,
						PropAV:1
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