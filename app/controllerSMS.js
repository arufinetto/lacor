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



exports.updateInProgressSMS = function(referenceId, code, description, fecha){
    console.log("intenta actualizar el sms")
      SMS.update({
       	referenceId:referenceId
       },

   		{
        $set:{ code: code, description: description, fecha: fecha }

    },function(err,sms){

       console.log("update sms")
   		 //res.status(200).jsonp(sms);

   	});
}


const Queue = require('bull');
const smsQueue = new Queue('smsNotification', 'redis://127.0.0.1:6379');
var Client = require('node-rest-client').Client;
const customerId = "69088F88-661C-45BE-BFA6-4F42A4451D1E";
const apiKey = "TN+9C3H2t60tZw0+gr8Rx9CeKMch8tAddZ93h02VAVJaTjwFE5y1bZqKLXB7pWJuCydNQKEOoaEzHf3ir+t0Ng==";

let data = customerId+":"+apiKey;
let buf = Buffer.from(data);
let encodedData = buf.toString('base64');

exports.process = function(){
 /*smsQueue.process('sms',async (job, result) => {
   console.log(`job ${JSON.stringify(job)}`)
   await update(job)
})*/
console.log("test")
}

function update1(job){
  var referenceId = job.data.referenceId
  var args = { headers: { "Content-Type":"application/x-www-form-urlencoded", "Authorization": 'Basic '+ encodedData} };
  console.log("quiereo ver " + referenceId)
  var client = new Client();
//  client.get("https://rest-api.telesign.com/v1/messaging/" + req.params.referenceId, args, function (data, response) {
  //    console.log("response" + response)
  /*  SMS.update({
      referenceId:referenceId
     },

    {
      $set:{ code: data.status.code, description: data.status.description, fecha: data.status.updated_on }

    },function(err,sms){
     console.log("update sms")
     if (err){
       console.log("error update sms")
     }
     //res.status(200).jsonp(sms);
  });*/
 //})

 client.get("https://rest-api.telesign.com/v1/messaging/" + referenceId, args, function (data, response) {
    // parsed response body as js object
    console.log(data);
    SMS.update({
        referenceId:referenceId
       },

      {
        $set:{ code: data.status.code, description: data.status.description, fecha: data.status.updated_on }

      },function(err,sms){
       console.log("update sms")
       if (err){
         console.log("error update sms")
       }
    });
});
}
