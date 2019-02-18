cc.Class({
    extends: cc.Component,

    properties: {
		appName:null,
		appId:null,
		linkPages:null,
		gameLogo:cc.Node,
		logoUrl:null,
		hotSprite:cc.Node,
    },
	setLinkGame(item){
		var self = this;
		this.appName = item.name;
		this.appId = item.appid;
		this.logoUrl = item.logo;
		this.hotSprite.active = false;
		cc.loader.load(this.logoUrl, function (err, texture) {
            // Use texture to create sprite frame
			//console.log('setLinkGame',texture);
            var sprite = self.gameLogo.getComponent(cc.Sprite);
            sprite.spriteFrame = new cc.SpriteFrame(texture);
			if(item.hotFlag != 0){
				console.log('setLinkGame',item.name);
				self.hotSprite.active = true;
			}
        });
	},
	pressCb(event){
		try{
			wx.navigateToMiniProgram({
				appId: this.appId,
				path: this.linkPages,
				extarData: {
					open: 'happy'
				},
				envVersion: 'develop', //release
				success(res) {
					console.log(res);
				},
				fail(res){
					console.log(res);
				}
			})
		}catch(err){
			console.log(err);
		}
	}
});
