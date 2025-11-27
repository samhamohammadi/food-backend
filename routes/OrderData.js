import express from "express";
const router = express.Router();
import Order from "../models/Orders.js";

// Place a new order
router.post('/orderData', async (req, res) => {
    try {
        const { email, order_data, order_date, address } = req.body;

        // NEW order object
        const newOrder = {
            order_date: order_date,
            order_items: order_data,
            address: address   // <-- address saved inside THIS order ONLY
        };

        let existingOrder = await Order.findOne({ email });

        if (!existingOrder) {
            // First time order
            await Order.create({
                email: email,
                orders: [newOrder]
            });

            return res.json({ success: true, message: "Order created successfully" });
        }

        // Push new order into orders array
        existingOrder.orders.push(newOrder);
        await existingOrder.save();

        return res.json({ success: true, message: "Order added successfully" });

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error: " + error.message);
    }
});


// Fetch orders for a user
router.post('/myorderData', async (req, res) => {
    try {
        let myData = await Order.findOne({ email: req.body.email });

        res.json({ orders: myData ? myData.orders : [] });

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error: " + error.message);
    }
});


export default router;
