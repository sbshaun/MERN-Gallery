import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signOut,
	signInWithPopup,
	GoogleAuthProvider,
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
	// TODO: move to .env file
	apiKey: 'AIzaSyDaBvUFQFYFSTx1VlmKAKxytffnmbAO2tw',
	authDomain: 'mern-gallery.firebaseapp.com',
	projectId: 'mern-gallery',
	storageBucket: 'mern-gallery.appspot.com',
	messagingSenderId: '263208580463',
	appId: '1:263208580463:web:ed4ae3c0d5a850a4a4649a',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

export const googleSignIn = setSignedIn => {
	signInWithPopup(auth, provider)
		.then(result => {
			setSignedIn(true);
			alert('Signed in successfully');
		})
		.catch(error => {
			alert('Error ocurred when signing in');
			console.log(error);
		});
};

export const googleSignOut = setSignedIn => {
	signOut(auth)
		.then(() => {
			setSignedIn(false);
			alert('Signed out successfully');
		})
		.catch(error => {
			alert('Error ocurred when signing out');
		});
};
