// backend/scripts/import-data.ts
import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

import UserModel from "../src/models/User";
import RestaurantModel from "../src/models/Restaurant";
import MenuItemModel from "../src/models/MenuItem";
import OrderModel from "../src/models/Order";
import ReviewModel from "../src/models/Review";

const mappingPath = path.resolve(__dirname, "../data/images/imageMapping.json");
const { restaurants: restIds, menuItems: menuIds }: Record<string, string[]> =
  JSON.parse(fs.readFileSync(mappingPath, "utf-8"));

// Convierte { $date: "..." } → Date, recursivamente
function unwrapDates(obj: any): any {
  if (obj && typeof obj === "object") {
    if (obj.$date && typeof obj.$date === "string") {
      return new Date(obj.$date);
    }
    if (obj.$oid && typeof obj.$oid === "string") {
      return new mongoose.Types.ObjectId(obj.$oid);
    }
    // Recurse para otros campos
    for (const key of Object.keys(obj)) {
      obj[key] = unwrapDates(obj[key]);
    }
  }
  return obj;
}

async function main() {
  const uri = process.env.MONGO_URI as string;
  if (!uri) throw new Error("MONGO_URI no definido");
  await mongoose.connect(uri, { dbName: "gercoraunte" });
  console.log("🟢 Conectado para importación");

  const imports: { file: string; model: mongoose.Model<any> }[] = [
    { file: "gercoraunte.users.json", model: UserModel },
    { file: "gercoraunte.restaurants.json", model: RestaurantModel },
    { file: "gercoraunte.menuitems.json", model: MenuItemModel },
    { file: "gercoraunte.orders.json", model: OrderModel },
    { file: "gercoraunte.reviews.json", model: ReviewModel },
  ];

  for (const { file, model } of imports) {
    const fullPath = path.resolve(__dirname, "../data", file);
    console.log(`\n🔄 Importing ${file} → ${model.collection.name}`);

    // 1) Leer raw
    let docs: any[] = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    console.log("  • Raw sample:", docs[0]);

    // 2) Unwrap dates
    docs = docs.map((d) => unwrapDates(d));
    console.log("  • After unwrapDates:", docs[0]);

    // 3) Eliminar _id para que Mongoose genere uno
    docs = docs.map((d) => {
      const { _id, ...rest } = d;
      return rest;
    });
    console.log("  • After remove _id:", Object.keys(docs[0]));

    // 4) Inject single image IDs
    if (model === RestaurantModel) {
      const imgId = restIds[0];
      docs = docs.map((d) => ({ ...d, imageIds: [imgId] }));
    }
    if (model === MenuItemModel) {
      const imgId = menuIds[0];
      docs = docs.map((d) => ({ ...d, imageId: imgId }));
    }

    // 5) Wipe & insert
    await model.deleteMany({});
    await model.insertMany(docs);
    console.log(
      `✅ Inserted ${docs.length} docs into ${model.collection.name}`
    );
  }

  console.log("\n🎉 Import complete");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
