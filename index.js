const express = require('express')
const app = express()
const port = process.eventNames.PORT || 3000

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const ObjectID = mongodb.ObjectID

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded())

let database = {}

app.set('view engine', 'ejs')
app.use(express.static('public'))


const insert = (db, collectionName, doc) => {
	return new Promise ((resolve,reject) => {
		const  collection = db.collection(collectionName)
		collection.insert(doc, (err,result) => {
			if(err){
				reject(err)
			}else{
				resolve(result)
			}
		})
	})
}


const find = (db, collectionName, filter) => {
	return new Promise ((resolve,reject) => {
		const  collection = db.collection(collectionName)
		const cursor = collection.find(filter)
		const results = []
		cursor.forEach( doc => results.push(doc),
			err => {
			if(err){
				reject(err)
			}else{
				resolve(results)
			}
		})
	})
}

const deleteOne = (db, collectionName, filter) => {
	return new Promise ((resolve,reject) => {
		const  collection = db.collection(collectionName)
		collection.deleteOne(filter, (err,results) => {
			if(err){
				reject(err)
			}else{
				resolve(results)
			}
		})
	})
}

app.get('/', (req,res) => res.render('index'))

app.get('/restaurantes', async(req,res) => {
	const restaurantes = await find(database, 'restaurantes', {})
	res.render('restaurantes', { restaurantes })
})

app.get('/restaurantes/novo', (req,res) => {
	res.render('restaurante_novo')
})

app.get('/restaurantes/delete/:id', async(req,res) => {
	await deleteOne(database, 'restaurantes', {
	_id: ObjectID(req.params.id)
})
res.redirect('/restaurantes')
})

app.post('/restaurantes/novo', async(req,res) => {
	const restaurante = {
		nome: req.body.nome,
		loc:{
			type: 'Point',
			coordinates: [ parseFloat(req.body.lng), parseFloat(req.body.lat)]
		}
	}
	console.log(req.body)
	await insert(database, 'restaurantes', restaurante)
	res.redirect('/restaurantes')
})

MongoClient.connect('mongodb://localhost:27017/tanamesa', (err,db) => {
	database = db
	app.listen(port, () => console.log('Ta na mesa server running'))
})