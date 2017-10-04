function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const express = require('express');
const app = express();
const port = process.eventNames.PORT || 3000;

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const ObjectID = mongodb.ObjectID;

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded());

let database = {};

app.set('view engine', 'ejs');
app.use(express.static('public'));

const insert = (db, collectionName, doc) => {
	return new Promise((resolve, reject) => {
		const collection = db.collection(collectionName);
		collection.insert(doc, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};

const find = (db, collectionName, filter) => {
	return new Promise((resolve, reject) => {
		const collection = db.collection(collectionName);
		const cursor = collection.find(filter);
		const results = [];
		cursor.forEach(doc => results.push(doc), err => {
			if (err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	});
};

const deleteOne = (db, collectionName, filter) => {
	return new Promise((resolve, reject) => {
		const collection = db.collection(collectionName);
		collection.deleteOne(filter, (err, results) => {
			if (err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	});
};

app.get('/', (req, res) => res.render('index'));

app.get('/restaurantes', (() => {
	var _ref = _asyncToGenerator(function* (req, res) {
		const restaurantes = yield find(database, 'restaurantes', {});
		res.render('restaurantes', { restaurantes });
	});

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
})());

app.get('/restaurantes/novo', (req, res) => {
	res.render('restaurante_novo');
});

app.get('/restaurantes/delete/:id', (() => {
	var _ref2 = _asyncToGenerator(function* (req, res) {
		yield deleteOne(database, 'restaurantes', {
			_id: ObjectID(req.params.id)
		});
		res.redirect('/restaurantes');
	});

	return function (_x3, _x4) {
		return _ref2.apply(this, arguments);
	};
})());

// Pegar distancia entre localização do cliente e dos restaurantes
app.get('/restaurantes/distancia', (req, res) => {
	const { lat, lng } = req.query;
	if (!lat || !lng) {
		res.render('restaurante_distancia_map');
	} else {
		database.command({
			geoNear: 'restaurantes',
			near: [parseFloat(lng), parseFloat(lat)],
			spherical: true,
			// para pegar em metros
			distanceMultiplier: 6378.1
		}, (err, results) => {
			console.log(err, results);
			res.render('restaurante_distancia', { results, lat, lng });
		});
	}
});

app.get('/api/restaurantes/distancia', (req, res) => {
	const { lat, lng } = req.query;
	if (!lat || !lng) {
		res.send([]);
	} else {
		database.command({
			geoNear: 'restaurantes',
			near: [parseFloat(lng), parseFloat(lat)],
			spherical: true,
			// para pegar em metros
			distanceMultiplier: 6378.1
		}, (err, results) => {
			const positions = results.results.map(r => {
				return {
					dis: r.obj.nome,
					lat: r.obj.loc.coordinates[1],
					lng: r.obj.loc.coordinates[0],
					dis: r.dis
				};
			});
			res.send(postiions);
		});
	}
});

app.post('/restaurantes/novo', (() => {
	var _ref3 = _asyncToGenerator(function* (req, res) {
		const restaurante = {
			nome: req.body.nome,
			loc: {
				type: 'Point',
				coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
			}
		};
		console.log(req.body);
		yield insert(database, 'restaurantes', restaurante);
		res.redirect('/restaurantes');
	});

	return function (_x5, _x6) {
		return _ref3.apply(this, arguments);
	};
})());

// MongoClient.connect('mongodb://localhost:27017/tanamesa', (err,db) => {

const url = process.env.MONGOLAB_URI;

MongoClient.connect(url, (err, db) => {
	if (err) {
		console.log('Erro ao conectar ao mongodb');
	} else {
		database = db;

		const restaurantes = db.collection('restaurantes');
		restaurantes.createIndex({ loc: '2dsphere' });

		app.listen(port, () => console.log('Ta na mesa server running'));
	}
});

// "start": "./node_modules/.bin/babel-node index.js",
//# sourceMappingURL=index.js.map