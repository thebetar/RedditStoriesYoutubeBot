const schedule = require('node-schedule');
const { textToSpeech } = require('./modules/text-to-speech');
const {
	getSubredditTopCommentHeader,
	getSubredditTopCommentContent
} = require('./modules/scrape-reddit');
const fs = require('fs');

function getTimestamp() {
	return `${new Date()
		.toISOString()
		.slice(0, 10)}_${new Date().getHours()}:${getMinutes()}`;

	function getMinutes() {
		return new Date().getMinutes().toString().length === 1
			? `0${new Date().getMinutes()}`
			: new Date().getMinutes().toString();
	}
}

/**
 * Creates a file of the top comment of subreddit, by interval and saves as filename
 * @param {string} subreddit
 * @param {string} filename
 * @param {string} type
 * @param {string} interval
 */
async function createRedditAudioFile(
	subreddit,
	filename,
	type = 'header',
	interval = ''
) {
	try {
		const text =
			type === 'header'
				? await getSubredditTopCommentHeader(subreddit, interval)
				: await getSubredditTopCommentContent(subreddit, interval);

		if (text) {
			if (!fs.existsSync(`output/${subreddit.toLowerCase()}`)) {
				fs.mkdirSync(`output/${subreddit.toLowerCase()}`);
			}
			await textToSpeech(
				`${subreddit.toLowerCase()}/${getTimestamp()}-${filename}.wav`,
				text
			);
		} else {
			console.error('Failed to find text!');
		}
	} catch (error) {
		console.error('Something went wrong...');
		console.error(error);
	}
}

function getFollowedSubreddits() {
	console.time('Getting top comments...');

	createRedditAudioFile(
		'ShowerThoughts',
		'shower-thoughts',
		'header',
		'hour'
	);
	createRedditAudioFile('todayilearned', 'today-i-learned', 'header', 'hour');
	createRedditAudioFile('stories', 'stories', 'content');
	createRedditAudioFile(
		'StoriesAboutKevin',
		'stories-about-kevin',
		'content'
	);
	createRedditAudioFile('LifeProTips', 'life-pro-tips', 'content');

	console.timeEnd('Getting top comments...');
}

schedule.scheduleJob(
	{
		minute: 0
	},
	getFollowedSubreddits
);

// TODO add background music to audo
// TODO add gameplay of game
