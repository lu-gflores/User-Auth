const mongoose = require('mongoose')

const {Schema } =  mongoose;

const UserSchema =  new Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    resetToken: {
        type: String
    },
    resetTokenExp: {
        type: Date
    }
})

UserSchema.pre('save', async function (next) {
    next();
})

const UserModel =  mongoose.model('user', UserSchema);

module.exports = UserModel