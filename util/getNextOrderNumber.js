import OrderCounter from "../models/order.counter.model.js";

async function getNextOrderNumber() {
    try {
        const counter = await OrderCounter.findOneAndUpdate(
            { name: "order" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        return "O" + counter.seq.toString().padStart(5, "0");
    } catch (error) {
        console.error("Error getting next order number:", error);
        throw error;
    }
  
}


export default getNextOrderNumber;
