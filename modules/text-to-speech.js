const gtts = require('node-gtts')('en-us');
const path = require('path');

/**
 * Generates wav file from string provided
 * @param {string} file
 * @param {string} text
 * @returns {string}
 */
function textToSpeech(file, text) {
	const filePath = path.resolve(__dirname, '../output', file);
	console.log(filePath);
	return new Promise((resolve) => {
		gtts.save(filePath, text, () => {
			resolve(filePath);
		});
	});
}

module.exports = { textToSpeech };
