import mongoose from "mongoose"

const FirebaseSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    project_id: {
        type: String,
        required: true,
    },
    private_key_id: {
        type: String,
        required: true,
    },
    private_key: {
        type: String,
        required: true,
    },
    client_email: {
        type: String,
        required: true,
    },
    client_id: {
        type: String,
        required: true,
    },
    auth_uri: {
        type: String,
        required: true,
    },
    token_uri: {
        type: String,
        required: true,
    },
    auth_provider_x509_cert_url: {
        type: String,
        required: true,
    },
    client_x509_cert_url: {
        type: String,
        required: true,
    },
    storageBucket: {
        type: String,
        required: true,
    },
    universe_domain: {
        type: String,
        required: true,
    },
    firebaseImageUrl: {
        type: String,
        required: true,
    },
  },
  { timestamps: true, strict: false }
)

const FirebaseModel = mongoose.model("FirebaseSettings", FirebaseSchema)
export default FirebaseModel
