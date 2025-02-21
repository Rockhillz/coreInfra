const db = require('../config/databasePG');

// create a card request..... Working
exports.createCardRequest = async (req, res) => {
    try {
        const { userId } = req.user; // Extract initiator from token
        const { branch_name, card_type, quantity, card_charges, batch } = req.body;

        // Validate input data
        if (!branch_name || !card_type || !quantity || !card_charges || !batch) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Insert data using Knex
        const [newRequest] = await db("card_requests")
            .insert({
                branch_name,
                card_type,
                quantity,
                initiator: userId,
                card_charges,
                batch
            })
            .returning("*");

        res.status(201).json({ message: "Card request created successfully", data: newRequest });

    } catch (error) {
        console.error("Error creating card request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Fetch All Card Requests...... Working
exports.getAllCardRequests = async (req, res) => {
    try {
        const requests = await db("card_requests").orderBy("date_requested", "desc");

        res.status(200).json({ message: "Card requests fetched successfully", data: requests });

    } catch (error) {
        console.error("Error fetching card requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Update Card Request Status (Action Buttons)....... Working
exports.updateCardRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ["Pending", "In Progress", "Ready", "Dispatched", "Acknowledged"];
        
        // Fetch current status
        const currentRequest = await db("card_requests").select("status").where({ id }).first();

        if (!currentRequest) {
            return res.status(404).json({ message: "Card request not found" });
        }

        const currentStatus = currentRequest.status;
        const currentIndex = allowedStatuses.indexOf(currentStatus);
        const newIndex = allowedStatuses.indexOf(status);

        // Ensure the update follows the correct sequence
        if (newIndex !== currentIndex + 1) {
            return res.status(400).json({ 
                message: `Invalid status transition from '${currentStatus}' to '${status}'. Allowed next status: '${allowedStatuses[currentIndex + 1]}'`
            });
        }

        // Perform the update
        const updatedRequest = await db("card_requests")
            .where({ id })
            .update({ status, updated_at: db.fn.now() })
            .returning("*"); // PostgreSQL requires returning(*), others may not support it

        res.status(200).json({ message: "Card request status updated", data: updatedRequest[0] });

    } catch (error) {
        console.error("Error updating card request status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Update all other fields except card status
exports.updateCardRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Ensure status field is not being updated
        if ("status" in updates) {
            return res.status(400).json({ message: "Status cannot be updated using this endpoint" });
        }

        // Check if request exists
        const existingRequest = await db("card_requests").where({ id }).first();
        if (!existingRequest) {
            return res.status(404).json({ message: "Card request not found" });
        }

        // Perform the update dynamically
        const updatedRequest = await db("card_requests")
            .where({ id })
            .update({ ...updates, updated_at: db.fn.now() }) // Add timestamp for tracking updates
            .returning("*"); // Works with PostgreSQL

        res.status(200).json({ message: "Card request updated successfully", data: updatedRequest[0] });

    } catch (error) {
        console.error("Error updating card request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Delete a Card Request
exports.deleteCardRequest = async (req, res) => {
    try {
        const { id } = req.params;

        // Perform deletion and return deleted row
        const deletedRequest = await db("card_requests")
            .where({ id })
            .del()
            .returning("*"); // Works with PostgreSQL

        if (deletedRequest.length === 0) {
            return res.status(404).json({ message: "Card request not found" });
        }

        res.status(200).json({ message: "Card request deleted successfully" });

    } catch (error) {
        console.error("Error deleting card request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
