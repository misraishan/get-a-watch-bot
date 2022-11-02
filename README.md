# get-a-watch-bot
A bot designed to get around pesky timezones and timestamps for Discord.

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

