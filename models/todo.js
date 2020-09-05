'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Todo.init({
    title: {
      type:  DataTypes.STRING,
      allowNull : false,
      validate :{
        notNull : true,
        notEmpty : {
          args : true,
          msg : "Title tidak boleh kosong"
        } 
      }
    },
    description:{
      type:  DataTypes.STRING,
      allowNull : false,
      validate :{
        notNull : true,
        notEmpty : {
          args : true,
          msg : "Description tidak boleh kosong"
        } 
      }
    },
    status: DataTypes.STRING,
    due_date: {
      type : DataTypes.DATE,
      validate :{

        dateValidator( value ){
          
          let date = new Date().getDate()
          let month = new Date().getMonth() + 1
          let year = new Date().getFullYear()

          if(month < 10){
            month = '0' + month
          }

          let newDate = new Date(`${year}-${month}-${date}T07:00`).getTime()
          value = value.getTime()

          if(value < newDate){
            throw new Error('Due date tidak boleh kurang dari hari ini!!!')
          }

        }

      }
    },
    UserId : DataTypes.INTEGER,
    reference : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Todo',
    hooks :{
      beforeCreate(instance , options){
        
          instance.status = 'NOT YET'

      }
    }
  });
  return Todo;
};