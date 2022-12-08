
import { Pool } from 'pg'
import mongoose from "mongoose"
import firebaseAdmin from "firebase-admin"
import { config } from "../configs/config"
import serviceAccount from "../configs/firebaseServiceAccountKey.json"
import User from "./User"
import UserActivity from "./UserActivity"
import Party from "./Party"
import CuttingType from "./CuttingType"
import Loat from "./Loat"
import Bill from "./Bill"
import Balance from "./Balance"

const connectDB = async () => {
  // Define Globally Connection
  // global.pgConnect = new Pool();
  // pgConnect.connect();

  return await mongoose.connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
}

// firebase connect for image store
const initializeFirebase = async () => {

  // check if firebase already initialize or not
  if (firebaseAdmin.apps.length === 0) {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      storageBucket: config.FIREBASE_STORAGE_BUCKET
    });
  }

  // Get a reference to the storage service, which is used to create references in your storage bucket
  return firebaseAdmin.storage().bucket();
}

export { connectDB, initializeFirebase }
export const model = {
  User,
  Party,
  CuttingType,
  Loat,
  Bill,
  Balance,
  UserActivity
}
