'use strict';

const {genSaltSync, hash, compare} = require('bcrypt');

/**
 * @public
 * Runs salt rounds to hash string
 * @param {String} [stringToHash] String to be hashed
 * @returns {String} Generated token
 */
const encrypt = async (stringToHash) => {
    const salt = genSaltSync(
        parseInt(process.env.SALT_HASH_ROUNDS)
    );
    
    return await hash(stringToHash, salt);
}

/**
 * @public
 * Compares string with hash to check if 
 * it is indeed previously hashed
 * @param {String} [stringToHash]
 * @param {String} [hash]  
 * @returns {Boolean} 
 */
const isHashMatching = async (stringToHash, hash) => {
    return await compare(stringToHash, hash);
} 

module.exports = { encrypt, isHashMatching };