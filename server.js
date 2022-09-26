const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const { CLIENT_RENEG_LIMIT } = require('tls');
const multer = require('multer');
const upload = multer();
const sanitizeHTML = require('sanitize-html');
const fse = require('fs-extra');
const sharp = require('sharp');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const AnimalCard = require('./src/components/AnimalCard').default; //

// make sure the 'public/uploaded-photos exist' when the app fist load
fse.ensureDirSync(path.join('public', 'uploaded-photos')); // to avoid naming difference (e.g. windows use back slash '\')

let db;
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function passwordProtected(req, res, next) {
	res.set('WWW-Authenticate', "Basic realm='Our MERN  App'");
	if (req.headers.authorization == 'Basic cGFzc3dvcmQuOnBhc3N3b3JkLg==') {
		next();
	} else {
		console.log(req.headers.authorization);
		res.status(401).send(
			`<div style="text-align:center; height:100%">
				<h1 style="line-height: 700px">Hint: the password is password.
				</h1>
			</div>`
		);
	}
}

app.get('/', async (req, res) => {
	const allAnimals = await db.collection('animals').find().toArray();
	const generatedHTML = ReactDOMServer.renderToString(
		<div className="container">
			{!allAnimals && <p>There are no animals yet.</p>}
			<div className="animal-grid mb-3">
				{allAnimals.map(animal => (
					<AnimalCard
						key={animal._id}
						name={animal.name}
						species={animal.species}
						photo={animal.photo}
						id={animal._id}
						readOnly={true}
					/>
				))}
			</div>
			<p>
				<a href="/admin">Login to manage the animal listings</a>
			</p>
		</div>
	);
	res.render('home', { generatedHTML });
});

app.use(passwordProtected);

app.get('/admin', (req, res) => {
	res.render('admin');
});

app.get('/api/animals', async (req, res) => {
	const allAnimals = await db.collection('animals').find().toArray();
	res.json(allAnimals);
});

app.post(
	'/create-animal',
	upload.single('photo'),
	cleanup,
	async (req, res) => {
		if (req.file) {
			const photoFileName = `${Date.now()}.jpg`;
			await sharp(req.file.buffer)
				.resize(844, 456)
				.jpeg({ quality: 60 })
				.toFile(path.join('public', 'uploaded-photos', photoFileName));
			req.cleanData.photo = photoFileName;
		}

		const info = await db.collection('animals').insertOne(req.cleanData);
		const newAnimal = await db
			.collection('animals')
			.findOne({ _id: new ObjectId(info.insertedId) });
		res.send(newAnimal);
	}
);

app.delete('/animal/:id', async (req, res) => {
	if (typeof req.params.id != 'string') req.params.id = '';
	const doc = await db
		.collection('animals')
		.findOne({ _id: new ObjectId(req.params.id) });
	if (doc.photo) {
		fse.remove(path.join('public', 'uploaded-photos', doc.photo));
	}
	db.collection('animals').deleteOne({ _id: new ObjectId(req.params.id) });
	res.send('Nice');
});

app.post(
	'/update-animal',
	upload.single('photo'),
	cleanup,
	async (req, res) => {
		if (req.file) {
			// if new photo is uploaded
			const photoFileName = `${Date.now()}.jpg`;
			await sharp(req.file.buffer)
				.resize(844, 456)
				.jpeg({ quality: 60 })
				.toFile(path.join('public', 'uploaded-photos', photoFileName));
			req.cleanData.photo = photoFileName;
			const info = await db
				.collection('animals')
				.findOneAndUpdate(
					{ _id: new ObjectId(req.body._id) },
					{ $set: req.cleanData }
				); // return info of the previous document
			if (info.value.photo) {
				fse.remove(path.join('public', 'uploaded-photos', info.value.photo));
			}
			res.send(photoFileName);
		} else {
			db.collection('animals').findOneAndUpdate(
				{ _id: new ObjectId(req.body._id) },
				{ $set: req.cleanData }
			);
			res.send(false);
		}
	}
);

// clean user input to prevent malicious data
function cleanup(req, res, next) {
	if (typeof req.body.name != 'string') req.body.name = '';
	if (typeof req.body.species != 'string') req.body.species = '';
	if (typeof req.body._id != 'string') req.body._id = '';

	// add an object "cleanData" to the req object
	req.cleanData = {
		name: sanitizeHTML(req.body.name.trim(), {
			allowedTags: [],
			allowedAttributes: {},
		}),
		species: sanitizeHTML(req.body.species.trim(), {
			allowedTags: [],
			allowedAttributes: {},
		}),
	};

	next();
}

async function start() {
	const client = new MongoClient(
		'mongodb://root:root@localhost:27017/AmazingMernApp?&authSource=admin'
	);
	await client.connect();
	db = client.db();
}
start();

app.listen(3000);