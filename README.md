# Neato Repo
- [Description](#description)
- [Features](#features)
- [Instructions](#instructions)
- [Design](#design)

## Description
Neato Repo is an image repository where users can upload files to a remote AWS S3 storage container. User login and sign-up is handled with Firebase Authentication. Once users are logged in, they can upload images from their computer. These uploaded images show up in the Personal Images section and are private by default. The user can choose to set permissions on individual images to public, which makes the image also show up in the Public Images section. Image permissions are saved with MongoDB. The user may also delete their images at any time. Users can only modify their own files.\
&nbsp;

## Features
- User signup/login with Firebase
- Image uploads/deletions to remote AWS S3 container
- Configurable image permission settings (public or private)\
&nbsp;

## Instructions
Users can signup/login with their username and password through a sidebar on the home page:

![Login Page](/screenshots/Home.png)\
&nbsp;

Users can select an image from their PC to upload. The logged-in user's images are shown in the Personal Images section and are private by default:

![Personal Images](/screenshots/PersonalImages.png)\
&nbsp;

The logged-in user can set an image permission to public:

![Public Images](/screenshots/PublicImages.png)\
&nbsp;

Public images can be seen from any other account:

![Another Account](/screenshots/AnotherAccount.png)\
&nbsp;

## Design
The app is composed of four main components:
- Frontend website, built with React and Axios
- Firebase, for authentication
- Backend server, built with Node and Express
- MongoDB, for saving image permissions

A NoSQL DB was picked because I wanted this project's features to be easily changed and extended. Therefore, I didn't want to commit to a particular DB schema for this project and naturally NoSQL allows more flexibility than SQL in this aspect.

![Design](/screenshots/Design.png)
