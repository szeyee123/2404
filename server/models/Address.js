module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define("Address", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
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
        }
    }, {
        tableName: 'addresses'
    });

    return Address;
};
