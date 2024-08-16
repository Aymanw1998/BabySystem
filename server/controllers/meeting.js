const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const successResponse = require('../utils/successResponse');
const Meeting = require('../models/meeting');
const sendMessage = require('./sendMessage');

const dayNames = ["א", "ב", "ג", "ד", "ה", "ו", "שבת"];
/**
 * @desc Get all meetings
 * @route GET /api/meeting/
 * @access Public
 */


const getMeetings = asyncHandler(async(req, res, next)=> {
    const meetings = await Meeting.find();
    if(!meetings)
        return next(new errorResponse('DONT HAVE meetings'));
    //return successResponse(req, res, customers);
    return res.status(200).json({
        success: true,
        meetings
    })
})

/**
 * @desc Get single meeting
 * @route GET /api/meeting/:id
 * @access Public
 */
const getMeeting = asyncHandler(async(req, res, next) => {
    const meeting = await Meeting.findOne({_id: req.params.id});
    console.log("meeting", meeting);
    if(meeting.length === 0)
        return next(new errorResponse(`Dont have meeting with id :[${req.params.id}]`));
    return res.status(200).json({
            success: true,
            meeting
        })
        //return successResponse(req, res, customer);
});

/**
 * @desc Create new meeting
 * @route POST /api/meeting/
 * @access Public
 */
const createMeeting = asyncHandler(async(req, res, next) => {
    req.body.type = parseInt(req.body.type);
    console.log("create", req.body);

    //if customer is exist
    const CustomerModel = require('../models/customer');
    const customer = await CustomerModel.findOne({_id: req.body.customer});
    console.log("customer", customer);
    if(!customer){
        return next(new errorResponse(`The customer with id :[${req.body.customer}] is not exist`));
    }
    
    
    let meetingSchema = {
        title: req.body.title,
        customer: req.body.customer,
        date: new Date(req.body.date), 
        status: false,
        text: req.body.text,
        type: req.body.type,
    }
    const Customer = require('./../models/customer');
    let c = await Customer.findOne({_id: meetingSchema.customer});
    console.log("c", c.id, c.firstname +" " + c.lastname, c.phone);
    var d = meetingSchema.date,
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = '' +d.getFullYear(),
    hh = d.getHours(),
    mm = d.getMinutes(); 

    month = (month.length < 2 ? '0' : '') + month;
    day = (day.length < 2 ? '0' : '') + day;
    hh = (hh < 10 ? '0' : '') + hh;
    mm = (mm < 10 ? '0' : '') + mm;
    
    let type = " ";

    switch(req.body.type) {
        case 1: type = "ניובורן";break;
        case 2: type = "גיל שנה"; break;
        case 3: type = req.body.text == "" ? "##" : req.body.text; break;
    }
    const msg = "היי " + c.firstname +" " + c.lastname + "\n" + "קבענו לך צילומי " +  " " + type + "\nבתאריך:" +day +"/" + month + "/" + year + ", יום " + dayNames[meetingSchema.date.getDay()] + " ושעה " + hh+":"+mm + "\nיש להגיע לפני הזמן ב-5 דקות\nביטול לפחות יומיים לפני יום הצילום\nנתראה בקרוב\nפאטמה אלזינאטי"
    const b = {
        text: msg, 
        from: `fatom`,
        to: c.phone,
        }
    await sendMessage.sendMessage(b);
    await Meeting.create(meetingSchema);
    meetingSchema = await Meeting.findOne(meetingSchema);
    return res.status(200).json({
        success: true,
        meetingSchema
    });
});

