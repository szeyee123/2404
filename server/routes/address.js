const express = require('express');
const router = express.Router();
const { Address }  = require('../models');


// Get User Addresses
router.get('/', async (req, res) => {
    try {
        const addresses = await Address.findAll();
        res.json(addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ error: "Failed to fetch addresses" });
    }
});

// Create Address
router.post('/', async (req, res) => {
    const newAddress = await Address.create(req.body);
    res.json(newAddress);
});

// Update Address
router.put('/:id', async (req, res) => {
    await Address.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Address updated' });
});

// Delete Address
router.delete('/:id', async (req, res) => {
    await Address.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Address deleted' });
});

// Set Default Address
router.put('/set-default/:id', async (req, res) => {
    await Address.update({ isDefault: false }, { where: { userId: req.body.userId } });
    await Address.update({ isDefault: true }, { where: { id: req.params.id } });
    res.json({ message: 'Default address set' });
});

module.exports = router;