var fse = require('fs.extra');
var path = require('path');
var Shell = require('shell-task');

var args = process.argv.slice(2);

switch(args[0]) {
	case "build-widgets":
		buildWidgets();
		break;
	case "import-widgets":
		importWidgets();
		break;
	default:
		console.log("Error: Wrong command! Possible commands are 'build-widgets', 'import-widgets'.");
		break;
}

function buildWidgets () {
	// Copy changelog widget file with data
	var dir = "static/widgets/[BBHOST]/changelog/_data";

	fse.mkdirRecursive(dir);
	fse.copy("static/features/[BBHOST]/data/changelog.json", dir + "/changelog.json", { replace: true }, function(err){
		if(err) {
			return console.error(err);
		}
		console.log("changelog.json file copied!")
	});

	// Copy overview-content widget file with data
	dir = "static/widgets/[BBHOST]/overview-content/_data";
	
	fse.mkdirRecursive(dir);
	fse.copy("static/features/[BBHOST]/data/features.json", dir + "/features.json", { replace: true }, function(err){
		if(err) {
			return console.error(err);
		}
		console.log("features.json file copied!")
	});
};

function importWidgets () {
	var walker = fse.walk("static/widgets/[BBHOST]");

	walker.on("directories", function(root, stat, next) {
		stat.forEach(function(dir){
			var fullPath = path.resolve(root, dir.name);

			new Shell('bb import-item -t ' + fullPath)
				.run(function(err, next) {
					if(err) {
						console.err(err);
					}
				});
		});
	});
}