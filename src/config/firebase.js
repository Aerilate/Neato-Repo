import firebase from 'firebase';


var firebaseConfig = {
    apiKey: "AIzaSyBlUDs5yyPgYd2PW3poAQdfb2XgOGQR80A",
    authDomain: "neato-repo.firebaseapp.com",
    databaseURL: "https://neato-repo.firebaseio.com",
    projectId: "neato-repo",
    storageBucket: "neato-repo.appspot.com",
    messagingSenderId: "830931166382",
    appId: "1:830931166382:web:4542588f41a8b5507c793f"
};

const fire = firebase.initializeApp(firebaseConfig);

export default fire;