module.exports = function(sequelize, DataTypes) {
    var Images = sequelize.define("Images", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        image_url: {
            type: DataTypes.INTEGER
        },
        download_credit_amount: {
            type: DataTypes.INTEGER
        }
    });
    return Images;
};