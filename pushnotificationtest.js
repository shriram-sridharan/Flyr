var gcm = require('node-gcm');
var message = new gcm.Message();
 
//API Server Key
var sender = new gcm.Sender('AIzaSyAvNY6gV1ZEaxwrf7lzuqt80EI9mcmuerw');
var registrationIds = [];
 
// Value the payload data to send...
message.addData('message',"\u270C Peace, Love \u2764 and PhoneGap \u2706!");
message.addData('title','Push Notification Sample' );
message.addData('msgcnt','3'); // Shows up in the notification in the status bar
message.addData('soundname','beep.wav'); //Sound to play upon notification receipt - put in the www folder in app
//message.collapseKey = 'demo';
//message.delayWhileIdle = true; //Default is false
message.timeToLive = 3000;// Duration in seconds to hold in GCM and retry before timing out. Default 4 weeks (2,419,200 seconds) if not specified.
 
// At least one reg id required
registrationIds.push('APA91bHyYscfFlqwW2FsJYb9GXgpcOE4HmQZuux9rPFYTtRWjM5gytU3VPpn9ozqPDQI-HAtF7cju0H-K3t8B3R-rYjrMvOP-H6FMCXY3wdX6iQXaDOba4Usj-rez-ItDssoPGL8NsVeQABt_-3SYrVf0NwTGDvMkw');
 
/**
 * Parameters: message-literal, registrationIds-array, No. of retries, callback-function
 */
sender.send(message, registrationIds, 4, function (result) {
    console.log(result);
});