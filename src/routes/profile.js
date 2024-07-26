const express = require('express');
const router = express.Router();
const multer = require('multer');
const { WalletSDK } = require('@coinbase/waas-sdk');
const config = require('../config');
const ProfileModel = require('../models/profile');

// Initialize Coinbase WaaS SDK
const walletSDK = new WalletSDK(config.coinbaseWaaS);

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Create or update profile
router.post('/update', upload.single('photo'), async (req, res) => {
    try {
        const { firstName, lastName, email, twitter, linkedin, farcaster, areasOfInterest } = req.body;
        const userId = req.user.id; // Assuming user authentication middleware

        // Get wallet information
        const wallet = await walletSDK.getWallet(userId);

        let profileData = {
            userId,
            firstName,
            lastName,
            email,
            twitter,
            linkedin,
            farcaster,
            areasOfInterest: areasOfInterest.split(','),
            walletAddress: wallet.address
        };

        if (req.file) {
            profileData.photoUrl = req.file.path;
        }

        // Update or create profile
        const profile = await ProfileModel.findOneAndUpdate(
            { userId },
            profileData,
            { new: true, upsert: true }
        );

        res.status(200).json({ message: 'Profile updated successfully', profile });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile. Please try again.' });
    }
});

// Get profile
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user authentication middleware

        const profile = await ProfileModel.findOne({ userId });

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.status(200).json({ profile });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to retrieve profile. Please try again.' });
    }
});

module.exports = router;