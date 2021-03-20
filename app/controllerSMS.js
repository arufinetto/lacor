var SMS = require('./modelo/sms');


exports.findSentSMSbyProtocol= function(req, res) {
  SMS.find({$and:[{protocolo:req.params.protocolo, code:200}]},function(err, sms) {
    if(err) res.send(500, err.message);
        res.status(200).jsonp(sms);
    });
};

exports.findSMSbyProtocol= function(req, res) {
  SMS.find({$and:[{protocolo:req.params.protocolo}]},function(err, sms) {
    if(err) res.send(500, err.message);
        res.status(200).jsonp(sms);
    });
};

const customerId = "69088F88-661C-45BE-BFA6-4F42A4451D1E";
const apiKey = "TN+9C3H2t60tZw0+gr8Rx9CeKMch8tAddZ93h02VAVJaTjwFE5y1bZqKLXB7pWJuCydNQKEOoaEzHf3ir+t0Ng==";

exports.updateInProgressSMS = function(req, res){
	var Client = require('node-rest-client').Client;

var client = new Client();
let data = customerId+":"+apiKey;
let buf = Buffer.from(data);
let encodedData = buf.toString('base64');


var args = {
	 headers: { "Content-Type":"application/x-www-form-urlencoded", "Authorization": 'Basic '+ encodedData}
};

client.get("https://rest-api.telesign.com/v1/messaging/" + req.params.referenceId, args, function (data, response) {

    if(data.status.code == 200 ){
      SMS.update({
       	referenceId:req.params.referenceId
       },

   		{
        $set:{ code: data.status.code, description: data.status.description }

    },function(err,sms){

   		 res.status(200).jsonp(sms);

   	});
  }
});
}

//const sendSMSQueue = require('smsNotification');
exports.process = function(){
  //sendSMSQueue.process(async (job) => await console.log(job.data));
}

/*exports.process = function(){
const Queue = require("bull");
const WebScraper = require("./config/smsNotification");

const smsNotificationQueue = new Queue("Fetch Data", process.env.REDIS_URL);

smsNotificationQueue.process("*", async (job) => {
  const { url } = job.data;
  console.log("data in queue " + job.data)
  //const res = await WebScraper(url);

  return res;
});
}*/
