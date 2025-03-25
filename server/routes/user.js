const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { Sequelize, DataTypes, Op } = require('sequelize');
const yup = require("yup");
const moment = require('moment');

router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100).required(),
        email: yup.string().trim().min(3).max(500).email().required(),
        number: yup.string().trim().matches(/^\d{8}$/, "Mobile number must be exactly 8 digits").required(),
        address: yup.string().trim().min(3).max(500).required(),
        status: yup.string().oneOf(["active", "blocked"]).default("active")
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        // Process valid data
        let result = await User.create(data);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;

    if (search) {
        condition[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { number: { [Op.like]: `%${search}%` } },
            { address: { [Op.like]: `%${search}%` } },
            { status: { [Op.like]: `%${search}%` } }
        ];
    }
    // You can add condition for other columns here
    // e.g. condition.columnName = value;

    let list = await User.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
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
        address: yup.string().trim().min(3).max(500).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        // Process valid data
        let num = await User.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "User was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update user with id ${id}.`
            });
        }
    }

    catch (err) {
        res.status(400).json({ errors: err.errors });
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

module.exports = router;