// backend/scripts/seed.ts
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import UserModel from '../src/models/User';
import RestaurantModel from '../src/models/Restaurant';
import MenuItemModel from '../src/models/MenuItem';
import OrderModel from '../src/models/Order';
import ReviewModel from '../src/models/Review';
import dotenv from 'dotenv';

dotenv.config();



async function main() {
  const MONGO_URI = process.env.MONGO_URI as string;
  console.log('🔵 Seeding database...', MONGO_URI);
  await mongoose.connect(MONGO_URI, {
    dbName: 'gercoraunte',          
    serverSelectionTimeoutMS: 5000,  
    socketTimeoutMS: 45000
  });
  console.log('🟢 Connected to MongoDB for seeding');

  // Limpia colecciones
  await Promise.all([
    UserModel.deleteMany({}),
    RestaurantModel.deleteMany({}),
    MenuItemModel.deleteMany({}),
    OrderModel.deleteMany({}),
    ReviewModel.deleteMany({})
  ]);
  console.log('🧹 Cleared existing data');

  // 1) Usuarios
  const users = Array.from({ length: 100 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
    role: faker.helpers.arrayElement(['cliente','admin','repartidor']),
    registrationDate: faker.date.past({ years: 1 })
  }));
  const insertedUsers = await UserModel.insertMany(users);
  console.log(`👤 Inserted ${insertedUsers.length} users`);

  // 2) Restaurantes
  const restaurants = Array.from({ length: 20 }).map(() => ({
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    location: {
      type: 'Point',
      coordinates: [
        faker.location.longitude(),
        faker.location.latitude()
      ]
    },
    specialties: faker.helpers.arrayElements(
      ['italiana','vegana','mexicana','asiática','americana'], 
      faker.number.int({ min: 1, max: 3 })
    ),
    imageIds: []
  }));
  const insertedRests = await RestaurantModel.insertMany(restaurants);
  console.log(`🍴 Inserted ${insertedRests.length} restaurants`);

  // 3) MenuItems
  const menuItems: any[] = [];
  insertedRests.forEach((rest) => {
    for (let i = 0; i < 10; i++) {
      menuItems.push({
        restaurantId: rest._id,
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 200 })),
        category: faker.helpers.arrayElement(['entrada','bebida','postre','plato fuerte']),
        imageId: ''
      });
    }
  });
  const insertedMenu = await MenuItemModel.insertMany(menuItems);
  console.log(`📋 Inserted ${insertedMenu.length} menu items`);

  // 4) Orders en batches de 1000 para 50k
  const BATCH = 1000;
  const TOTAL = 50000;
  console.log('🛒 Seeding orders...');
  for (let i = 0; i < TOTAL / BATCH; i++) {
    const batchOrders: any[] = [];
    for (let j = 0; j < BATCH; j++) {
      const user = faker.helpers.arrayElement(insertedUsers);
      const rest = faker.helpers.arrayElement(insertedRests);
      const itemsCount = faker.number.int({ min: 1, max: 5 });
      const chosenItems = faker.helpers.arrayElements(
        insertedMenu.filter(mi => mi.restaurantId.equals(rest._id)),
        itemsCount
      );
      const items = chosenItems.map((mi: any) => ({
        menuItemId: mi._id,
        quantity: faker.number.int({ min: 1, max: 3 })
      }));
      const total = items.reduce((sum, it) => {
        const price = insertedMenu.find(mi => mi._id.equals(it.menuItemId))!.price;
        return sum + price * it.quantity;
      }, 0);
      batchOrders.push({
        userId: user._id,
        restaurantId: rest._id,
        date: faker.date.recent({ days: 90 }),
        status: faker.helpers.arrayElement(['pending','processing','delivered','cancelled']),
        total,
        items
      });
    }
    await OrderModel.insertMany(batchOrders);
    process.stdout.write(` ${ (i+1)*BATCH }`);
  }
  console.log('\n✅ Inserted 50,000 orders');

  // 5) Reviews (20k)
  const ordersAll = await OrderModel.find().select('_id userId restaurantId');
  const reviews: any[] = [];
  for (let i = 0; i < 20000; i++) {
    const ord = faker.helpers.arrayElement(ordersAll);
    reviews.push({
      userId: ord.userId,
      restaurantId: ord.restaurantId,
      orderId: ord._id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentence(),
      date: faker.date.recent({ days: 60 })
    });
  }
  await ReviewModel.insertMany(reviews);
  console.log(`⭐ Inserted ${reviews.length} reviews`);

  console.log('🎉 Seeding complete!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
