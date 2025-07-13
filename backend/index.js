import vision from '@google-cloud/vision';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Creates a client
const client = new vision.ImageAnnotatorClient();

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
const fileName = './sample.jpg';

// Performs text detection on the local file
const [result] = await client.textDetection(fileName);
const detections = result.textAnnotations;
const detectionDescription = detections[0].description;
console.log('Text:');
// detections.forEach(text => console.log(text));
console.log(detectionDescription);

// Get access token for Google Keep API
const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/keep']
});
const accessToken = await auth.getAccessToken();

if (!accessToken) {
  console.error('Failed to get access token. Make sure you have proper credentials set up.');
  process.exit(1);
}

const note = {
  title: 'July 13, 2025 10:48 AM',
  body: {
    content: [
      {
        text: {
          text: detectionDescription
        }
      }
    ]
  }
};

const response = await fetch('https://keep.googleapis.com/v1/notes', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(note),
});

const data = await response.json();
console.log('Note created:', data);