

/**
 config = {
	entryFile : '',
	basePath : '',
	delimiter : '',
	banner : ''
 }
 */
var os = require('os')
var EOL = os.EOL;

function combiner(config){	

	var path = require('path');
	var fs = require('fs');
	var basePath = config.basePath;
	var entryFile = config.entryFile;
	var delimiter = config.delimiter;
	var existFiles = {};
	var resultCode = [];


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
			return;
		}

		existFiles[filePath] = 1;

		var fileContent = fs.readFileSync(filePath);
		var pathPatt = /^[\r\n\s]*\/\*\s*(?:req|requires)\s+([^*\s]+)\s*\*\//img;
		var currentMatch = null;

		while(currentMatch = pathPatt.exec(fileContent)){

			var dependFiles = currentMatch[1].split(',');

			var result = dependFiles.every(function(dependFile,index){

				if(basePath){
					dependFile = basePath + dependFile;
				}else{
					dependFile = startFilePath + dependFile;
				}

				if(dependCombin(dependFile) === false){
					return false;
				}

				return true;
			});

			if(result === false){
				return result;
			}
		}

		resultCode.push(fileContent);

		return true;
	}

	var realPath = path.resolve(entryFile);

	dependCombin(realPath);

	return resultCode.join(config.delimiter);
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