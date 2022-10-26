<div align="center">
  <h1>
    <img
      src="https://i.ibb.co/v1bS7pj/icon-rounded-box.png"
      width="150px"
    >
    <br/>
    Open Telegram to Notion Bot
  </h1>
</div>

<p align="center"> <a href="https://t.me/OpenTelegramToNotionBot" target="_blank"><img alt="" src="https://img.shields.io/badge/Telegram-4797ff?style=normal&logo=Telegram&logoColor=white" style="vertical-align:center" /></a></p>

<p align="center">
    <img src="https://img.shields.io/github/issues/FranP-Code/Telegram-to-Notion-Bot?style=flat-square">
    <img src="https://img.shields.io/github/issues-pr/FranP-Code/Telegram-To-Notion-Bot?style=flat-square">
    <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/FranP-Code/Telegram-To-Notion-Bot?style=flat-square">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/FranP-Code/Telegram-To-Notion-Bot?style=flat-square">
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/FranP-Code/Telegram-To-Notion-Bot?style=flat-square">
</p>

## Description
This bot receive the text that you send and store it on one selected database of Notion.

## Features
- Save texts on your Notion database
- Save images on your Notion database
- Define the properties of the new page of your database
- 100% Open Source and Free
## Screenshots
 <img src="https://i.ibb.co/z73qrqg/index.png">
 <img src="https://i.ibb.co/pJ10w9j/Telegram-To-Notion-Bot-Demo-Acelerated.gif">

## Tech Used
 ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
 ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
 ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
 <a href="https://railway.app">
 ![Railway](https://img.shields.io/badge/railway-444.svg?style=for-the-badge&logo=railway&logoColor=white)
 </a>
 <a href="https://grammy.dev">![Grammy](https://img.shields.io/badge/GrammY-009dca.svg?style=for-the-badge&logo=grammy&logoColor=white)</a>

## Additional

Dont forget to check also:
- [Open Telegram to Notion Bot website's](https://github.com/FranP-code/Open-Telegram-to-Notion-Website) repository
- [Open Telegram to Notion Bot backend](https://github.com/FranP-code/Open-Telegram-to-Notion-Backend) repository
- [Open Telegram to Notion Roadmap](https://franpcode.notion.site/franpcode/3ef68732c1f9426dbdaba21e20dc3509?v=660b09746d4d4ede877a477d3b628f02)

### Installation instructions
1. Clone this repository using `git clone https://github.com/FranP-code/Open-Telegram-to-Notion-Bot.git`
2. Host and run the [Open Telegram to Notion Bot website](https://github.com/FranP-code/Open-Telegram-to-Notion-Website) and the [Open Telegram to Notion Bot backend](https://github.com/FranP-code/Open-Telegram-to-Notion-Backend)
3. Make a `.env` file in the root of this project with the following data (don't share it with anyone):
    ```
      BOT_TOKEN_DEV = 1.
      BOT_TOKEN_PROD = 2.
      ENCRYPT_IV = 3.
      ENCRYPT_KEY = 4.
      IMGBB_API_KEY = 5.
      MONGODB_LINK = 6.
      MY_USER_ID = 7.
      NODE_ENV = (development or production)
      NOTION_INTEGRATION_ID = 8.
      WEBSITE_URL = 9.
    ```
    - **1. and 2.** get the Telegram token from [Bot Father](https://telegram.me/BotFather) for your test bot and your production bot
    - **3. and 4.** generate your IV code and your KEY for the [Crypto Module from Node.js](https://www.w3schools.com/nodejs/ref_crypto.asp)
    - **5.** get your API KEY from [ImgBB](https://imgbb.com)
    - **6.** get your MongoDB link, including the password in the link
    - **7.** get your `userId` from Telegram
    - **8.** get your `integrationId` from [Notion](https://www.notion.so/help/add-and-manage-connections-with-the-api)
    - **9.** url where is hosted the your Open Telegram to Notion Bot

4. You have to change the backend url on the website.
  *(i'm gonna modularizate it with the .env another day...)*
5. `npm run start` or `npm run dev` and should work.
<!-- </> with 💛 by readMD (https://readmd.itsvg.in) -->
