const express = require('express');
const router = express.Router();

// Import middleware
const { authMiddleware } = require('../middlewares/authMiddleware');

// Import controllers
const { createCardRequest, getAllCardRequests, updateCardRequestStatus, deleteCardRequest, updateCardRequest } = require('../controllers/CardRequestController');


// CREATE CARD REQUEST
/**
 * @swagger
 * /api/create/card-request:
 *   post:
 *     summary: Create a new card request
 *     description: Allows a user to create a card request. The initiator is automatically extracted from the authentication token.
 *     tags: [Card Requests]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branch_name:
 *                 type: string
 *                 example: "Lagos Branch"
 *               card_type:
 *                 type: string
 *                 example: "Visa Debit Card"
 *               quantity:
 *                 type: integer
 *                 example: 100
 *               card_charges:
 *                 type: number
 *                 format: float
 *                 example: 2500.00
 *               batch:
 *                 type: string
 *                 example: "Batch-2024-001"
 *     responses:
 *       201:
 *         description: Card request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Card request created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     branch_name:
 *                       type: string
 *                       example: "Lagos Branch"
 *                     card_type:
 *                       type: string
 *                       example: "Visa Debit Card"
 *                     quantity:
 *                       type: integer
 *                       example: 100
 *                     initiator:
 *                       type: integer
 *                       example: 42
 *                     card_charges:
 *                       type: number
 *                       format: float
 *                       example: 2500.00
 *                     batch:
 *                       type: string
 *                       example: "Batch-2024-001"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-02-21T10:15:30Z"
 *       400:
 *         description: Bad request - Missing required fields
 *       403:
 *         description: Unauthorized - User must be authenticated or Invalid token
 *       500:
 *         description: Internal server error
 */
router.post('/create/card-request', authMiddleware, createCardRequest);


// GET ALL CARD REQUESTS
/**
 * @swagger
 * /api/card-requests:
 *   get:
 *     summary: Retrieve all card requests
 *     description: Fetches a list of all card requests, ordered by the date requested.
 *     tags: [Card Requests]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all card requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Card requests fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       branch_name:
 *                         type: string
 *                         example: "Lagos Branch"
 *                       card_type:
 *                         type: string
 *                         example: "Visa Debit Card"
 *                       quantity:
 *                         type: integer
 *                         example: 100
 *                       initiator:
 *                         type: integer
 *                         example: 42
 *                       card_charges:
 *                         type: number
 *                         format: float
 *                         example: 2500.00
 *                       batch:
 *                         type: string
 *                         example: "Batch-2024-001"
 *                       date_requested:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-02-21T10:15:30Z"
 *       403:
 *         description: Unauthorized - User must be authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/card-requests', authMiddleware, getAllCardRequests);


// SEE CARD REQUEST STATUS
/**
 * @swagger
 * /api/update-status/card-request/{id}:
 *   patch:
 *     summary: Update the status of a card request
 *     description: Allows updating the status of a card request Following a predefined sequence. i.e you can't jump from a pending to dispatch. Has to follow the flow. Only admins can update.
 *     tags: [Card Requests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the card request to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["Pending", "In Progress", "Ready", "Dispatched", "Acknowledged"]
 *                 example: "Ready"
 *     responses:
 *       200:
 *         description: Card request status updated successfully
 *       400:
 *         description: Invalid status update. Follow status flow.
 *       403:
 *         description: Unauthorized - Only admins can update card requests
 *       404:
 *         description: Card request not found
 *       500:
 *         description: Internal server error
 */
router.patch('/update-status/card-request/:id', authMiddleware, updateCardRequestStatus);


// UPDATE A CARD REQUEST FIELD
/**
 * @swagger
 * /api/update/card-request/{id}:
 *   patch:
 *     summary: Update a card request (excluding status)
 *     description: Dynamically update any field in a card request **except the status field**.
 *     tags:
 *       - Card Requests
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the card request to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branch_name:
 *                 type: string
 *                 example: "Main Branch"
 *               card_type:
 *                 type: string
 *                 example: "Visa"
 *               quantity:
 *                 type: integer
 *                 example: 100
 *               card_charges:
 *                 type: number
 *                 example: 150.50
 *               batch:
 *                 type: string
 *                 example: "Batch A"
 *             additionalProperties: false
 *     responses:
 *       200:
 *         description: Card request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Card request updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     branch_name:
 *                       type: string
 *                       example: "Main Branch"
 *                     card_type:
 *                       type: string
 *                       example: "Visa"
 *                     quantity:
 *                       type: integer
 *                       example: 100
 *                     initiator:
 *                       type: string
 *                       example: "user123"
 *                     card_charges:
 *                       type: number
 *                       example: 150.50
 *                     batch:
 *                       type: string
 *                       example: "Batch A"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-21T12:34:56Z"
 *       400:
 *         description: Status update not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Status cannot be updated using this endpoint"
 *       404:
 *         description: Card request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Card request not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.patch('/update/card-request/:id', authMiddleware, updateCardRequest)


// DELETE A CARD REQUEST
/**
 * @swagger
 * /api/delete/card-requests/{id}:
 *   delete:
 *     summary: Delete a card request
 *     description: Deletes a specific card request by ID. Only admins can delete.
 *     tags: [Card Requests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the card request to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Card request deleted successfully
 *       403:
 *         description: Unauthorized - Only admins can delete card requests
 *       404:
 *         description: Card request not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/card-requests/:id', authMiddleware, deleteCardRequest);


module.exports = router;
