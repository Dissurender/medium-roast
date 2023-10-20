

[![](https://img.shields.io/github/issues/dissurender/medium-roast)](https://github.com/Dissurender/medium-roast/issues) [![](https://img.shields.io/github/license/dissurender/medium-roast)](https://github.com/Dissurender/medium-roast/blob/main/LICENSE) ![](https://img.shields.io/github/languages/top/dissurender/medium-roast)

# Medium-roast

## Description

Medium-roast is an API based on [HackerNews](https://news.ycombinator.com) created by [ycombinator](https://www.ycombinator.com).

- I built this project to provide a more accessible API for HN; a sister project of [hn-go](https://github.com/Dissurender/hn-go), which runs on a local cache structure.
- Medium-roast ingests and creates a local database of http response data from HN's firebase API.
- Using this code structure, I focused on cleaning up the data to be friendlier for clients to parse with minimal fetching on their part.
- Learned concepts: Chunked API responses, Postgres interactions, ES Modules.

## Table of Contents

- [Medium-roast](#medium-roast)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Usage](#usage)
  - [How to Contribute](#how-to-contribute)

## Features

DONE
- Postgres DB to persist data from fetches to reduce network traffic.
- Implement chunked http processing.
- Focus on cyclic complexity to break apart large logic structures.

TODO
- Refresh on interval to add new Stories.
- Implement root level logging.
- Finish consume function for recursive comment or expand DB schemas.

## Usage

To run locally cd into the project root directory and use `npm run dev` in your terminal.

You may also provide a `.env`ironment with a connection string.

## How to Contribute

Please veiw the issues tab or open a discussion for non-listed issues.
Adhere to the [Contributor Covenant](https://www.contributor-covenant.org/)
