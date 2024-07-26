const cron = require('node-cron');
const Proposal = require('../models/proposal');
const { sendNotificationToAllUsers } = require('../utils/notificationUtils');

// Function to check for upcoming voting deadlines and send notifications
async function checkVotingDeadlines() {
  try {
    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const proposalsEndingSoon = await Proposal.find({
      votingDeadline: { $gt: now, $lte: oneDayFromNow },
      notificationSent: { $ne: true }
    });

    for (const proposal of proposalsEndingSoon) {
      await sendNotificationToAllUsers(
        'VOTING_DEADLINE',
        `Voting deadline approaching for proposal: ${proposal.title}`,
        proposal._id
      );

      // Mark the proposal as having sent a notification
      proposal.notificationSent = true;
      await proposal.save();
    }
  } catch (error) {
    console.error('Error checking voting deadlines:', error);
  }
}

// Schedule the task to run every hour
cron.schedule('0 * * * *', checkVotingDeadlines);

module.exports = {
  checkVotingDeadlines
};