const pool = require('../databasePG');

// create a card request..... Working
exports.createCardRequest = async (req, res) => {
    try {
        const { userId } = req.user; // Extract initiator from token
        const { branch_name, card_type, quantity, card_charges, batch } = req.body;

        // Validate input data
        if (!branch_name ||!card_type ||!quantity ||!card_charges ||!batch) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const result = await pool.query(
            `INSERT INTO card_requests (branch_name, card_type, quantity, initiator, card_charges, batch)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [branch_name, card_type, quantity, userId, card_charges, batch]
        );

        res.status(201).json({ message: "Card request created successfully", data: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Fetch All Card Requests...... Working
exports.getAllCardRequests = async (req, res) => {
    try {
        
        const result = await pool.query('SELECT * FROM card_requests ORDER BY date_requested DESC');
        res.status(200).json({ message: "Card requests fetched successfully", data: result.rows });
    } catch (error) {
        console.error(error);
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
        const currentRequest = await pool.query(
            `SELECT status FROM card_requests WHERE id = $1`,
            [id]
        );

        if (currentRequest.rows.length === 0) {
            return res.status(404).json({ message: "Card request not found" });
        }

        const currentStatus = currentRequest.rows[0].status;
        const currentIndex = allowedStatuses.indexOf(currentStatus);
        const newIndex = allowedStatuses.indexOf(status);

        // Ensure the update follows the correct sequence
        if (newIndex !== currentIndex + 1) {
            return res.status(400).json({ 
                message: `Invalid status transition from '${currentStatus}' to '${status}'. Allowed next status: '${allowedStatuses[currentIndex + 1]}'`
            });
        }

        // Perform the update
        const result = await pool.query(
            `UPDATE card_requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [status, id]
        );

        res.status(200).json({ message: "Card request status updated", data: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Delete a Card Request
exports.deleteCardRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM card_requests WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Card request not found" });
        }

        res.status(200).json({ message: "Card request deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};