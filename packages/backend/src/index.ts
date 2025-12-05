import express from 'express';
import { Firestore } from '@google-cloud/firestore'; // Import Firestore

const app = express();
const port = 3001;

// Initialize Firestore
const db = new Firestore();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// New endpoint to fetch videos
app.get('/videos', async (req, res) => {
  try {
    const videosRef = db.collection('videos'); // Assuming a 'videos' collection
    const snapshot = await videosRef.get();

    const videos: any[] = [];
    snapshot.forEach(doc => {
      videos.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).send("Error fetching videos");
  }
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
