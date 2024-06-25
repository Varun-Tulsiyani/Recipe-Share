const session = require('express-session');
let mySession;

exports.setMySession = function (req, username) {
    req.session.username = username;
    mySession = req.session;
    console.log("Session Created.");
};

exports.getMySession = function () {
    return mySession.username;
};

exports.deleteSession = function (req) {
    req.session.destroy(err => {
        if (err) {
            console.log("Error destroying session:", err);
        } else {
            mySession = {};
            console.log("Session Deleted.");
        }
    });
};