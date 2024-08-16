const { request } = require('express');
const mongoose = require('mongoose');

// Define the Meeting Schema
const meetingSchema = new mongoose.Schema({
    title:{
        type: String,
    },
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
    },
    date: {
        type: Date,
        required: [true, "Please add a date by -> new Date(y, m, d, h, m)"],
    }, 
    status: {
        type: Boolean,
    },
    text: {
        type: String,
    },
    type:{
        type: Number,
    }
});

// Create the Meeting model
const Meeting = mongoose.model('meeting', meetingSchema);

module.exports = Meeting;
