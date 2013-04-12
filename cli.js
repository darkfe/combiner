#!/usr/bin/env node

var fs = require('fs');
var combiner = require('./combiner').combiner;
var args = require('nomnom').opts({
    entry_file: {
        abbr: 'e',
		help: 'entry file',
		required : true
    },
    output_file: {
		abbr: 'o',
		help: 'Output file (default stdout)'
    },
    base_path : {
    	abbr : 'p',
    	help : 'require file\'s base path'
    },
    delimiter : {
    	abbr : 'd',
    	type : 'string',
    	help : 'mutilple file delimiter'
    },
    banner : {
    	abbr : 'b',
    	help : 'all code top banner comments'
    }
}).parseArgs();

if(args.delimiter){
	args.delimiter = args.delimiter
	.replace(/\\n/g,'\n')
	.replace(/\\r/g,'\r')
	.replace(/\\t/g,'\t')
	.replace(/\\f/g,'\f')
}

if(args.entry_file){
	var result = combiner({
		entryFile : args.entry_file,
		delimiter : args.delimiter,
		banner : args.banner,
		basePath : args.base_path 
	});

	if(args.output_file){
		fs.writeFile(args.output_file, result, function(error){
			if (error) {
				console.log('could not write to "' + args.output_file + '": ' + error.message);
			}
		});
	}else{
		process.stdout.write(result);
	}
}
