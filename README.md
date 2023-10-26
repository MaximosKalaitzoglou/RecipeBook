# RecipeBook - Your Recipe Sharing Platform (Portfolio Project)

## Table of Contents

1. [Introduction](#introduction)
2. [Project Features](#project-features)
3. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Configuration Setup](#configuration-setup)
4. [Technologies Used](#technologies-used)



## Introduction

RecipeBook is a web-based platform where users can share and discover recipes. It is built using Angular for the frontend, .NET Web API for the backend, and MariaDB for the database. The project includes features like user authentication with JWT, recipe management, liking/commenting on recipes, and real-time messaging capabilities through SignalR.(coming-soon)

## Project Features

- **User Authentication**: Register and log in securely using JWT authorization and authentication.

- **Recipe Management**: Perform CRUD operations on recipes, including creation, updating, and deletion, with the ability to upload photos for recipes.

- **Like and Comment**: Users can like and comment on recipes, promoting user interaction and engagement.

- **User Messaging**: Send and receive messages to other users, facilitating private conversations and communication.

- **Real-Time Messaging (Coming Soon)**: Real-time messaging functionality using SignalR is currently in development and will be added soon to provide instant message delivery.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Angular CLI](https://angular.io/guide/setup-local) (for the frontend)
- [Visual Studio Code](https://code.visualstudio.com/download)
- [.NET SDK](https://dotnet.microsoft.com/download/dotnet) - RecipeBook uses the .NET SDK for building and running the backend server. You can download and install it from the official .NET website.


### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/RecipeBook.git

2. Create and start the Docker container for MariaDB:
   ```bash
   docker-compose up -d

3. Set up the Angular frontend:
   ```bash
   cd client
   npm install
   ng serve

4. Set up the .NET Web API backend:
   ```bash
   cd API
   dotnet build
   dotnet run 
5. Access the application in your browser at http://localhost:4200.

### Configuration Setup

Before running the API, you need to set up your `appsettings.json` configuration file to include your Cloudinary API credentials and other configuration options. Here's how you can do it:

1. **Open the API Project**: Navigate to the API project directory:

   ```bash
   cd API
2. **Add Cloudinary Configuration**
  ```bash
  "Cloudinary": {
    "CloudName": "your_cloud_name",
    "ApiKey": "your_api_key",
    "ApiSecret": "your_api_secret"
  }
```
Replace "your_cloud_name", "your_api_key", and "your_api_secret" with your actual Cloudinary credentials.

### Don't Have a Cloudinary Account?

If you don't have a Cloudinary account yet, you can easily sign up for one for free. Cloudinary provides cloud-based media management services, including image and video storage, transformations, and delivery. Here's how to get started:

1. **Visit the Cloudinary Website**: Go to the [Cloudinary website](https://cloudinary.com/).

2. **Sign Up**: Click on the "Sign Up" or "Get Started for Free" button.

3. **Create an Account**: Fill in the required information to create your Cloudinary account.
   
4. **Access Your Cloudinary Dashboard**: Once your account is set up and verified, you can log in to your Cloudinary dashboard.

5. **Get Your API Credentials**: In your Cloudinary dashboard, you can find your Cloudinary API key, API secret, and cloud name. You will need these credentials to set up the `appsettings.json` file for the RecipeBook API.


## Technologies Used

This project uses a variety of technologies and libraries to provide better user experience and functionality:

- **Angular**: RecipeBook's frontend is built using Angular, a popular and robust JavaScript framework that provides a responsive and dynamic user interface.

- **Bootstrap and Bootswatch**: RecipeBook utilizes Bootstrap, a front-end framework, along with Bootswatch themes to ensure a sleek and visually appealing design. These tools contribute to the platform's overall aesthetics and user-friendly interface.

- **ngx-bootstrap**: ngx-bootstrap is an essential part of the project, offering Angular implementations of Bootstrap components. It helps ensure consistent and interactive UI elements in RecipeBook.

- **ng2-file-upload**: This library simplifies file uploads, including photo uploads for recipes. Users can easily add images to their recipes, enhancing the visual appeal of the platform.

- **Cloudinary**: RecipeBook integrates Cloudinary, a cloud-based media management service, to store, transform, and deliver images and media files. Cloudinary plays a pivotal role in managing photos and media within the application.

- **ngx-infinite-scroll**: ngx-infinite-scroll is used to enable seamless and efficient infinite scrolling for pagination. Users can navigate through extensive lists, like the messaging user list, with ease and efficiency.

With the help of these technologies you can finally explore the Cook side of you!