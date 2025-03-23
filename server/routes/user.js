const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { Op } = require('sequelize');
const yup = require('yup');

// Create User with multiple addresses
router.post('/', async (req, res) => {
    let data = req.body;
    
    // Validation Schema
    const validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100).required(),
        email: yup.string().trim().min(3).max(255).email().required(),
        number: yup.string().trim().matches(/^\d{8}$/, 'Mobile number must be exactly 8 digits').required(),
        addresses: yup.array().of(
            yup.object({
                street: yup.string().trim().min(3).max(255).required(),
                city: yup.string().trim().min(3).max(150).required(),
                country: yup.string().trim().min(3).max(150).required(),
                zipCode: yup.string().trim().min(3).max(10).required(),
                isDefault: yup.boolean().default(false)
            })
        ).required(),  // Ensures the addresses field is provided as an array
        status: yup.string().oneOf(['active', 'blocked']).default('active')
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        const result = await User.create(data);
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Get All Users
router.get('/', async (req, res) => {
    const search = req.query.search;
    const condition = search ? {
        [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { number: { [Op.like]: `%${search}%` } },
            { status: { [Op.like]: `%${search}%` } }
        ]
    } : {};

    const users = await User.findAll({ where: condition, order: [['createdAt', 'DESC']] });
    res.json(users);
});

// Get User by ID
router.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.sendStatus(404);
    res.json(user);
});

// Update User
router.put('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.sendStatus(404);

    // Validation Schema for update
    const validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100).required(),
        email: yup.string().trim().min(3).max(500).email().required(),
        number: yup.string().trim().matches(/^\d{8}$/, 'Mobile number must be exactly 8 digits').required(),
        addresses: yup.array().of(
            yup.object({
                street: yup.string().trim().min(3).max(255).required(),
                city: yup.string().trim().min(3).max(150).required(),
                country: yup.string().trim().min(3).max(150).required(),
                zipCode: yup.string().trim().min(3).max(10).required(),
                isDefault: yup.boolean().default(false)
            })
        ).required(),
        status: yup.string().oneOf(['active', 'blocked']).default('active')
    });

    try {
        const data = await validationSchema.validate(req.body, { abortEarly: false });
        await User.update(data, { where: { id: req.params.id } });
        res.json({ message: 'User updated successfully.' });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Delete User
router.delete('/:id', async (req, res) => {
    const result = await User.destroy({ where: { id: req.params.id } });
    if (result) res.json({ message: 'User deleted successfully.' });
    else res.status(404).json({ message: 'User not found.' });
});

// Update User Status
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;
    if (!['active', 'blocked'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.status = status;
    await user.save();

    res.json({ message: `User status updated to ${status}` });
});

module.exports = router;