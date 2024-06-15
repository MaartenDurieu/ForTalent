# Context
Just my code that I wrote for my thesis. Looking back at this it is not great, but it was a first good introduction to front- and backend.
I mainly have it stored for nostalgic reasoning and to have a look back and have a reference of my vast improvements in coding over time.
It also no longer works, as the database setup no longer is functional and requires a UGent mail and ip.

# Project
## Angular installation
1. For angular and node: https://angular.io/guide/setup-local
2. Clone the repository: https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository

## Database
1. Install MySQLWorkbench
2. Install VPN and connect to ugent: https://helpdesk.ugent.be/vpn/en/
3. Connect to the MySQL server with
  - Hostname = ‘ugmarket.ugent.be’
  - port = ‘13306’.
  - your username and password
5. Open the `nodejs_backend/Marketplace_start_data_01_2022.sql` file
6. Put `use databaseName;`before the sql query
7. Run the query
8. Change the credentials `user`, `password`, and `DB` in `nodejs_backend/app/config/db.config.js` via vscode: https://code.visualstudio.com/

## Backend server
Run `node nodejs_backend/app.js` to start the backend server, it will listen for HTTP requests on port 3000 by default.

## Frontend
- one-time: Run `cd angular_frontend;npm install` to install the packages
- Run `cd angular_frontend;ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


