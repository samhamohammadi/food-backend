import express from "express"
const router = express.Router();

router.post("/foodData",async(req ,res)=>{
    try {
        res.send([global.food_items,global.foodCategory]) 
    } catch (error) {
       console.error(error.message);
       res.send("Server Error");
    }
})

export default router