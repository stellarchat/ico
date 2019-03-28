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
	    let b64 = Buffer.from(image).toString('base64');
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

var special = {
    native : logos["xlm"]
}

fs.writeFileSync('./data/anchor.json', JSON.stringify(anchors, null, 2));
fs.writeFileSync('./data/ico.json', JSON.stringify(ico, null, 2));
fs.writeFileSync('./data/special.json', JSON.stringify(special, null, 2));


/*
var specialData = {
  'Stellar Network' : {
    name : 'Stellar Network',
    assets : {
      'XLM' : {code : 'XLM', issuer : null},
    },
    logo : 'data:image/png;base64, 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',
  },
  'unknown' : {
    name : 'unknown',
    logo : 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAIBUExURf///344Ffr4+IE7Gfz7+3YrBnQoAnQnAJ5pT4RAH3csB9vIv3szD4E8GoA5F+bZ0385FnYqBYtLLHguCYI+HKJvVnQnAXctCP39/fDo5Y9RM3UpBKZ1XYA6GO/m46BrUqRxWZ9qULqVg9S9snw0EY9SNL+ci5JWOa+DbuXY0pBTNcmsnpxmTLiSf6h5Yp9rUfz8/IdEJPby8dfCuKV0XIpKKufa1f7+/vHq56BsU8SkldrGvX43FOLSy7aOe+3k4LGGcYVCIerf2vDp5qh4Yd7NxbuWhK6CbaJwV97MxPTu7L2ZiMGgkJtlSreQfXoxDZNXOufa1MiqnO7l4XUpA6d3YL6aicWllq2Ba9zJwffz8ujb1vr398Oiko5QMdG5rfv6+qx+aMCdjend2LuXhaVzW/n29XowDLGHcqRyWnkvC/Ps6pNYO/bx8IZDInguCta/tdvHvr+djHsyDrOJdZVbP/Lr6e/n5N3Lw+TW0IZEI/n29ppjSK2AasaomZhfQ9O7sIM/HppiR+HQybqUgvXw78qtn8Wml6FtVLKHc7yYhqd2X5JVOJ5oTptkSX02E7mSgKZ2Xujc15BUNodFJfv5+c+1qZRZPHw0EIhGJu7l4rKIdMywo8epm+vh3fHr6NW+s6l6Y+rg28uvormTgeTVz301EopKK9C2qpFVN5RaPc2k5EgAAAKESURBVGje7dj3UxpBFAfwBwc8QUBABaJAIIIkBBKIvSYaY+waW0zvvffee++a3vtfmd1DQo4w42WGN+PE/f6ws/tu9j5zt3twcwAiIiIiIiIiMzwn1tU5gnqTzVFZv4eION5Wir9j99RSGJ02VMRckXvjym7MiKkh58gxfl7DtjKfVuu7GJAV4/ZcI6vPOVHKT4022LlyPvc37GSkID3YypGzxLt5Ed9pl6ifmSqGuKiREoZoiI2aRoasJ0ZW8YVfQmu493LkFC2ykxu7SImNm7hh6aI0qvnOQtsaysfwqJ4bp6vpiDOHNfKPY+U+wuvwysT+g6Rrzokd7WuBHKkgftBlJF8g0woRmX45tLlnGbXRzHdXOTFi4UgVMXJA/kskRsIcuUyMNJXoj1zYIva/iIiISOo9KE8g/zmSPJ3cYl7BbLNmri41voVXFcWhEcnufbSY9SQHwFt8xXoho3Li1IixsKjYiPMnx814W1GcZTX4H/oN1qUAUVMcVmIC4Jneo5w4NaKfo4N5uCA5/px820oXx/A7G4/jcoAYfoSABVdAEw4qJ6q4XazR4kK5O4o96eNyMZF8MZJeAJTh+7h50NXOLqdVOVEdMtkNov1LxnHTT7kw4WJ3Dss7DV3RELRJGef4JwRHvn7TZiA/5AlP+Ic16UMsAm+cPkeHKsR5PysScX9KfndKFxM2N/9apHnK2uhAuA/eGUaH61UhwRYd1Nb9hbCm19mgKI7ha9a7zhceYv3D7FU/3MjWXg3SiwP3CkPZkJf9Rdf+LLIt3NFXLG9htvLP4wDd+KBGFdJ619TSrcuGwA30K4pDd7ylVg9/GNnK32TtYwyAKkRERERERGTG5xfV+1fLS6+G/gAAAABJRU5ErkJggg==',
  }
}
*/