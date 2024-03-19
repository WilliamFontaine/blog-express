require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    firstname: {
        type: String,
        required: false,
    },
    lastname: {
        type: String,
        required: false,
    }
}, { timestamps: true });

/**
 * Method called before the save
 */
UserSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await _hashPassword(user.password);}

    return next();

});

/**
 * Method called in order to compare password
 */
UserSchema.methods.comparePassword = function (passwordAttempt, cb) {

    bcrypt.compare(passwordAttempt, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    });

};

async function _hashPassword(password) {
    return await new Promise((res, rej) => {
        bcrypt.genSalt(parseInt(process.env.SALT_FACTOR), (err, salt) => {

            if (err) {
                return rej(err);
            }

            bcrypt.hash(password, salt, (err, hash) => {

                if (err) {
                    return rej(err);
                }

                res(hash);

            });

        });
    });
}
module.exports = mongoose.model('User', UserSchema, 'users');
