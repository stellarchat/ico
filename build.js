const fs = require('fs');
var anchors = require('./anchor.js');
var ico = require('./ico.js');

function genBase64() {
	let logos = {};
	const path = './data/logos';
	fs.readdirSync(path)
	  .filter(filename => {
	    return filename.match(/\.png$/);
	  })
	  .forEach(filename => {
	    let match = filename.match(/(.+)\.png$/);
	    if (match === null) {
	      return;
	    }
	    let logoName = match[1];

	    let image = fs.readFileSync(`${path}/${filename}`);
	    let b64 = new Buffer(image).toString('base64');
	    logos[logoName] = 'data:image/png;base64, ' + b64;
	  })
	return logos;
}

var logos = genBase64();
for (var domain in anchors) {
	if (!logos[domain]) {
		throw new Error(domain + ' logo missing!');
	}
	anchors[domain].logo = logos[domain];
}

fs.writeFileSync('./data/anchor.json', JSON.stringify(anchors, null, 2));
fs.writeFileSync('./data/ico.json', JSON.stringify(ico, null, 2));