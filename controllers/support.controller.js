
import { supportTicketNotificationTemplate } from '../templets/email.template.js'
import SupportTickets from '../models/SupportTicket.model.js'
import getNextTicketNumber from'../util/getnextTicketNumber.js'


const sendSupportEmail = async (req, res) => {
    try {
      const { name, user_email, subject, category, message } = req.body;
  
      if (!user_email || !message) {
        return res.status(400).json({ message: "Email and message are required" });
      }
  
      // Construct the ticket object
      const ticket = {
        ticketNumber: Math.floor(Math.random() * 100000), // just an example
        subject,
        category,
        message,
        priority: "medium",
        createdAt: new Date(),
      };
  
      const user = { name, user_email };
  
      // Send the email
      await supportTicketNotificationTemplate(user, ticket);
  
      console.log("Support ticket received:", { name, user_email, subject, category, message });
  
      res.status(200).json({
        success: true,
        message: "Email sent successfully"
      });
  
    } catch (error) {
      console.error("❌ Support Email Error:", error);
      res.status(500).json({
        message: "Failed to send email",
        error: error.message
      });
    }
  };
   // adjust path as needed

   
   
   const createSupportTicket = async (req, res) => {
     try {
       const {
         user_id,
         name,
         user_email,
         subject,
         category,
         priority,
         message
       } = req.body;
   
       // Validate required fields
       if (!user_id || !name || !user_email || !subject || !category || !message) {
         return res.status(400).json({ message: "Missing required fields" });
       }
   
       // 🔑 Get next ticket number (atomic)
       const ticketNumber = await getNextTicketNumber();
   
       // Create new ticket
       const newTicket = new SupportTickets({
         user_id,
         ticketNumber,
         name,
         user_email,
         subject,
         category,
         priority: priority || 'medium',
         message,
         status: 'Open'
       });
   
       const savedTicket = await newTicket.save();
   
       res.status(201).json({
         success: true,
         message: "Support ticket created successfully",
         ticket: savedTicket
       });
   
     } catch (error) {
       console.error("Error creating support ticket:", error);
       res.status(500).json({
         success: false,
         message: "Server error. Failed to create support ticket",
         error: error.message
       });
     }
   };
   
  
   

  
  const getSupportTicketsByCategory = async (req, res) => {
    try {
      const data = await SupportTickets.aggregate([
        {
          $group: {
            _id: '$category',          // billing, technical, etc.
            totalTickets: { $sum: 1 }
          }
        },
        {
          $sort: { totalTickets: -1 }
        }
      ]);

      res.status(200).json({ data });
    } catch (error) {
      console.error('Get Support Tickets By Category Error:', error);
      res.status(500).json({ message: error.message });
    }
  }
  

  const getAllTickets = async (req, res) => {
    try {
      const tickets = await SupportTickets
        .find()
        .sort({ createdAt: -1 }); // newest first
  
      res.status(200).json({
        success: true,
        tickets
      });
    } catch (error) {
      console.error('Error fetching support tickets:', error);
  
      res.status(500).json({
        success: false,
        message: 'Failed to fetch support tickets',
        error: error.message
      });
    }
  };
  

  
  
  export default {sendSupportEmail,createSupportTicket,getSupportTicketsByCategory,getAllTickets};
  