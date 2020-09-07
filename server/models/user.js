'use strict';

const bcryptjs = require('bcryptjs')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

  };
  User.init({
    email: {
      type : DataTypes.STRING,
      allowNull : false,
      unique : true,
      validate :{
        notNull : {
          args : true,
          msg : 'Email tidak boleh kosong'
        },
        notEmpty :{
          args : true,
          msg : 'Email tidak boleh kosong'
        },
        isEmail:{
          args : true,
          msg : 'Mohon masukkan dengan format email'
        }
      }
    },
    password: {
      type : DataTypes.STRING,
      allowNull : false,
      validate :{
        notNull : {
          args : true,
          msg : 'Password tidak boleh kosong'
        },
        notEmpty :{
          args : true,
          msg : 'Password tidak boleh kosong'
        },
        len : {
          args : [5 , 50],
          msg : 'Password Length 5 - 50'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks :{
      beforeCreate(instance , options){

        const salt = bcryptjs.genSaltSync(10);
        instance.password = bcryptjs.hashSync(instance.password, salt)

      }
    }
  });
  return User;
};