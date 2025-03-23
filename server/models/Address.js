module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define("Address", {
        street: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        zipCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        userId: {  // Foreign key linking Address to a specific User
            type: DataTypes.INTEGER,
            allowNull: false,  
            references: {
                model: 'users',  // Refers to the User table
                key: 'id'        // Refers to the id field of the User table
            },
            onDelete: 'CASCADE'  // Cascade delete if the user is deleted
        }
    }, {
        tableName: 'addresses',
    });

    // Association: Address belongs to User
    Address.associate = (models) => {
        Address.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
    };

    return Address;
};
