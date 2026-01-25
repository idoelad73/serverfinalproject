import usersModel from '../models/user.model.js';



async function updateUserProfile() {
    return new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Hello");
    }, 2000);
});
}


export default {
    getUserDetails: async (req, res) => {
        try {
            // We get the ID from the URL parameter: /get-details/:id
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "User ID is required" });
            }

            const user = await usersModel.findById(id).select(
                'user_name user_email user_adress user_phone'
            );

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json(user);
        } catch (error) {
            console.error("Get User Details Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    // ... other methods

    updateUserProfile: async (req, res) => {
        try {
            await updateUserProfile();
            const { user_name, user_email } = req.body;
            if(!user_name || !user_email){
                throw new Error("All fields are required");
            }
            const user = await usersModel.findByIdAndUpdate(req.user.id,req.body, { new: true });
            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            if(error.message === "All fields are required"){
                return res.status(400).json({
                    message: error.message,
                });
            }
            res.status(500).json({
                message: "Error updating user profile",
            });
        }
    },
    updateUserPassword: async (req, res) => {
        try {
            const { new_password } = req.body;
            if(!new_password){
                throw new Error("All fields are required");
            }

            const user = await usersModel.findById(req.user.id);

            user.user_password = new_password;
            await user.save();
            res.status(200).json(user);
        } catch (error) {
            console.log(error);
        }
    },
    getAllUsers: async (req, res) => {
        console.log('getAllUsers called');
    
        try {
            const { page = 1, limit = 30, filter = '{}', sort = '{}' } = req.query;
    
            let filterObject = {};
            let sortObject = {};
    
            try {
                filterObject =
                    typeof filter === 'string' && filter.trim() !== ''
                        ? JSON.parse(filter)
                        : filter || {};
            } catch (e) {
                console.log('Error parsing filter, using empty object:', e.message);
                filterObject = {};
            }
    
            try {
                sortObject =
                    typeof sort === 'string' && sort.trim() !== ''
                        ? JSON.parse(sort)
                        : sort || {};
            } catch (e) {
                console.log('Error parsing sort, using empty object:', e.message);
                sortObject = {};
            }
    
            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 30;
            const skip = (pageNum - 1) * limitNum;
    
            const total = await usersModel.countDocuments(filterObject);
    
            const users = await usersModel
                .find(filterObject)
                .select('-user_password -reset_password_token -user_email_verification_token')
                .sort(sortObject)
                .skip(skip)
                .limit(limitNum);
    
            res.status(200).json({
                message: "Users retrieved successfully",
                users,
                total,
                page: pageNum,
                limit: limitNum
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error retrieving users",
                error: error.message
            });
        }
    },
    
    updateUserContact: async (req, res) => {
        try {
          const { user_id, user_adress, user_phone } = req.body;
      
          if (!user_id || !user_adress || !user_phone) {
            return res.status(400).json({
              success: false,
              message: "Missing required fields",
            });
          }
      
          const user = await usersModel.findByIdAndUpdate(
            user_id,
            {
              user_adress,
              user_phone,
            },
            { new: true }
          );
      
          if (!user) {
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          }
      
          res.status(200).json({ success: true, user });
        } catch (err) {
          console.error("Update contact error:", err);
          res.status(500).json({ success: false });
        }
      }
      
}