import mongoose from "mongoose";

const { Schema } = mongoose;

const SingleOrderSchema = new Schema({
  order_date: {
    type: String,
    required: true
  },
  order_items: {
    type: Array,   // your cart items array
    required: true
  },
  address: {
    name: String,
    phone: String,
    house: String,
    street: String,
    city: String,
    pincode: String,
    
  }
});

const OrderSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },

    // 👇 all past orders stored here
    orders: [SingleOrderSchema]
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;

