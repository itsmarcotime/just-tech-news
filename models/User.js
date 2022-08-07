const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//create our User model
class User extends Model {
    //set up method to run instance data (per user) to check passsword
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

//define table colums and configuration
User.init(
    {
        //define an id column
        id: {
            //use the special sequelize datatypes to provide what type of data it is
            type: DataTypes.INTEGER,

            //this is the equivalent of sqls "NOT NULL" option
            allowNull: false,

            //instruct that this is the primary key
            primaryKey: true,

            //turn on auto increment
            autoIncrement: true
        },

        //define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },

        //define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,

            //there cannot be any duplicate email values in this table
            unique: true,

            //if allownull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },

        //define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //this means the password must be at least 4 characters long
                len: [4]
            }
        }
    },
    {
        hooks: {
            //set up beforeCreate lifecycle 'hook' functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            //set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },

        //TABLE CONFIGURATION OPTIONS GO HERE 

        //pass in our imported sequelize connection (the direct connection to our database)
        sequelize,

        //dont automactically create creatAt/updateAt timestamp fields
        timestamps: false,

        //dont pluralize name of database table
        freezeTableName: true,

        //use underscores instead of camel-caseing
        underscored: true,

        //make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;