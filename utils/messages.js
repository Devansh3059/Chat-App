var moment = require("moment");          //package for date and time

function formatMessage(username,text){
    return{
        username,
        text,
        time: moment().format("h:mm a")
    };
}
module.exports = formatMessage;
//username,
//text,
//is same as username: username'
//text: text,
//feature of es6
//main objective is to create an object