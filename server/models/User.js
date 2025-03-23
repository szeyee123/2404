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
                    msg: "Invalid email format"
                }
            }
        },
        number: {
            type: DataTypes.STRING(8),
            allowNull: false,
            validate: {
                isNumeric: {
                    msg: "Mobile number must contain only digits"
                },
                len: {
                    args: [8, 8],
                    msg: "Mobile number must be exactly 8 digits"
                }
            }
        },
        street: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        city: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        country: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        zipCode: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: DataTypes.ENUM("active", "blocked"),
            allowNull: false,
            defaultValue: "active"
        }
    }, {
        tableName: 'users'
    });

    return User;
};
