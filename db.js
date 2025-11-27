import mongoose from 'mongoose';

const mongoDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://samnewversion:SaMnEwVeRsIoN@cluster0.en2dvfg.mongodb.net/fastFood");
    console.log("Connected to MongoDB"); 
    const foodCollection = await mongoose.connection.db.collection("food_Items");
    const data = await foodCollection.find({}).toArray();
    const foodCategory = await mongoose.connection.db.collection("foodCategory");
    const catData = await foodCategory.find({}).toArray();
    global.food_items = data;
    global.foodCategory = catData;
    console.log("got the data");
  } 
  catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

export default mongoDB;

