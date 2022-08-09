const { textToSpeech } = require('./modules/text-to-speech');
const {
	getSubredditTopCommentHeader,
	getSubredditTopCommentContent
} = require('./modules/scrape-reddit');

function getTimestamp() {
	return new Date().toISOString().slice(0, 10);
}

(async function () {
	const showerThoughtsText = await getSubredditTopCommentHeader(
		'Showerthoughts'
	);

	if (showerThoughtsText) {
		await textToSpeech(
			`showerthoughts/${getTimestamp()}-shower-thoughts.wav`,
			showerThoughtsText
		);
	} else {
		console.error('Failed to find text!');
	}

	const storiesText = await getSubredditTopCommentContent('stories');

	if (showerThoughtsText) {
		await textToSpeech(
			`stories/${getTimestamp()}-stories.wav`,
			storiesText
		);
	} else {
		console.error('Failed to find text!');
	}
})();
