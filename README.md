# Scrammbl JS13kGames 2024 

A fast paced word game. You have 13 seconds to solve the words!

## How to play
- Solve the words before the time runs out.
- Drag and drop the blue letter tile into an empty grey tiles or a red letter tile.
- The tile will change color to show if you were correct or not.
- You can swap tiles by dragging a tile over another tile.
- 13 seconds is added to the timer when you get a tile in the correct spot.

## Installation
Run **`npm install`** to install build dependencies.

## Tasks
**`npm build`** builds the game, reports archive size and serves locally with browser sync live reload enabled.

**`npm debug`** builds the game without any minifying for easier debugging. Includes detailed console logs.

**`npm test`** repacks the contents of the public folder to report archive filesize.

**`npm sync`** rebuilds the game and refreshes the browser, automated via BrowserSync.

## Build task parameters
*`--pwa`* instructs to build a Progressive Web App - will add 842 bytes when zipped.

*`--roadroll`* instructs to use a JS packer to achieve up to 15% compression on top of the ZIP/gzip.

*`--mobile`* adds some HTML tags regarding mobile and iOS icons - increases the ZIP filesize with 42 bytes.

*`--social`* adds some HTML tags for SEO and social media (Twitter) - will add around 100 bytes, depending on description length.
