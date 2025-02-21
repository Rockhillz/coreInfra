const db = require('../config/databasePG'); // Now using Knex instance

// Create Card Profile
exports.createCardProfile = async (req, res) => {
    try {
        const { userId, role } = req.user; // Extract userId and role from token

        if (role !== 'Admin') {
            return res.status(403).json({ message: "Unauthorized! Only admins can create card profiles." });
        }

        const { card_name, description, bin_prefix, card_scheme, expiration, currency, branch_blacklist, fees } = req.body;

        // Ensure fees is a valid JSON array (if provided)
        const feesData = Array.isArray(fees) ? fees : [];

        // Insert data using Knex
        const [newCardProfile] = await db('card_profiles')
            .insert({
                user_id: userId,
                card_name,
                description,
                bin_prefix,
                card_scheme,
                expiration,
                currency,
                branch_blacklist,
                fees: JSON.stringify(feesData) // Ensure fees is stored as JSON
            })
            .returning('*'); // Return inserted row(s)

        res.status(201).json({ message: "Card profile created successfully", data: newCardProfile });

    } catch (error) {
        console.error("Error creating card profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Get All Card Profiles...... Working
exports.getAllCardProfiles = async (req, res) => {
    try {
        const profiles = await db("card_profiles").orderBy("created_at", "desc");
        res.status(200).json({ message: "Card profiles fetched successfully", data: profiles });
    } catch (error) {
        console.error("Error fetching card profiles:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Get a Single Card Profile by ID...... Working
exports.getCardProfileById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the card profile using Knex
        const profile = await db("card_profiles").where({ id }).first(); // `.first()` ensures a single object, not an array

        if (!profile) {
            return res.status(404).json({ message: "Card profile not found" });
        }

        res.status(200).json({ message: "Card profile fetched successfully", data: profile });
    } catch (error) {
        console.error("Error fetching card profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Update a Card Profile...... Working
exports.updateCardProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // Contains fields to update

        // Check if the card profile exists
        const profileCheck = await db("card_profiles").where({ id }).first();
        if (!profileCheck) {
            return res.status(404).json({ message: "Card profile not found" });
        }

        // Ensure only admins can update card profiles
        if (req.user.role !== "Admin") {
            return res.status(403).json({ message: "Unauthorized! Only admins can update card profiles." });
        }

        // Ensure there are fields to update
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No fields provided for update" });
        }

        // Convert `fees` to JSON if it exists
        if (updates.fees) {
            updates.fees = JSON.stringify(updates.fees);
        }

        // Perform the update
        const updatedProfile = await db("card_profiles")
            .where({ id })
            .update({ ...updates, updated_at: db.fn.now() }) // Equivalent to `updated_at = NOW()`
            .returning("*"); // Returns the updated row(s)

        res.status(200).json({ message: "Card profile updated successfully", data: updatedProfile[0] });
    } catch (error) {
        console.error("Error updating card profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Delete a Card Profile..... Working
exports.deleteCardProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the card profile exists
        const profileCheck = await db("card_profiles").where({ id }).first();
        if (!profileCheck) {
            return res.status(404).json({ message: "Card profile not found" });
        }

        // Ensure only admins can delete card profiles
        if (req.user.role !== "Admin") {
            return res.status(403).json({ message: "Unauthorized! Only admins can delete card profiles." });
        }

        // Delete the profile
        await db("card_profiles").where({ id }).del();

        res.status(200).json({ message: "Card profile deleted successfully" });
    } catch (error) {
        console.error("Error deleting card profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};