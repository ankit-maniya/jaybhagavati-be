
import { Pool } from 'pg'
import mongoose from "mongoose"
import firebaseAdmin from "firebase-admin"
import { config } from "../configs/config"
import User from "./User"
import UserActivity from "./UserActivity"
import Party from "./Party"
import CuttingType from "./CuttingType"
import Loat from "./Loat"
import Bill from "./Bill"
import Balance from "./Balance"
import FirebaseModel from './FirebaseSettings'

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

  const firebaseServiceAccount = await FirebaseModel.findOne({ type: "service_account" });
  console.log("called :: firebase", firebaseServiceAccount);

  let firebaseConfigs = {};
  let firebase_storage_bucket = config.FIREBASE_STORAGE_BUCKET;
  // const findFirebaseSettings = await 
  if(firebaseServiceAccount) {
    Object.keys(firebaseServiceAccount).map((key) => {
      if(!["firebaseImageUrl", "storageBucket"].includes(key)){
        firebaseConfigs[key] = firebaseServiceAccount[key];
      }
    });

    firebase_storage_bucket = firebaseServiceAccount.storageBucket;
  }

  // check if firebase already initialize or not
  if (firebaseAdmin.apps.length === 0 && firebaseConfigs) {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(firebaseConfigs),
      storageBucket: firebase_storage_bucket
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
  UserActivity,
  FirebaseModel
}
