const Queue = require('bull');
const smsQueue = new Queue('sms', 'redis://127.0.0.1:6379');
//var SMS = require('./modelo/sms');

/*const sms = async => {
  smsQueue.process('sms',async (job, result) => {
  console.log(`job ${JSON.stringify(job)}`)
  await update(job)
})
}


var Client = require('node-rest-client').Client;
const customerId = "69088F88-661C-45BE-BFA6-4F42A4451D1E";
const apiKey = "TN+9C3H2t60tZw0+gr8Rx9CeKMch8tAddZ93h02VAVJaTjwFE5y1bZqKLXB7pWJuCydNQKEOoaEzHf3ir+t0Ng==";

let data = customerId+":"+apiKey;
let buf = Buffer.from(data);
let encodedData = buf.toString('base64');

function update(job){
  var referenceId = job.data.referenceId
  var args = { headers: { "Content-Type":"application/x-www-form-urlencoded", "Authorization": 'Basic '+ encodedData} };
  console.log("quiereo ver " + referenceId)
  var client = new Client();

 client.get("https://rest-api.telesign.com/v1/messaging/" + referenceId, args, function (data, response) {
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
}*/
//module.exports = sms;
//export default sms;
