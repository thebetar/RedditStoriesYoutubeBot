const puppeteer = require('puppeteer');

async function getSubredditTopCommentHeader(subreddit, interval = 'day') {
	const url = `https://www.reddit.com/r/${subreddit}/top/?t=${interval}`;

	// Start puppeteer
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	// Go to Subreddit
	await page.goto(url);

	// Get top comment
	const topComment = await getValueFromCSS(
		'[data-testid="post-container"] [data-click-id="body"]',
		page
	);

	// Close browser
	await browser.close();

	// Return comment
	return topComment;
}

async function getSubredditTopCommentContent(subreddit, interval = 'day') {
	const url = `https://www.reddit.com/r/${subreddit}/top/?t=${interval}`;

	// Start puppeteer
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	// Go to Subreddit
	await page.goto(url);

	// Navigate to top comment
	const element = await page.$(
		'[data-testid="post-container"] [data-click-id="body"]'
	);
	await element.click();

	// Get text content from comment
	let text = `${await getValueFromCSS(
		'[data-test-id="post-content"] h1',
		page
	)}. \n \n ${await getValueFromCSS(
		'[data-test-id="post-content"] [data-click-id="text"]',
		page
	)}`;

	// Close browser
	await browser.close();

	// Return comment
	return text;
}

/**
 * Helper function to wait for element and then get the text content from it
 * @param {string} selector
 * @param {any} page
 * @returns
 */
async function getValueFromCSS(selector, page) {
	await page.waitForSelector(selector);
	return await page.$eval(selector, (el) => el.textContent);
}

module.exports = {
	getSubredditTopCommentHeader,
	getSubredditTopCommentContent
};
