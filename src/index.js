import React, { useState, useEffect, useReducer } from 'react';
import { createRoot } from 'react-dom/client';
import Axios from 'axios';
import CreateNewForm from './components/CreateNewForm';
import AnimalCard from './components/AnimalCard';
import { googleSignIn, googleSignOut } from './components/FirebaseInit';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
	const [animals, setAnimals] = useState([]);
	const [signedIn, setSignedIn] = useState(false);

	useEffect(() => {
		async function go() {
			const response = await Axios.get('/api/animals');
			setAnimals(response.data);
		}
		go();
	}, []); // empty array: only run at the first time when App() renders

	// const auth = getAuth();
	// onAuthStateChanged(auth, user => {
	// 	if (user) {
	// 		console.log(signedIn);
	// 	} else {
	// 		setSignedIn(!signedIn);
	// 		console.log(signedIn);
	// 	}
	// });

	return (
		<div className="container">
			{!signedIn ? (
				<div>
					<div
						style={{
							display: 'inline-block',
							height: '100%',
							verticalAlign: 'middle',
						}}
					>
						<center>
							<button
								onClick={() => {
									googleSignIn(setSignedIn);
								}}
							>
								Sign in
							</button>
						</center>
					</div>
					<div>
						<center>
							<h1>
								<a href="/">Go back to homepage</a>
							</h1>
						</center>
					</div>
				</div>
			) : (
				<div>
					<button
						onClick={() => {
							googleSignOut(setSignedIn);
						}}
					>
						Sign Out
					</button>
					<p>
						<a href="./">&laquo; Back to public homepage.</a>
					</p>

					<CreateNewForm setAnimals={setAnimals} />

					<div className="animal-grid">
						{animals.map(function (animal) {
							return (
								<AnimalCard
									key={animal._id}
									name={animal.name}
									species={animal.species}
									photo={animal.photo}
									id={animal._id}
									setAnimals={setAnimals}
								/>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}

const root = createRoot(document.querySelector('#app'));
root.render(<App />);
