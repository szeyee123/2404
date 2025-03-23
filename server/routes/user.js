const express = require('express');
const router = express.Router();
const { User, Address } = require('../models');  // Ensure you import the Address model too
const { Op } = require('sequelize');
const yup = require('yup');

// POST
// Create User with multiple addresses
router.post('/', async (req, res) => {
    let data = req.body;

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
        ).required(),
        status: yup.string().oneOf(['active', 'blocked']).default('active')
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        // Create User
        const user = await User.create({
            name: data.name,
            email: data.email,
            number: data.number,
            status: data.status
        });

        // Create Addresses and associate with user
        const addresses = await Promise.all(
            data.addresses.map(address => {
                return Address.create({
                    ...address,
                    userId: user.id 
                });
            })
        );

        res.json({ user, addresses });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Add New Address for an Existing User
router.post('/:userId/addresses', async (req, res) => {
    const { userId } = req.params; // User ID from the request parameters
    const { street, city, country, zipCode, isDefault } = req.body; 
  
    // Validation schema for the address
    const addressValidationSchema = yup.object({
        street: yup.string().trim().min(3).max(255).required(),
        city: yup.string().trim().min(3).max(150).required(),
        country: yup.string().trim().min(3).max(150).required(),
        zipCode: yup.string().trim().min(3).max(10).required(),
        isDefault: yup.boolean().default(false),
    });
  
    try {
        // Validate the request body using the address validation schema
        await addressValidationSchema.validate(req.body, { abortEarly: false });

        // Check if the user exists in the database (using `userId` from the URL parameter)
        const user = await User.findByPk(userId);
        if (!user) {
            // If the user doesn't exist, send a 404 error
            return res.status(404).json({ message: 'User not found' });
        }
  
        // If the address is marked as default, make sure no other address is set as default
        if (isDefault) {
            // Update the current default address to not be default
            await Address.update({ isDefault: false }, {
                where: {
                    userId,
                    isDefault: true,
                },
            });
        }
  
        // Create a new address for the user in the database
        const address = await Address.create({
            street,
            city,
            country,
            zipCode,
            isDefault,
            userId
        });
  
        // Send the success response with the newly created address
        res.json({ message: 'Address added successfully', address });
    } catch (err) {
        // If there's any validation error or any other error, return the error message
        res.status(400).json({ errors: err.errors || err.message });
    }
});

// GET
// Get All Addresses for a specific user by userId
router.get('/:userId/addresses', async (req, res) => {
    const { userId } = req.params;  // Get userId from the URL parameter

    try {
        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find all addresses associated with the user
        const addresses = await Address.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });

        // If no addresses are found
        if (addresses.length === 0) {
            return res.status(404).json({ message: 'No addresses found for this user' });
        }

        // Respond with the user's addresses
        res.json(addresses);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get All Users with their associated addresses
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

    const users = await User.findAll({
        where: condition,
        include: [Address],
        order: [['createdAt', 'DESC']]
    });
    res.json(users);
});

// DELETE
// Delete Address by ID for a specific user
router.delete('/:userId/addresses/:addressId', async (req, res) => {
    const { userId, addressId } = req.params;  // Get userId and addressId from the URL parameters

    try {
        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the address exists for the given user
        const address = await Address.findOne({
            where: { id: addressId, userId: userId }
        });

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Delete the address
        await address.destroy();

        res.json({ message: 'Address deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT
// Update Address by ID for a specific user
router.put('/:userId/addresses/:addressId', async (req, res) => {
    const { userId, addressId } = req.params;  // Get userId and addressId from the URL parameters
    const { street, city, country, zipCode, isDefault } = req.body;  // Get updated data from the request body

    try {
        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the address exists for the given user
        const address = await Address.findOne({
            where: { id: addressId, userId: userId }
        });

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // If the new address is marked as default, ensure only one default address exists
        if (isDefault !== undefined) {
            if (isDefault) {
                const defaultAddressCount = await Address.count({
                    where: { userId, isDefault: true }
                });

                if (defaultAddressCount > 0) {
                    return res.status(400).json({ message: 'User can have only one default address' });
                }
            }
        }

        // Update the address fields
        address.street = street || address.street;
        address.city = city || address.city;
        address.country = country || address.country;
        address.zipCode = zipCode || address.zipCode;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

        // Save the updated address
        await address.save();

        res.json({ message: 'Address updated successfully', address });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


module.exports = router;