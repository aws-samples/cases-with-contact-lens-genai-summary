
const { SQSClient, DeleteMessageCommand } = require("@aws-sdk/client-sqs");
const region = process.env.AWS_REGION;

const sqsClient = new SQSClient({ region: region });

const deleteSQS = {
    async delete(queueUrl, receiptHandle) {

		let input ={};
		input.QueueUrl = queueUrl;
		input.ReceiptHandle = receiptHandle;

		//console.log(JSON.stringify(input));

		const command = new DeleteMessageCommand (input);
		const response = await sqsClient.send(command);
 
		//console.log(response);
		return response;
	}
}
module.exports = deleteSQS;