let argon2;
try {
  argon2 = require("argon2");
} catch (e) {
  argon2 = null;
}
const bcrypt = require("bcryptjs");

/**
 * Hashes a plaintext password using Argon2 (or bcrypt fallback)
 * @param {string} password 
 * @returns {Promise<string>}
 */
async function hashPassword(password) {
  if (argon2) {
    try {
      return await argon2.hash(password, { type: argon2.argon2id });
    } catch (err) {
      console.warn("Argon2 hash failed, using bcrypt fallback:", err.message);
    }
  }
  return await bcrypt.hash(password, 10);
}

/**
 * Verifies a plaintext password against a hash
 * @param {string} hash 
 * @param {string} password 
 * @returns {Promise<boolean>}
 */
async function verifyPassword(hash, password) {
  if (!hash || !password) return false;
  
  if (hash.startsWith("$argon2")) {
    if (argon2) {
      try {
        return await argon2.verify(hash, password);
      } catch (err) {
        console.warn("Argon2 verify error:", err.message);
        return false;
      }
    }
  }
  // Fallback / legacy bcrypt check
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    return hash === password; // last fallback check
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
};
