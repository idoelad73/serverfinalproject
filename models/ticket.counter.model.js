import mongoose from "mongoose";

const ticketcounterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    seq: {
        type: Number,
        default: 0
    }
});

export default mongoose.model("TicketCounter", ticketcounterSchema);
