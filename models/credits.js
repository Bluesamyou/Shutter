module.exports = function(sequelize, DataTypes) {
    var Credits = sequelize.define("Credits", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
        }, 
        totalCredits: {
            type: DataTypes.INTEGER
        }
    });
    return Credits;
};