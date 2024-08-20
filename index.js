require('dotenv').config();

const firebase = require('firebase/app')
const firebaseStorage = require('firebase/storage')

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const appFirebase = firebase.initializeApp(firebaseConfig)
const storage = firebaseStorage.getStorage(appFirebase)

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello world'
  });
});

app.post('/test', (req, res) => {
  const { id } = req.body;

  res.json({
    message: 'POST',
    test: id
  });
});

app.post('/', async (req, res) => {
  const { image } = req.body;

  try {
    const response = await fetch(image, {
      method: 'GET',
    });
    const blob = await response.blob()
    const file = new File([blob], `${new Date().getTime()}.jpg`, { type: 'image/jpeg' })
    const storageRef = firebaseStorage.ref(storage, `images/${file.name}`)
    await firebaseStorage.uploadBytes(storageRef, file)
    const imageUrl = await firebaseStorage.getDownloadURL(storageRef)

    res.json({ imageUrl })

  } catch (error) {
    console.log(error);
  }
});

// app.listen(4000, () => {
//   console.log('Server is running on port 4000');
// })

module.exports = app;
