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
      /*var smsList = sms
      if(smsList.length == 0) return res.status(200).jsonp("Never try")
      for(var i=0; i<smsList.length;i++){
        if(smsList[i].code == 200){
          return res.status(200).jsonp("Sent OK")
        }
      }*/
      return res.status(200).jsonp(sms)

    });
};

//const Queue = require('bull');
//const smsQueue = new Queue('smsNotification', 'redis://127.0.0.1:6379');
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

exports.findWipSMSbyProtocol= function(res) {
  SMS.find({code:290},function(err, sms) {
    if(err) res.send(500, err.message);
      else {
        console.log("respuesta....." + sms)
        var smsList = sms
        for(var i=0; i<smsList.length;i++){
          updateInProgressSMS(smsList[i].referenceId)
        }
      };
    });
};


exports.updateInProgressSMS = function(req,res){
//  var referenceId = job.data.referenceId
  var args = { headers: { "Content-Type":"application/x-www-form-urlencoded", "Authorization": 'Basic '+ encodedData},

  requestConfig: {
       followRedirects:false,//whether redirects should be followed(default,true)
       maxRedirects:3//set max redirects allowed (default:21)
   },
 };
  //console.log("quiereo ver " + referenceId)
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

var referenceId = req.params.referenceId
 client.get("https://rest-api.telesign.com/v1/messaging/" + referenceId, args, function (data, response) {
    // parsed response body as js object
    console.log(data);
    res.status(200).jsonp(data)
    /*SMS.update({
        referenceId:referenceId
       },

      {
        $set:{ code: data.status.code, description: data.status.description, fecha: data.status.updated_on }

      },function(err,sms){
       console.log("update sms")
       if (err){
         console.log("error update sms")
       }
    });*/
});
}

exports.updateSmsText = function(req,res){
  //var sms = { sms: req.body.message}
  // convert JSON object to a string
 // const data = JSON.stringify(sms);
  const fs = require("fs");
  // write file to disk
  fs.writeFile("./app/sms.txt", req.body.message, (err) => {

      if (err) {
          console.log(`Error writing file: ${err}`);
            res.status(500).jsonp("File Updated")
      } else {
          console.log(`File is written successfully!`);
          res.status(200).jsonp("File Updated")
      }

  });
}

exports.getSmsText = function(req, res){

  const fs = require("fs");
  // write file to disk
    console.log("algo intenta leer");
  fs.readFile('./app/sms.txt', 'utf8',(err, data) => {
    res.status(200).jsonp(data.split('\n')[0])
 })

}
