# Neato Repo

Neato Repo is an image repository where users can upload files to a remote AWS S3 storage container. User login and sign-up is handled with Firebase Authentication. Once users are logged in, they can upload images from their computer. These uploaded images show up in the Personal Photos section and are private by default. The user can choose to set permissions on individual images to public, which makes the image also show up in the Public Photos section. Image permissions are saved with MongoDB. The user may also delete their images at any time. Users can only modify their own files.

## Requests are made in src/Dashboard.js with Axios and received in server/index.js with Express.
