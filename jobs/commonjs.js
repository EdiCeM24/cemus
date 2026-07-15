// Implement cleanupExpiredUsers()

// using Sequelize's destroy method combined

// with the Op.lt and Op.or operators.

// Target accounts whose createdAt exceeds a

// specific expiration threshold OR evaluate

// conditional flags (e.g., isVerified === false
// ) to permanently remove unverified/stale
// users from your PostgreSQL database.
// Stack Overflow +1
// javascript

const { Op } = require("sequelize");
const { User } = require("../models"); // Adjust path as needed

async function cleanupExpiredUsers() {
  const EXPIRATION_HOURS = 24;
  const expirationThreshold = new Date(
    Date.now() - EXPIRATION_HOURS * 60 * 60 * 1000,
  );

  try {
    const deletedCount = await User.destroy({
      where: {
        [Op.or]: [
          // Condition 1: Unverified users that have passed the time limit
          {
            isVerified: false,
            createdAt: { [Op.lt]: expirationThreshold },
          },
          // Condition 2: Users logically expired (e.g., temporary tokens/accounts)
          {
            isExpired: true,
          },
        ],
      },
      force: true, // Set to false if utilizing soft-deletes (paranoid mode)
    });

    console.log(
      `Successfully removed ${deletedCount} expired/unverified users.`,
    );
  } catch (error) {
    console.error("Error during user cleanup:", error);
  }
}

module.exports = { cleanupExpiredUsers };
// Use code with caution.
// To run this function automatically on a schedule,
// integrate it with a cron job utility in your Node.js application.
// If you want, tell me:
// Do you use soft-deletes (paranoid tables) in your Sequelize models?
// Would you like to schedule this as an automated Cron job (e.g., running every day at midnight)?
