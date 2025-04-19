import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
// import { getStorage } from "firebase-admin/storage";
import "server-only";

if(!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error("FIREBASE_PRIVATE_KEY is not defined in .env.local file")
}

const decodedKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY, "base64").toString("utf-8")

export const firebaseCert = cert({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: decodedKey
})

//?.replace(/\\n/g, "\n"),

if(!getApps().length){
  initializeApp({
    credential: firebaseCert,
    // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  })
}
// esse if evita que o firebase seja inicializado mais de uma vez, o que causaria erro
// no servidor, já que o firebase não suporta múltiplas instâncias

export const db = getFirestore()
// export const storage = getStorage().bucket()

