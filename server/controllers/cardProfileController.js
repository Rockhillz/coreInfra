const pool = require('../databasePG');

// Create Card Profile....... Working
exports.createCardProfile = async (req, res) => {
    try {
        const { userId, role } = req.user; // Extract userId and role from token

        if (role !== 'Admin') {
            return res.status(403).json({ message: "Unauthorized! Only admins can create card profiles." });
        }

        const { card_name, description, bin_prefix, card_scheme, expiration, currency, branch_blacklist, fees } = req.body;

        // Ensure fees is a valid JSON array (if provided)
        const feesData = Array.isArray(fees) ? fees : [];

        const result = await pool.query(
            `INSERT INTO card_profiles (user_id, card_name, description, bin_prefix, card_scheme, expiration, currency, branch_blacklist, fees) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, 
            [userId, card_name, description, bin_prefix, card_scheme, expiration, currency, branch_blacklist, JSON.stringify(feesData)]
        );

        res.status(201).json({ message: "Card profile created successfully", data: result.rows[0] });

    } catch (error) {
        console.error("Error creating card profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Card Profiles...... Working
exports.getAllCardProfiles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM card_profiles ORDER BY created_at DESC');
        res.status(200).json({ message: "Card profiles fetched successfully", data: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a Single Card Profile by ID...... Working
exports.getCardProfileById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('SELECT * FROM card_profiles WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Card profile not found" });
        }

        res.status(200).json({ message: "Card profile fetched successfully", data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update a Card Profile...... Working
exports.updateCardProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // Contains fields to update

        const profileCheck = await pool.query('SELECT * FROM card_profiles WHERE id = $1', [id]);
        if (profileCheck.rows.length === 0) {
            return res.status(404).json({ message: "Card profile not found" });
        }

        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: "Unauthorized! Only admins can update card profiles." });
        }

        const fields = Object.keys(updates);
        if (fields.length === 0) {
            return res.status(400).json({ message: "No fields provided for update" });
        }

        // Convert `fees` to JSON if it exists
        if (updates.fees) {
            updates.fees = JSON.stringify(updates.fees);
        }

        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
        const values = Object.values(updates);
        values.push(id);

        const query = `UPDATE card_profiles SET ${setClause}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;
        const result = await pool.query(query, values);

        res.status(200).json({ message: "Card profile updated successfully", data: result.rows[0] });
    } catch (error) {
        console.error("Error updating card profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a Card Profile..... Working
exports.deleteCardProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if profile exists
        const profileCheck = await pool.query('SELECT * FROM card_profiles WHERE id = $1', [id]);
        if (profileCheck.rows.length === 0) {
            return res.status(404).json({ message: "Card profile not found" });
        }

        // Only admins can delete card profiles
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: "Unauthorized! Only admins can delete card profiles." });
        }

        // Delete the profile
        await pool.query('DELETE FROM card_profiles WHERE id = $1', [id]);

        res.status(200).json({ message: "Card profile deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
