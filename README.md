# get-a-watch-bot
A bot designed to get around pesky timezones and timestamps for Discord.

## As Discord denied this bot, there is the option to self host it. 
I recommend [pm2](https://www.npmjs.com/package/pm2) if you're self hosting it, but be sure to set the system clock as [UTC](https://time.is/UTC) on your host machine.
To get started:
- Run `npm i` in the main directory
- cp .env.example .env
- Create a [developer application](https://discord.com/developers/applications) on discord
- Go to the OAuth2 section > General. Set Default authorization to in-app. Give it the scopes of Bot and applications.commands, and the permissions of Send Messages, Embed Files, Embed Links, and Use Slash Commands 
- Copy the Client ID on the same page to the .env file
- Go to the bot section and add a bot with any username and icon
- Press "reset token", copy it, and add it to the .env file.
- Run `npx tsc` to compile into JS
- `node dist/deploy-commands.js` will add the commands to the bot
- `pm2 start node/index.js` will start the bot.

## Commands
- **/timezone** - Sets your timezone in the database for others to view & for default timezones when creating a timestamp
    - `timezone`  - Sets your timezone based on the autofill options
- **/time** - View other users’ times (one parameter required)
    - `time` - View your own time
    - `@user` - View another user’s time (if they have set it)
- **/timestamp** - Create a timestamp for a message (time, date, and format are required)
    - `time`: The time of the message (in 24-hour or 12-hour format)
    - `date`: The date of the message (01-31)
    - `format`: The format of the timestamp (see below)
    - `month`: The month (default is current month)
    - `year`: The year (default is current year)
    - `timezone`: A specified timezone you would like the timestamp converted in (default is your set timezone)
    - `public`: Ephemeral or not, useful for creating timestamps without others seeing it

