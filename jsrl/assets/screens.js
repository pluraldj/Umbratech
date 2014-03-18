Game.Screen = {};

// Define our initial start screen
Game.Screen.startScreen = {
	enter: function() { console.log("Entered start screen."); },
	exit: function() { console.log("Exited start screen."); },
	render: function(display) {
		// Render our prompt to the screen
		display.drawText(1, 1, "%c{yellow}Javascript Roguelike");
		display.drawText(1, 2, "Press [Enter] to start");
	},
	handleInput: function(inputType, inputData) {
		// When [Enter] is pressed, go to the play screen
		if (inputType === 'keydown') {
			if (inputData.keyCode === ROT.VK_RETURN) {
				Game.switchScreen(Game.Screen.playScreen);
			}
		}
	}
}

// Define our playing screen
Game.Screen.playScreen = {
	_map: null,
    _centerX: 0,
    _centerY: 0,
	enter: function() {
		var map = [];
        var mapWidth = 500;
        var mapHeight = 500;
		for (var x = 0; x < mapWidth; x++) {
			// Create the nested array for the y values
			map.push([]);
			// Add all the tiles
			for (var y = 0; y < mapHeight; y++) {
				map[x].push(Game.Tile.nullTile);
			}
		}
		// Set up the map generator
		var generator = new ROT.Map.Cellular(mapWidth, mapHeight);
		generator.randomize(0.5);
		var totalIterations = 3;
		// Iteratively smoothen the map
		for (var i; i < totalIterations - 1; i++) {
			generator.create();
		}
		// Smoothen it one more time and then update our map
		generator.create(function(x, y, v) {
			if (v === 1) {
				map[x][y] = Game.Tile.floorTile;
			} else {
				map[x][y] = Game.Tile.wallTile;
			}
		});
		// Create our map from the tiles
		this._map = new Game.Map(map);
	},
    move: function(dX, dY) {
      // Positive dX means movement right
      // negative means movement left
      // 0 means none
      this._centerX = Math.max(0,
        Math.min(this._map.getWidth() - 1, this._centerX + dX));
      // Positive dY means movement down
      // negative means movement up
      // 0 means none
      this._centerY = Math.max(0,
        Math.min(this._map.getHeight() - 1, this._centerY + dY));
    },
	render: function(display) {
            var screenWidth = Game.getScreenWidth();
            var screenHeight = Game.getScreenHeight();
            // Make sure the x-axis doesn't go to the left of the left bound
            var topLeftX = Math.max(0, this._centerX - (screenWidth / 2));
            // Make sure we still have enough space to fit an entire game screen
            topLeftX = Math.min(topLeftX, this._map.getWidth() - screenWidth);
            // Make sure the y-axis doesn't go above the top bound
            var topLeftY = Math.max(0, this._centerY - (screenHeight / 2));
            // Make sure we still have enough space to fit an entire game screen
            topLeftY = Math.min(topLeftY, this._map.getHeight() - screenHeight);
            // Iterate through all visible map cells
            for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
                for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
                    // Fetch the glyph for the tile and render it to the screen
                    // at the offset position
                    var glyph = this._map.getTile(x, y).getGlyph();
                    display.draw(
                        x - topLeftX,
                        y - topLeftY,
                        glyph.getChar(),
                        glyph.getForeground(),
                        glyph.getBackground());
                }
            }
            // Render the cursor
            display.draw(
                this._centerX - topLeftX,
                this._centerY - topLeftY,
                '@',
                'white',
                'black');
	},
    handleInput: function(inputType, inputData) {
        if (inputType === 'keydown') {
            // If enter is pressed, go to the win screen
            // If escape is pressed, go to lose screen
            if (inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(Game.Screen.winScreen);
            } else if (inputData.keyCode === ROT.VK_ESCAPE) {
                Game.switchScreen(Game.Screen.loseScreen);
            }
            // Movement
            if (inputData.keyCode === ROT.VK_LEFT) {
                this.move(-1, 0);
            } else if (inputData.keyCode === ROT.VK_RIGHT) {
                this.move(1, 0);
            } else if (inputData.keyCode === ROT.VK_UP) {
                this.move(0, -1);
            } else if (inputData.keyCode === ROT.VK_DOWN) {
                this.move(0, 1);
            }
        }    
    }
}

// Define our winning screen
Game.Screen.winScreen = {
    enter: function() {    console.log("Entered win screen."); },
    exit: function() { console.log("Exited win screen."); },
    render: function(display) {
        // Render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            // Generate random background colors
            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);
            var background = ROT.Color.toRGB([r, g, b]);
            display.drawText(2, i + 1, "%b{" + background + "}You win! You lucky bastard.");
        }
    },
    handleInput: function(inputType, inputData) {
        // Nothing to do here      
    }
}

// Define our losing screen
Game.Screen.loseScreen = {
    enter: function() {    console.log("Entered lose screen."); },
    exit: function() { console.log("Exited lose screen."); },
    render: function(display) {
        // Render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            display.drawText(2, i + 1, "%b{red}You lost. That was the wrong key, stupid.");
        }
    },
    handleInput: function(inputType, inputData) {
        // Nothing to do here      
    }
}