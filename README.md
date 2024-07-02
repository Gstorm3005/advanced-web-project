# advanced-web-project




## 📋 Description
This repository contains the codebase for our advanced web development project, a distributed software platform designed for the online restaurant industry. Our platform integrates various commercial offers and provides comprehensive services to multiple user profiles.

## :mag: Project Overview
Our platform serves different user profiles:

- **End-Users:** Manage accounts, create and track orders, view order history, and refer friends.
- **Restaurateurs:** Manage accounts, items, menus, validate orders, and track deliveries.
- **Delivery Drivers:** Manage accounts, accept deliveries, sponsor drivers, and receive notifications.
- **Third-Party Developers:** Access and download reusable components.
- **Sales Department:** Manage customer accounts and access real-time order monitoring dashboards.
- **Technical Department:** Add/remove components, consult logs, and monitor server performance.

## ⚙️ Installation and Setup
* In order to get started:
```sh
git clone https://github.com/Gstorm3005/advanced-web-project
```
* Install dependencies for the all backend and frontedn folders along with the auth, gateway and image-service folder:
```sh
npm install
```
* Start them all:
```sh
npm start
```
* Deploy the project on Docker:
Change the branch to docker-test and run this single command (you'll need docker desktop app open) :
```sh
docker-compose up --build
```
Note: Docker will use up to 27 GB of RAM to run these containers at once, so your computer needs at least 32 GB of RAM or you can run containers one by one (not at once).

## Contributors <img src="https://raw.githubusercontent.com/TheDudeThatCode/TheDudeThatCode/master/Assets/Developer.gif" width=35 height=25>
- Afnane Messaoui
- Elrayan Hamhami
- Nadir Zamouche