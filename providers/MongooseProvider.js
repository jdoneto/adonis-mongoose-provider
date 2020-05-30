'use strict'

const { ServiceProvider } = require('@adonisjs/fold')
const mongoose = require('mongoose')

class MongooseProvider extends ServiceProvider {

	register() {
		this.app.singleton('Adonis/Addons/Mongoose', function (app) {
			const Config = app.use('Adonis/Src/Config');
			const mongoHost = Config.get('database.mongodb.connection.host', 'localhost')
			const mongoPort = Config.get('database.mongodb.connection.port', '27017')
			const mongoDb = Config.get('database.mongodb.connection.database', 'adonis')
			const mongoUser = Config.get('database.mongodb.connection.user', '')
			const mongoPass = Config.get('database.mongodb.connection.pass', '')
			const mongoOptions = Config.get('database.mongodb.connection.options', {})
			const mongoUrl = Config.get('database.mongodb.connection.url', `${mongoHost}:${mongoPort}/${mongoDb}`)
			const connectionString = (mongoUser !== '' || mongoPass !== '') ? `mongodb://${mongoUser}:${mongoPass}@${mongoUrl}` : `mongodb://${mongoUrl}`

			mongoose.Promise = global.Promise;
			mongoose.set('useCreateIndex', true);
			mongoose.set('useFindAndModify', false);

			try {
				mongoose.connect(connectionString, mongoOptions).then((conn) => {
					console.log("Database connected");
				});
			} catch (error) {
				if (error.name == 'MongoNetworkError') {
					console.log("MongoNetworkError : ", connectionString);
				}
			}
			return mongoose
		})
	}
}

module.exports = MongooseProvider
