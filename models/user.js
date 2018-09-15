var connection = require("../config.connection.js");
var bcrypt = require ('bcrypt-nodejs');
module.exports = function(sequelize, DataTypes){
    var User = sequelize.define("User",{
        name : {
            type: DataTypes.STRING,
            len:{
                args : [0,20],
                msg : 'Name is too long'
                }
            },
        email: {
            type: sequelize.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
              isEmail: {
                msg: 'Not a Valid email address'
              },
              isUnique: connection.validateIsUnique(
                'email',
                'This email address already exists!'
              )
            }
          },
        password: {
            type : DataTypes.STRING,
            validate : {
                len: [4],
                isAlphanumeric: true,
            }
        },
        location : DataTypes.STRING
    }, {
        instanceMethods: {
          generateHash: function (password) {
            return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
          },
          validPassword: function (password) {
            return bcrypt.compareSync(password, this.password);
          }
        }
    });

    User.associate = (models) => {
        User.belongsToMany(models.Shout, {through : {model: models.UerShout}});
    };
    return User;
};

