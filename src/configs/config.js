import fs from 'fs';
import YAML from 'yaml';

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
  FIREBASE_PROJECT_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_IMAGE_URL,
  TESTING_FROM_CANADA
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

// const swaggerCommonPath = new URL('../../swaggerCommonDoc.yaml', import.meta.url).pathname
// const swaggerCommonYaml = fs.readFileSync(swaggerCommonPath, 'utf8');
// const swaggerCommon = YAML.parse(swaggerCommonYaml);

// const SWAGGER_OPTIONS = {
//   failOnErrors: true,
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: "Jaybhagavati Diamond API",
//       version: "0.1.0",
//       description:
//         "This App is documented with Swagger",
//       license: {
//         name: "MIT",
//         url: "https://spdx.org/licenses/MIT.html",
//       },
//       contact: {
//         name: "Ankit Maniya",
//         email: "ankit.maniya6588@gmail.com",
//       },
//     },
//     servers: [
//       {
//         url: PORT_URL,
//       },
//     ],
//     ...swaggerCommon,  // Merge with common definition
//   },
//   apis: ['./src/routes/*.js'],
// };

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
  FIREBASE_PROJECT_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_STORAGE_BUCKET,
  TESTING_FROM_CANADA,
  FIREBASE_IMAGE_URL,
  // SWAGGER_OPTIONS
}
