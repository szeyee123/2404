const express = require('express');
const router = express.Router();
const { User, Address } = require('../models');
const { Sequelize, DataTypes, Op } = require('sequelize');
const yup = require("yup");
const moment = require('moment');

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

router.get("/status", async (req, res) => {
    const activeCount = await User.count({ where: { status: 'active' } });
    const blockedCount = await User.count({ where: { status: 'blocked' } });

    res.json({ active: activeCount, blocked: blockedCount });
});

router.get("/test", async (req, res) => {
    res.json(new Date());
});

router.get('/recent-users', async (req, res) => {
    try {
        const startOfMonth = moment().startOf('month').toDate(); // First day of the month
        const endOfMonth = moment().endOf('month').toDate(); // Last day of the month

        const recentUsers = await User.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfMonth, endOfMonth], // Filter users for the current month
                },
            },
            order: [['createdAt', 'DESC']], // Newest first
            limit: 8, // Get only 8 users
        });

        res.json(recentUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent users', error });
    }
});



router.get('/count', async (req, res) => {
    try {
        const totalUsers = await User.count();

        // Get the first day of the current month
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        // Count users created this month
        const currentMonthUsers = await User.count({
            where: {
                createdAt: {
                    [Op.gte]: firstDayOfMonth // Filters users created after the first day of this month
                }
            }
        });
        res.json({ total: totalUsers, currentMonth: currentMonthUsers });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user count', error });
    }
});

router.get("/pastSignUps", async (req, res) => {
    const now = new Date();
    const startOfLast12Months = new Date(now.getFullYear(), now.getMonth() - 11, 1); // Start of 12 months ago

    const months = [];

    // Generate past 12 months including the current month
    for (let i = 11; i >= -1; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const yearMonth = d.toISOString().slice(0, 7);
        months.push({ month: yearMonth, count: 0 });
    }

    // Query actual signup counts from database
    const signups = await User.findAll({
        attributes: [
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'month'],
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: { 
            createdAt: { 
                [Op.between]: [startOfLast12Months, now] // From 12 months ago to today
            } 
        },
        group: ['month'],
        order: [['month', 'ASC']]
    });

    // Convert signups to a lookup object { YYYY-MM: count }
    const signupMap = Object.fromEntries(signups.map(s => [s.dataValues.month, s.dataValues.count]));

    // Merge results with default months
    const finalData = months.map(m => ({
        month: m.month,
        count: signupMap[m.month] || 0
    }));

    res.json(finalData);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let user = await User.findByPk(id);
    // Check id not found
    if (!user) {
        res.sendStatus(404);
        return;
    }
    res.json(user);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100).required(),
        email: yup.string().trim().min(3).max(500).email().required(),
        number: yup.string().trim().matches(/^\d{8}$/,"Mobile number must be exactly 8 digits").required(),
        address: yup.string().trim().min(3).max(500).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        // Process valid data
        let num = await User.update(data, {
            where: { id: id }
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

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }
    let num = await User.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "User was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete user with id ${id}.`
        });
    }
});

router.patch("/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (!["active", "blocked"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
  
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.status = status;
      await user.save();
  
      res.json({ message: `User ${id} updated to ${status}`, user });
    } catch (err) {
      res.status(500).json({ message: "Database error", error: err });
    }
});

// DELETE
// Delete Address by ID for a specific user
router.delete('/:userId/addresses/:addressId', async (req, res) => {
    const { userId, addressId } = req.params;  

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
    const { userId, addressId } = req.params; 
    const { street, city, country, zipCode, isDefault } = req.body; 

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

        // If the new address is marked as default, update other addresses to false
        if (isDefault === true) {
            await Address.update({ isDefault: false }, {
                where: { userId, id: { [Op.ne]: addressId } }
            });
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