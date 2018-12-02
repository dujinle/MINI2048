
cc.Class({
    extends: cc.Component,

    properties: {
		finishGameRank:cc.Node,
		rankGmameView:cc.Node,
    },
	onLoad(){
		this.finishGameRank.active = false;
		this.rankGmameView.active = false;
	},
    start () {
        wx.onMessage(data => {
			this.finishGameRank.active = false;
			this.rankGmameView.active = false;
            switch (data.type) {
                case 'gameOverUIRank':
					wx.getFriendCloudStorage({
						keyList: ['maxScore','gold'], // 你要获取的、托管在微信后台都key
						success: res => {
							console.log(res.data);
							//排序
							this.finishGameRank.active = true;
							this.rankGmameView.active = false;
							var rankList = this.sortRank(res.data);
							this.drawRankOverList(rankList,data);
						}
					});
					
                    break;
                case 'rankUIFriendRank':
					wx.getFriendCloudStorage({
						keyList: ['maxScore','gold'], // 你要获取的、托管在微信后台都key
						success: res => {
							console.log(res.data);
							//排序
							this.finishGameRank.active = false;
							this.rankGmameView.active = true;
							var rankList = this.sortRank(res.data);
							this.drawRankFrientList(rankList,data);
						}
					});
                    break;
				case 'rankUIGroupRank':
					wx.getGroupCloudStorage({
						shareTicket: data.shareTicket,
						keyList: ['maxScore','gold'], // 你要获取的、托管在微信后台都key
						success: res => {
							console.log(res.data);
							//排序
							this.finishGameRank.active = false;
							this.rankGmameView.active = true;
							var rankList = this.sortRank(res.data);
							this.drawRankFrientList(rankList,data);
						}
					});
                    break;
            }
        });
    },
	drawRankOverList(dataList,data){
		wx.getUserInfo({
			openIdList: ['selfOpenId'],
			lang: 'zh_CN',
			success: (res) => {
				console.log('getUserInfo success', res.data);
				var preData = null;
				var drawList = [];
				var findSelf = false;
				for(var i = 0;i < dataList.length;i++){
					var item = dataList[i];
					item.rank = i + 1;
					item.my = false;
					if(item.nickname == res.data[0].nickName){
						item.my = true;
						if(preData != null){
							drawList.push(preData);
						}
						drawList.push(item);
						findSelf = true;
						continue;
					}
					if(findSelf == true){
						if(drawList.length <= 2){
							drawList.push(item);
						}
					}
					//找到三个 如果有了就结束循环
					if(drawList.length >= 3){
						break;
					}
					preData = item;
				}
				this.drawRankList(drawList,data);
			},
			fail: (res) => {
				//console.log('getUserInfo reject', res.data)
				reject(res)
				//data.name = '我';
				//data.avatarUrl = 'res/raw-assets/resources/textures/fireSprite.png';
				//this.drawSelfRank(data.KVDataList);
			}
		})
		
	},
	drawRankFrientList(rankList,data){
		wx.getUserInfo({
			openIdList: ['selfOpenId'],
			lang: 'zh_CN',
			success: (res) => {
				console.log('getUserInfo success', res.data);
				for(var i = 0;i < rankList.length;i++){
					var item = rankList[i];
					item.rank = i + 1;
					item.my = false;
					if(item.nickname == res.data[0].nickName){
						item.my = true;
					}
				}
				this.drawRankList(rankList,data);
			},
			fail: (res) => {
				//console.log('getUserInfo reject', res.data)
				reject(res)
				//data.name = '我';
				//data.avatarUrl = 'res/raw-assets/resources/textures/fireSprite.png';
				//this.drawSelfRank(data.KVDataList);
			}
		})
	},
	drawRankList(drawList,data){
		if(data.type == "gameOverUIRank"){
			this.finishGameRank.getComponent("FinishGameRank").loadRank(drawList);
		}else if(data.type == "rankUIFriendRank"){
			this.rankGmameView.getComponent("RankGameView").loadRank(drawList);
		}
	},
	sortRank(data){
		return data.sort(this.sortFunction);
	},
	sortFunction(a,b){
		var amaxScore = 0;
		var bmaxScore = 0;
		for(var i = 0;i < a.KVDataList.length;i++){
			var aitem = a.KVDataList[i];
			console.log(aitem);
			if(aitem.key == "maxScore"){
				amaxScore = parseInt(aitem.value);
			}
		}
		for(var i = 0;i < b.KVDataList.length;i++){
			var bitem = b.KVDataList[i];
			console.log(bitem);
			if(bitem.key == "maxScore"){
				bmaxScore = parseInt(bitem.value);
			}
		}
		return  bmaxScore - amaxScore;
	}
});
