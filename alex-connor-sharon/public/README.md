## Overview
<!-- Provide a high level overview of what this application is and why you are building it, beyond the fact that it’s an assignment for a Code Fellows 301 class. (i.e. What’s your problem domain?) -->

We are building a blog that can add articles that can be filtered by author and category.  It also has a navbar which uses SPA design and an Admin Page which posts blog stats. It requests articles from a database and renders new changes as they are made. 
## Getting Started
<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->
1. Fork and clone the repo
2. Initialize npm in root folder
  'npm init'
  'npm install express --save'
3. Run 'node server.js'
  'npm install'
  'npm install pg --save'
3. Run 'nodemon server.js'
4. Make sure postgres is running with user and password to add to the conString in server.js
## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you’re using, and any other relevant design information. -->
Languages: JS, CSS/HTML
Platform: Node.js
Frameworks: Express.js
Database: Postgresql
Templating: Handlebars.js
Libraries: jQuery, Marked.js, Highlight.js
Strategies: AJAX, SMACSS
## Change Log
<!-- Use this are to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here’s an examples: -->
08-01-18 8:10am - Initial commit with copied folder from starter
08-01-18 8:15am - Installed dependencies and completed review of existing code base
08-01-18 8:55am - Connect article module to app object
08-01-18 10:30am - Add word count for all articles
08-01-18 11:00am - Create array of unique authorss 
08-02-18 11:45am - Stats for admin page render and Handlebar template in admin.html
08-02-18 12:00pm - Add Readme
 ## Credits and Collaborations
<!-- Give credit (and a link) to other people or resources that helped you build this application. --> Alex Hanson, Connor Crossley and Sharon Miller