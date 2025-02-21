const express = require('express');
const router = express.Router();

// Import Middleware
const { authMiddleware } = require('../middlewares/authMiddleware');

// import controllers
const { createCardProfile, getAllCardProfiles, updateCardProfile, deleteCardProfile, getCardProfileById } = require('../controllers/cardProfileController');

// Begin swagger documentation for each routes

// CREATE CARD Profile
/**
 * @swagger
 * /api/create/card-profile:
 *   post:
 *     summary: Create a new card profile
 *     description: Only admins can create a new card profile. The expiration is specified in months (2 months = 2). The `fees` field should be an array of objects containing details about different fees associated with the card profile.
 *     tags: [Card Profiles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               card_name:
 *                 type: string
 *                 example: "Platinum Debit Card"
 *               description:
 *                 type: string
 *                 example: "Premium banking card with extra benefits"
 *               bin_prefix:
 *                 type: string
 *                 example: "506099"
 *               card_scheme:
 *                 type: string
 *                 example: "Visa"
 *               expiration:
 *                 type: number
 *                 format: integer
 *                 example: 30
 *               currency:
 *                 type: string
 *                 example: "NGN"
 *               branch_blacklist:
 *                 type: string
 *                 example: "Lagos Branch"
 *               fees:
 *                 type: array
 *                 description: List of fees associated with the card profile. Each fee should include name, value, currency, frequency, and fee impact.
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Maintenance Fee"
 *                     value:
 *                       type: number
 *                       format: float
 *                       example: 150.00
 *                     currency:
 *                       type: string
 *                       example: "NGN"
 *                     frequency:
 *                       type: string
 *                       example: "Monthly"
 *                     fee_impact:
 *                       type: string
 *                       example: "Issuance"
 *     responses:
 *       201:
 *         description: Card profile created successfully
 *       403:
 *         description: Unauthorized - Only admins can create card profiles
 *       500:
 *         description: Internal server error
 */
router.post('/create/card-profile', authMiddleware, createCardProfile);


// FETCH ALL CARD PROFILES
/**
 * @swagger
 * /api/card-profiles:
 *   get:
 *     summary: Fetch all card profiles
 *     description: Retrieves a list of all card profiles. Only authenticated users can access.
 *     tags: [Card Profiles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all card profiles
 *       500:
 *         description: Internal server error
 */
router.get('/card-profiles', authMiddleware, getAllCardProfiles);


// UPDATE A CARD PROFILE BY ID
/**
 * @swagger
 * /api/update/card-profile/{id}:
 *   patch:
 *     summary: Fully or partially update a card profile
 *     description: Allows updating specific fields of a card profile, including fees. Only admins can update.
 *     tags: [Card Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the card profile to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               card_name:
 *                 type: string
 *                 example: "Updated Gold Debit Card"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               bin_prefix:
 *                 type: string
 *                 example: "507888"
 *               card_scheme:
 *                 type: string
 *                 example: "MasterCard"
 *               expiration:
 *                 type: number
 *                 format: integer
 *                 example: 60
 *               currency:
 *                 type: string
 *                 example: "USD"
 *               branch_blacklist:
 *                 type: string
 *                 example: "Abuja Branch"
 *               fees:
 *                 type: array
 *                 description: Array of fee structures associated with the card profile
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Maintenance Fee"
 *                     value:
 *                       type: number
 *                       example: 150
 *                     currency:
 *                       type: string
 *                       example: "NGN"
 *                     frequency:
 *                       type: string
 *                       example: "Monthly"
 *                     fee_impact:
 *                       type: string
 *                       example: "Issuance"
 *     responses:
 *       200:
 *         description: Card profile updated successfully
 *       400:
 *         description: No fields provided for update
 *       403:
 *         description: Unauthorized - Only admins can update card profiles
 *       404:
 *         description: Card profile not found
 *       500:
 *         description: Internal server error
 */
router.patch('/update/card-profile/:id', authMiddleware, updateCardProfile);


// DELETE A CARD PROFILE BY ID
/**
 * @swagger
 * /api/delete/card-profile/{id}:
 *   delete:
 *     summary: This deletes a card profile permanently from the database.
 *     description: Only admins can delete a card profile.
 *     tags: [Card Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the card profile to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Card profile deleted successfully
 *       403:
 *         description: Unauthorized - Only admins can delete card profiles
 *       404:
 *         description: Card profile not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/card-profile/:id', authMiddleware, deleteCardProfile);


// GET CARD PROFILE BY ID
/**
 * @swagger
 * /api/card-profile/{id}:
 *   get:
 *     summary: Retrieve a card profile by ID
 *     description: Fetches the details of a specific card profile by its ID. Only authenticated users can access this route.
 *     tags: [Card Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the card profile to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Card profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Card profile fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     card_name:
 *                       type: string
 *                       example: "Platinum Debit Card"
 *                     description:
 *                       type: string
 *                       example: "Premium banking card with extra benefits"
 *                     bin_prefix:
 *                       type: string
 *                       example: "506099"
 *                     card_scheme:
 *                       type: string
 *                       example: "Visa"
 *                     expiration:
 *                       type: number
 *                       example: 30
 *                     currency:
 *                       type: string
 *                       example: "NGN"
 *                     branch_blacklist:
 *                       type: string
 *                       example: "Lagos Branch"
 *                     fees:
 *                       type: array
 *                       description: Array of fees associated with the card profile
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Maintenance Fee"
 *                           value:
 *                             type: number
 *                             example: 150
 *                           currency:
 *                             type: string
 *                             example: "NGN"
 *                           frequency:
 *                             type: string
 *                             example: "Monthly"
 *                           fee_impact:
 *                             type: string
 *                             example: "Issuance"
 *       403:
 *         description: Unauthorized - User must be authenticated
 *       404:
 *         description: Card profile not found
 *       500:
 *         description: Internal server error
 */
router.get('/card-profile/:id', authMiddleware, getCardProfileById);

module.exports = router