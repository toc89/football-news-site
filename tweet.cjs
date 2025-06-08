require('dotenv').config();
const fetch = require('node-fetch');
const { TwitterApi } = require('twitter-api-v2');

async function main() {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;

  const response = await fetch(`https://gnews.io/api/v4/top-headlines?lang=en&token=${NEWS_API_KEY}`);
  const data = await response.json();

  const articles = data.articles;

  if (!articles || articles.length === 0) {
    console.log("No articles found—nothing to tweet.");
    return;
  }

  const { title, url } = articles[0];
  const status = `${title}\nRead more → ${url}`;

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

  await client.v2.tweet(status);
  console.log("✅ Tweet sent:", status);
}

main().catch(err => {
  console.error("❌ Tweet failed:", err);
});
