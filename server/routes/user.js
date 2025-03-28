const express = require('express');
const router = express.Router();
const { User, Address } = require('../models');
const { Sequelize, DataTypes, Op } = require('sequelize');
const yup = require("yup");
const moment = require('moment');
const { encrypt, decrypt } = require('../encryption');
const axios = require('axios')

const getCoordinates = async (zipCode) => {
    const authToken = '[eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vaW50ZXJuYWwtYWxiLW9tLXByZGV6aXQtaXQtbmV3LTE2MzM3OTk1NDIuYXAtc291dGhlYXN0LTEuZWxiLmFtYXpvbmF3cy5jb20vYXBpL3YyL3VzZXIvcGFzc3dvcmQiLCJpYXQiOjE3NDI5OTQ1MTAsImV4cCI6MTc0MzI1MzcxMCwibmJmIjoxNzQyOTk0NTEwLCJqdGkiOiJnOWtIUEVYZ0IwN1J3ZGUyIiwic3ViIjoiMTc5YjYwNDljYWU5OWJmNWJhYmUzMGZmMzAyOTZiYzMiLCJ1c2VyX2lkIjo2NTUxLCJmb3JldmVyIjpmYWxzZX0.AkJzuBS4_t1YPSySqTpHqLb3ZSB8FjzhU63XPXZkftM]';

    try {
        const response = await axios.get(
            `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${zipCode}&returnGeom=Y&getAddrDetails=Y`, {
            headers: {
                Authorization: authToken, // Replace 'your_token_here' with your actual token
            }
        }
        );
        if (response.status === 200) {
            if (response.data.results.length > 0) {
                return {
                    zipCode,
                    lat: parseFloat(response.data.results[0].LATITUDE),
                    lon: parseFloat(response.data.results[0].LONGITUDE)
                };
            } 
        }
    } catch (error) {
        console.error(`Error fetching coordinates for ${zipCode}:`, error);
    }
};

// Route to get geocoded addresses
router.get("/geocode", async (req, res) => {
    try {
        // Assuming you want to fetch addresses from the Address model
        const addresses = await Address.findAll({
            attributes: ['zipCode'] // Retrieve only the address field
        });

        // Map through the retrieved addresses and get coordinates
        const geoData = await Promise.all(addresses.map(address => getCoordinates(address.zipCode)));

        // Send back the geocoded data
        res.json(geoData.filter(data => data));
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ error: "Error fetching addresses" });
    }
});

// POST
// Create User with multiple addresses
router.post('/', async (req, res) => {
    let data = req.body;
    console.log(data);

    const validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100).required(),
        email: yup.string().trim().min(3).max(255).email().required(),
        number: yup.string().trim().matches(/^\d{8}$/, 'Mobile number must be exactly 8 digits').required(),
        addresses: yup.array().of(
            yup.object({
                address: yup.string().trim().min(3).max(255).required(),
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

        // Encrypt addresses before saving
        const addresses = await Promise.all(
            data.addresses.map(address => {
                return Address.create({
                    address: encrypt(address.address),
                    city: encrypt(address.city),
                    country: encrypt(address.country),
                    zipCode: encrypt(address.zipCode),
                    isDefault: address.isDefault,
                    userId: user.id
                });
            })
        );

        res.json({ user, addresses });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});


// Get All Users with their associated addresses
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            include: [Address],
            order: [['createdAt', 'DESC']]
        });

        // Decrypt sensitive fields in the addresses
        const decryptedUsers = users.map(user => {
            const decryptedAddresses = user.Addresses.map(addr => {
                try {
                    return {
                        ...addr.toJSON(),
                        address: addr.address ? decrypt(addr.address) : null,
                        city: addr.city ? decrypt(addr.city) : null,
                        country: addr.country ? decrypt(addr.country) : null,
                        zipCode: addr.zipCode ? decrypt(addr.zipCode) : null,
                    };
                } catch (error) {
                    console.error("Failed to decrypt address:", error.message);
                    return addr.toJSON(); 
                }
            });

            return {
                ...user.toJSON(),
                Addresses: decryptedAddresses 
            };
        });

        res.json(decryptedUsers);
    } catch (err) {
        console.error("Server error:", err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
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
        number: yup.string().trim().matches(/^\d{8}$/, "Mobile number must be exactly 8 digits").required(),
        addresses: yup.array().of(
            yup.object({
                address: yup.string().trim().min(3).max(255).required(),
                city: yup.string().trim().min(3).max(150).required(),
                country: yup.string().trim().min(3).max(150).required(),
                zipCode: yup.string().trim().min(3).max(10).required(),
                isDefault: yup.boolean().default(false)
            })
        ).required(),
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        // Process valid data
        let num = await User.update(data, {
            where: { id: id }
        });

        if (num == 1) {
            res.json({ message: "User updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update user with id ${id}.` });
        }

        // if (!address) {
        //     return res.status(404).json({ message: 'Address not found' });
        // }

        // // Delete the address
        // await address.destroy();

        // res.json({ message: 'Address deleted successfully' });
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
    const { address: newAddress, city, country, zipCode, isDefault } = req.body;

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

        // Encrypt the fields before saving
        address.address = newAddress ? encrypt(newAddress) : address.address;
        address.city = city ? encrypt(city) : address.city;
        address.country = country ? encrypt(country) : address.country;
        address.zipCode = zipCode ? encrypt(zipCode) : address.zipCode;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

        // Save the updated address
        await address.save();

        res.json({ message: 'Address updated successfully', address });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Add New Address for an Existing User
router.post('/:userId/addresses', async (req, res) => {
    const { userId } = req.params;
    let { address, city, country, zipCode, isDefault } = req.body;

    try {
        // Encrypt sensitive fields
        address = encrypt(address);
        city = encrypt(city);
        country = encrypt(country);
        zipCode = encrypt(zipCode);

        const newAddress = await Address.create({
            address,
            city,
            country,
            zipCode,
            isDefault,
            userId
        });

        res.json({ message: 'Address added successfully', address: newAddress });
    } catch (err) {
        res.status(400).json({ errors: err.errors || err.message });
    }
});

// Retrieve All Addresses
router.get('/:userId/addresses', async (req, res) => {
    const { userId } = req.params;

    try {
        const addresses = await Address.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });

        // Decrypt sensitive fields safely
        const decryptedAddresses = addresses.map(addr => {
            try {
                return {
                    ...addr.toJSON(),
                    address: addr.address ? decrypt(addr.address) : null,
                    city: addr.city ? decrypt(addr.city) : null,
                    country: addr.country ? decrypt(addr.country) : null,
                    zipCode: addr.zipCode ? decrypt(addr.zipCode) : null,
                };
            } catch (error) {
                console.error("Failed to decrypt address:", error.message);
                return addr.toJSON();
            }
        });

        res.json(decryptedAddresses);
    } catch (err) {
        console.error("Server error:", err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


module.exports = router;