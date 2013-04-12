# Combiner
========

Combiner is similar like nzakas's **combiner** tools.
So, your can see he's introducing for this tools idea.
<http://www.nczonline.net/blog/2009/09/22/introducing-combiner-a-javascriptcss-concatenation-tool/>

But, your need to provide the entry file name of the dependency start, this is different places with nzakas combiner.

## Installation

If you use [npm](https://github.com/isaacs/npm):

    npm install combiner

If you don't use npm, clone this repository or download the latest version using the GitHub repository Downloads link.

## Usage

This module contains one function called `combiner()`:

    > var combiner = require('combiner').combiner;
    > combiner({
			entryFile : '/path/to/main.js',
			delimiter : '',
			banner : '',
			basePath : '' 
      });

It also adds the `combiner` command:

    $ packer -h
    usage: <script> [options]

	Options:
	   -e, --entry_file    entry file
	   -o, --output_file   Output file (default stdout)
	   -p, --base_path     require file's base path
	   -d, --delimiter     mutilple file delimiter
	   -b, --banner        all code top banner comments

    $ combiner -e main.js 



