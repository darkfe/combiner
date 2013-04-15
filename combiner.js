/**
config = {
	entryFile : '',
	basePath : '',
	delimiter : '',
	banner : ''
}
*/

var os = require('os');
var EOL = os.EOL;

function combiner(config){

	var path = require('path');
	var fs = require('fs');
	var basePath = config.basePath;
	var entryFile = config.entryFile;
	var delimiter = config.delimiter;
	var existFiles = {};

	function dependCombin(filePath){

		var startFilePath = path.dirname(filePath) + '/';

		filePath = path.resolve(filePath);

		try{
			if(!fs.statSync(filePath).isFile()){
				throw "No such file [" + filePath + "]."
			}
		}catch(e){
			throw "No such file [" + filePath + "]."
		}

		if(existFiles[filePath]){
			return '';
		}

		existFiles[filePath] = 1;

		var fileContent = fs.readFileSync(filePath,'utf-8');

		var parsePatt = /'(?:\\.|[^'])*'|"(?:\\.|[^"])*"|\/\/.*$|\/\*[\S\s]*?\*\/\s*/mg;

		var reqFilePatt = /^\/\*\s*req(?:uire)?\s*([^,\s]+(?:\s*,\s*[^,\s]+)*)\s*\*\/\s*$/i;

		fileContent = fileContent.replace(parsePatt,function($match){

			var matchFiles;
			if(
				$match.indexOf('/*')===0 && 
				(matchFiles = $match.match(reqFilePatt)) &&
				matchFiles[1]
			){

				var dependFiles = matchFiles[1].split(/\s*,\s*/);

				var result = dependFiles.map(function(dependFile){

					if(basePath){
						dependFile = basePath + dependFile.trim();
					}else{
						dependFile = startFilePath + dependFile.trim();
					}

					return dependCombin(dependFile);

				}).join(delimiter);


				if(result){
					return result + delimiter + $match;
				}else{
					return $match;
				}

			}else{
				return $match;
			}
		});

		return fileContent;
	}

	var realPath = path.resolve(entryFile);

	return dependCombin(realPath);
}


exports.combiner = function(config){

	config = config || {};

	config.basePath = config.basePath || '';
	config.entryFile = config.entryFile || '';
	config.delimiter = config.delimiter || '';
	config.banner = config.banner || '';

	var resultCode = [];

	if(config.entryFile){
		resultCode = combiner(config);
		if(config.banner){
			resultCode = config.banner + EOL + resultCode;
		}
	}else{
		throw "Not Specified 'entryFile'";
	}
	return resultCode;
}