// @desc    Update meeting
// @route   PUT /api/meeting/:id
// @access  Private with token
const updateMeeting = asyncHandler(async (req, res, next) => {
    req.body.type = parseInt(req.body.type);
    console.log("update", req.body);

    let meeting = await Meeting.findById(req.params.id);
    if(!meeting){
        return next(new errorResponse(`The meeting with id :[${req.params.id}] is not exist`));
    }
    //if customer is exist
    const CustomerModel = require('../models/customer');
    const customer = await CustomerModel.findOne({_id: req.body.customer});
    console.log("customer", customer);
    if(!customer){
        return next(new errorResponse(`The customer with id :[${req.body.customer}] is not exist`));
    }
    //date is empty
    req.body.date = new Date(req.body.date);
    const meetingBySameDate =await Meeting.find({date: req.body.date});
    console.log("meetingBySameDate", meetingBySameDate);
    
    meetingBySameDate.map(m => {
        if(m._id != req.body._id){
            return next(new errorResponse(`We have meeting with same date`));
        }
    })
    let meetingSchema = {
        title: req.body.title,
        customer: req.body.customer,
        date: new Date(req.body.date), 
        status: false,
        text: req.body.text,
        type: req.body.type,
    }
    const Customer = require('./../models/customer');
    let c = await Customer.findOne({_id: meetingSchema.customer});
    console.log("c", c.id, c.firstname +" " + c.lastname, c.phone);
    
    var d = meetingSchema.date,
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear(),
    hh =  d.getHours(),
    mm = d.getMinutes(); 

    month = (month.length < 2 ? '0' : '') + month;
    day = (day.length < 2 ? '0' : '') + day;
    hh = (hh < 10 ? '0' : '') + hh;
    mm = (mm < 10 ? '0' : '') + mm;
    let type = " ";

    switch(req.body.type) {
        case 1: type = "ניובורן";break;
        case 2: type = "גיל שנה"; break;
        case 3: type = req.body.text == "" ? "##" : req.body.text; break;
    }
    const msg = "היי " + c.firstname +" " + c.lastname + "\n" + " שונה לך צילומי" + " " + type + "\nבתאריך:" +day +"/" + month + "/" + year + ", יום " + dayNames[meetingSchema.date.getDay()] + " ושעה " + hh+":"+mm + "\nיש להגיע לפני הזמן ב-5 דקות\nביטול לפחות יומיים לפני יום הצילום\nנתראה בקרוב\nפאטמה אלזינאטי"
    const b = {
        text: msg, 
        from: `fatom`,
        to: c.phone,
        }
        
    await sendMessage.sendMessage(b);
    meeting = await Meeting.findByIdAndUpdate(req.params.id, meetingSchema);
    meeting = await Meeting.findById(req.params.id);
    meetingSchema = meeting;
    return res.status(200).json({
        success: true,
        meetingSchema
    });
});

// @desc    Delete meeting
// @route   DELETE /api/meeting/:id
// @access  Private with token
const deleteMeeting = asyncHandler(async (req, res, next) => {
    let meeting = await Meeting.findById(req.params.id);
    console.log("meeting", meeting);
    if(!meeting)
        return next(new errorResponse(`The customer with id :[${req.params.id}] is not exist`));
        const Customer = require('./../models/customer');
        let c = await Customer.findOne({_id: meeting.customer});
        console.log("c", c);
        if(c){
        var d = meeting.date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hh = d.getHours(),
        mm = d.getMinutes(); 
    
        month = (month.length < 2 ? '0' : '') + month;
        day = (day.length < 2 ? '0' : '') + day;
        hh = (hh < 10 ? '0' : '') + hh;
        mm = (mm < 10 ? '0' : '') + mm;
        switch(parseInt(meeting.type)) {
            case 1: type = "ניובורן";break;
            case 2: type = "גיל שנה"; break;
            case 3: type = meeting.text == "" ? "##" : meeting.text; break;
        }
        const msg = "היי " + c.firstname +" " + c.lastname + "\n" + " בוטל לך צילומי" +  " "+ type + "\nבתאריך:" +day +"/" + month + "/" + year + ", יום " + dayNames[meeting.date.getDay()] + " ושעה " + hh+":"+mm + "\nיש להגיע לפני הזמן ב-5 דקות\nביטול לפחות יומיים לפני יום הצילום\nנתראה בקרוב\nפאטמה אלזינאטי"
        const b = {
            text: msg, 
            from: `fatom`,
            to: c.phone,
            }
        
        console.log("meeting date", meeting.date, new Date(meeting.date));
        console.log("now",Date.now(),new Date(Date.now()) )
        new Date(meeting.date) > new Date(Date.now()) && sendMessage.sendMessage(b);
        }
    await Meeting.deleteOne({_id: req.params.id})
    .then(async()=>{
        const meetings = await Meeting.find();
    return res.status(200).json({
        success: true,
        meetings
    });
    })
    .catch((err) =>{
        if(err)
            return next(new errorResponse('delete failed', 401));
        })   
});

module.exports = {
    getMeeting, getMeetings, createMeeting, updateMeeting, deleteMeeting,
}