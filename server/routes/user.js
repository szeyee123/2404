const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");

router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100).required(),
        email: yup.string().trim().min(3).max(500).email().required(),
        number: yup.string().trim().matches(/^\d{8}$/,"Mobile number must be exactly 8 digits").required(),
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