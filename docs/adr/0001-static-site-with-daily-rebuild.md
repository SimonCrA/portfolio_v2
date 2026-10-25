# Static site with a daily rebuild

The site is built fully ahead of time, with no API routes running on each request. Projects are content Simón writes, and Videos come from YouTube's free per-channel feed, read at build time. A scheduled GitHub Action triggers a Vercel rebuild once a day so new Videos show up. We accepted that a new Video can take up to a day to appear, in exchange for dropping the paid RapidAPI wrapper, the GitHub token and the runtime failure modes.
