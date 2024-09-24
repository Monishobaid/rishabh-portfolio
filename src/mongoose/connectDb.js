import mongoose from 'mongoose'

const { MONGO_URI } = process.env

if (!MONGO_URI) {
	throw new Error('No connection string available in environment variables');
}

console.log('MongoDB Connection String:', MONGO_URI);

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};

		cached.promise = mongoose.connect(MONGO_URI, opts)
			.then((mongoose) => {
				console.log('Connected to MongoDB');
				return mongoose;
			})
			.catch((error) => {
				console.error('MongoDB connection error:', error.message);
				throw error;
			});
	}

	cached.conn = await cached.promise;
	return cached.conn;
}

export default dbConnect;
