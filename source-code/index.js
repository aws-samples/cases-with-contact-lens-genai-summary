const queueUrl = process.env.queueUrl;
const deleteSQS = require('./sqs/deleteSQS.js') 
const casesLogTable = require('./dynamodb/casesLogTable.js');

exports.handler = async (event) => {   
    for (let i = 0; i < event.Records.length; i++) {
        const eventJson = JSON.parse(event.Records[i].body)
        await processRecords(eventJson);
        await deleteSQS.delete(queueUrl, event.Records[i].receiptHandle);
    }
};

async function processRecords(eventJson){
    const eventId = eventJson.id;
    const eventType = eventJson.detail.eventType;

    if(eventType === 'RELATED_ITEM.CREATED'){
        console.log(eventId, eventType);

        if(eventJson.detail.relatedItem && eventJson.detail.relatedItem.relatedItemType === 'contact'){
            let caseId = eventJson.detail.relatedItem.caseId;
            let contactArn = eventJson.detail.relatedItem.contact.contactArn;
            let channel = eventJson.detail.relatedItem.contact.channel;
            if(caseId && contactArn && channel){
                let contactId = contactArn.split("/").pop();
                console.log(caseId , channel, contactId);
                await casesLogTable.saveInfo(contactId, caseId);
            }
        }
    }
}
