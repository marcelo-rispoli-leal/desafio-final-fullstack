import mongoose from 'mongoose';
import transactionModel from '../models/transactionModel.js';

const db = {};
db.mongoose = mongoose;
db.url = process.env.DB_CONNECTION;
db.transactionModel = transactionModel(mongoose);

export { db };
