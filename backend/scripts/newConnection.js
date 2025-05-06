require('dotenv').config();
const mongoose = require('mongoose');
const { MongoClient, ObjectId } = require('mongodb');

// Configuración
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your_database';

async function reasignRestaurantIds() {
  try {
    // Conectar a MongoDB directamente para operaciones más rápidas
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db();
    const restaurantsCollection = db.collection('restaurants');
    const menuItemsCollection = db.collection('menuitems');
    
    // Paso 1: Obtener todos los IDs de restaurantes
    const restaurantsResult = await restaurantsCollection.find({}, { projection: { _id: 1 } }).toArray();
    const restaurantIds = restaurantsResult.map(r => r._id);
    
    if (restaurantIds.length === 0) {
      console.error('Error: No hay restaurantes en la base de datos');
      await client.close();
      return;
    }
    
    console.log(`Encontrados ${restaurantIds.length} restaurantes para reasignación`);
    
    // Paso 2: Actualizar todos los menuItems
    const menuItems = await menuItemsCollection.find().toArray();
    let updated = 0;
    
    for (const item of menuItems) {
      // Seleccionar restaurantId aleatorio
      const randomIndex = Math.floor(Math.random() * restaurantIds.length);
      const randomRestaurantId = restaurantIds[randomIndex];
      
      await menuItemsCollection.updateOne(
        { _id: item._id },
        { $set: { restaurantId: randomRestaurantId } }
      );
      
      updated++;
      if (updated % 100 === 0) {
        console.log(`Actualizados ${updated}/${menuItems.length} ítems...`);
      }
    }
    
    console.log(`Actualizados ${updated} ítems de menú con restaurantes aleatorios`);
    
    // Paso 3: Verificación
    console.log("Distribución de menús por restaurante:");
    for (const id of restaurantIds) {
      const count = await menuItemsCollection.countDocuments({ restaurantId: id });
      const restaurant = await restaurantsCollection.findOne({ _id: id }, { projection: { name: 1 } });
      console.log(`- ${restaurant?.name || 'Desconocido'} (${id}): ${count} ítems`);
    }
    
    await client.close();
    console.log('Conexión cerrada');
    
  } catch (error) {
    console.error('Error durante la reasignación:', error);
  }
}

reasignRestaurantIds();