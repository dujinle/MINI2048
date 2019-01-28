cc.Class({
    extends: cc.Component,

    properties: {
		appName:null,
		appId:null,
		linkPages:null,
		gameLogo:cc.Node,
		gameName:cc.Node,
		logoUrl:null,
		hotSprite:cc.Node,
    },
	onLoad () {
		this.hotSprite.active = false;
	},
	setLinkGame(item){
		var self = this;
		this.appName = item.name;
		this.appId = item.appid;
		this.logoUrl = item.logo;
		this.gameName.getComponent(cc.Label).string = item.name;
		cc.loader.load(this.logoUrl, function (err, texture) {
            // Use texture to create sprite frame
			//console.log('setLinkGame',texture);
            var sprite = self.gameLogo.getComponent(cc.Sprite);
            sprite.spriteFrame = new cc.SpriteFrame(texture);
			if(item.hotFlag != 0){
				self.hotSprite.active = true;
			}
			//self.gameName.getComponent(cc.Label).string = item.name;
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
		}catch(err){}
	}
});
