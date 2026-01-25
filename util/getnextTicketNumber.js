import TicketCounter from "../models/ticket.counter.model.js"

async function getNextTicketNumber() {
    try {
        const counter = await TicketCounter.findOneAndUpdate(
            { name: "ticket" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        return "T" + counter.seq.toString().padStart(5, "0");
    } catch (error) {
        console.error("Error getting next order number:", error);
        throw error;
    }
  
}


export default getNextTicketNumber;
