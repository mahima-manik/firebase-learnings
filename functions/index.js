import functions, { logger } from "firebase-functions";
import vision from "@google-cloud/vision";

export const readImageDetails = functions.storage.object().onFinalize(async (object) => {
    const imageBucket = `gs://${object.bucket}/${object.name}`;
    logger.log("Reading image uploaded to:", imageBucket);
    
    const client = new vision.ImageAnnotatorClient();
    const [textDetection] = await client.textDetection(imageBucket);
    const [annotation] = textDetection.textAnnotations;
    
    const text = annotation ? annotation.description : "No text found";
    logger.log(`Extracted text from image ${object.name}:`, text);
  });
  