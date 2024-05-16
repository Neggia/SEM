## Description

[SEM](https://github.com/Neggia/SEM) SEM (Solidarity Economies Marketplace) Application starter repository.

## Installation

```bash
$ npm install
$ cd client
$ npm install
```

## Running the app

.env file in root folder needs the following vars:

```bash
DB_RELATIVE_PATH=data/sqlite.db
ADMIN_PASSWORD=test1234
OPENAI_API_KEY=sk-abc........................................xyz
NODE_ENV=test (or prd)
CORS_ORIGIN=http://localhost:3001
SERVER_PORT=3000
```

.env file in /client subfolder needs the following vars:

```bash
REACT_APP_NAME=Comunità Solidali
REACT_APP_SERVER_BASE_URL=http://localhost:3000/
```

```bash
# server (must run on port 3000)
$ npm run start

# client
$ cd client
$ npm start
```

## Admin panel

Admin can login (with password set in .env file) to panel from homepage widget top-right , where they can set the crawling/parsing parameters:

- When STOP button is pressed, processes/sites are not being processed and previous run information gets cleared.
- When PAUSE button is pressed, processes/sites will be processed at the next scheduled time, based on the last launch and the interval of the parent process, sequentially in the case of related paused sites.
- When PLAY button is shown as pressed (it's set only by the system, refresh the page to update), the process/site is being processed.
- Pressing the SAVE button writes the changes you have made to the related subpanel to the database, to make sure that the changes have been made hit the browser REFRESH button.
- In Task section, "Product structure" and "Pagination structure" are the CSS selectors of the corresponding elements, if ChatGPT can identify them they will be generated automatically, otherwise they can be modified by hand.
- In Promp section, you can see the ChatGPT Prompts used to get Product Structure and Category, HtmlElement Type and Pagination Data (actually these are valid for all websites)

## Having both projects (backend and frontend) run in the background

When `npm run start ` is launched from terminal , if the terminal gets closed , also the npm process terminates , since it is a child process.
Npm needs to be launched in background then. A way to do it that is specific to Node JS , is by using the `pm2` package.

install:
`npm install pm2@latest -g`

scheduling a command: enter the node project directory, and do:
`pm2 --name ExampleProcessName start npm -- start `

verify that it has been scheduled:
`pm2 ls`
![image](https://github.com/Neggia/SEM/assets/148484240/904d9b0e-1ec2-4566-af86-ec111ec466a5)

delete all scheduled processes:
`pm2 delete all`

to delete only a specific process: indicate its id instead of "all". E.g. to cancel the process with id 0 as seen in the screenshot:
`pm2 delete 0`

to read the logs produced by a process:
`pm2 logs 0 --lines 1000`
where 1000 is the number of lines to be printed , from the most recent one, and 0 is the process id

## Support

SEM is an GPL 3-licensed open source project.

## License

SEM is [GPL 3 licensed](LICENSE).
