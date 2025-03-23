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
        addresses: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            validate: {
                isArrayOfAddresses(value) {
                    if (value && Array.isArray(value)) {
                        value.forEach(address => {
                            if (!address.street || !address.city || !address.country || !address.zipCode) {
                                throw new Error('Each address must contain street, city, country, and zipCode');
                            }
                            const defaultCount = value.filter(addr => addr.isDefault).length;
                            if (defaultCount > 1) {
                                throw new Error('Only one address can be marked as the default address');
                            }
                        });
                    }
                }
            }
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
