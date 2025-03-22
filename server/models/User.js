module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                isEmail: {
                    msg: "Invalid email format" // Email validation
                }
            }
        },
        number: {
            type: DataTypes.STRING(8), // Ensures 8 digit
            allowNull: false,
            validate: {
                isNumeric: {
                    msg: "Mobile number must contain only digits"
                },
                len: {
                    args: [8, 8], // Ensures exactly 8 digits
                    msg: "Mobile number must be exactly 8 digits"
                }
            }
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM("active", "blocked"), // Allows only "active" or "blocked"
            allowNull: false,
            defaultValue: "active" // Default is active
        }
    }, {
        tableName: 'users'
    });
    
    return User;
}