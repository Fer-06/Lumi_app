import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { GoogleGenAI } from '@google/genai';

// Inicializa el cliente de Gemini
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

// 1. Inicializa Firebase Admin SDK
initializeApp({
  credential: cert('./serviceAccountKey.json')
});

const db = getFirestore();

// 2. Escucha nuevos mensajes en la colección de Firestore
db.collection('mensajes').onSnapshot((snapshot) => {
  snapshot.docChanges().forEach(async (change) => {
    if (change.type === 'added') {
      const docData = change.doc.data();

      if (docData.sender === 'usuario' && !docData.procesado) {
        await change.doc.ref.update({ procesado: true });

        try {
          console.log(`Procesando prompt: "${docData.texto}"...`);

          const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: docData.texto,
            config: {
              systemInstruction: 'Eres un asistente virtual útil, conciso y amable.'
            }
          });

          await db.collection('mensajes').add({
            texto: response.text,
            sender: 'asistente',
            createdAt: new Date(),
            replyTo: change.doc.id
          });

          console.log('Respuesta guardada con éxito en Firestore.');

        } catch (error) {
          console.error('Error al generar respuesta de IA:', error);
        }
      }
    }
  });
});