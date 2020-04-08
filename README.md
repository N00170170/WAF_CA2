<p align="center"><img src="https://miro.medium.com/max/984/1*IHI90aWzUnrcfHDuh08YTg.png" width="400"></p>

# Vue.js / Laravel College Web Application

This application allows a user to view and manipulate data about courses, lecturers and enrolments at a college. This data is provided by a Laravel REST API and the application consumes this data.

The application demonstrates the ability to design, implement and test a web application using industry standard application frameworks.

The application is written in Vue.js with BootstrapVue as a CSS framework.

## Installation Instructions

Follow these steps to install the application:

- Create a db in PhpMyAdmin
- Duplicate '.env.example' and name it '.env'
- Open .env and set the DB_DATABASE to the db you created

Then cd into the application folder and run the following in your terminal (Git Bash)

- `composer install`
- `npm install`
- `php artisan migrate --seed`
- `php artisan key:generate`
- `php artisan passport:install`

Start the development server
-  `php artisan serve`

Compile the frontend in a new terminal
- `npm run watch`

## Live Demo
A live demo of this application can be found here - http://wafca2.clovux.net/