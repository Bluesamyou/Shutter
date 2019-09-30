module.exports = function(sequelize, DataTypes) {
    var Credits = sequelize.define("Credits", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
        }, 
        total_credits: {
            type: DataTypes.INTEGER
        }
    });
    return Credits;
};