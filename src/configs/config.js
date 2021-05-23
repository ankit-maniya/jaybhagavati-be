import dotenv from "dotenv"
dotenv.config()
const {
  PORT,
  HOST,
  PORT_URL,
  MONGO_URL,
  FILE_STORE_PATH,
  TEMP_FILE_STORE_PATH,
  USER_FILE_STORE_PATH,
  RESTAURENT_FILE_STORE_PATH,
  ADMIN_FILE_STORE_PATH,
  VIEWS_FILES_PATH,
  SALT,
  JWT_SECRET,
  EMAIL_USER,
  EMAIL_PASSWORD,
  FIREBASE_APIKEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_IMAGE_URL
} = process.env

const ADMIN_USER = {
  isActive: true,
  isDelete: false,
  role: "ADMIN",
  mobile: "6359006628",
  name: "Admin",
  email: "admin@admin.com",
  password: "password",
  address: [
    {
      latitude: "72.00525",
      longitude: "21.2025464",
    }
  ],
}

export const config = {
  PORT,
  HOST,
  PORT_URL,
  MONGO_URL,
  FILE_STORE_PATH,
  TEMP_FILE_STORE_PATH,
  USER_FILE_STORE_PATH,
  RESTAURENT_FILE_STORE_PATH,
  ADMIN_FILE_STORE_PATH,
  VIEWS_FILES_PATH,
  SALT,
  JWT_SECRET,
  EMAIL_USER,
  EMAIL_PASSWORD,
  ADMIN_USER,
  FIREBASE_APIKEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_IMAGE_URL
}
