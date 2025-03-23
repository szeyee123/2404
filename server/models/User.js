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
        status: {
            type: DataTypes.ENUM("active", "blocked"),
            allowNull: false,
            defaultValue: "active"
        }
    }, {
        tableName: 'users',
    });

    // Association: User has many addresses
    User.associate = (models) => {
        User.hasMany(models.Address, {
            foreignKey: 'userId', 
            onDelete: 'CASCADE'
        });
    };

    return User;
};
