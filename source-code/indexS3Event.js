
const connectCaseComment = require('./cases/connectCaseComment.js');
const casesLogTable = require('./dynamodb/casesLogTable.js');
const s3bucket = require('./s3/s3bucket.js');

const domainId = process.env.CasesDomainId;

exports.handler = async function (event, context, callback) {
  let result = {};
  result['output'] = false;
  
  //console.log(JSON.stringify(event));

  for (let i = 0; i < event.Records.length; i++) {
    const record = event.Records[i];

    const bucket = event.Records[i].s3.bucket.name;

    const key = decodeURIComponent(event.Records[i].s3.object.key.replace(/\+/g, ' '));

    let objectBody = await s3bucket.get(bucket, key);

    let objectBodyJson = JSON.parse(objectBody);

    //console.log(JSON.stringify(objectBodyJson));
    
    if(objectBodyJson && objectBodyJson.JobStatus === 'COMPLETED' && objectBodyJson.CustomerMetadata && objectBodyJson.CustomerMetadata.ContactId){
      let ContactId = objectBodyJson.CustomerMetadata.ContactId;

      if(objectBodyJson && objectBodyJson.ConversationCharacteristics && objectBodyJson.ConversationCharacteristics.ContactSummary 
        && objectBodyJson.ConversationCharacteristics.ContactSummary.PostContactSummary && objectBodyJson.ConversationCharacteristics.ContactSummary.PostContactSummary.Content){
          let postCallSummary = objectBodyJson.ConversationCharacteristics.ContactSummary.PostContactSummary.Content;          
          let caseId;

          if(postCallSummary && ContactId){
            let caseLogSummary = await casesLogTable.query(ContactId);
            if(caseLogSummary && caseLogSummary.Items && caseLogSummary.Items[0] && caseLogSummary.Items[0].caseId)
            {
              caseId = caseLogSummary.Items[0].caseId.S;
            }
          }

          if(caseId){
            console.log('loading summary ',ContactId, caseId);
            await connectCaseComment.updateCaseComments(domainId, caseId, postCallSummary);
          }
        }
  
    }
  }

  callback(null, result);
};