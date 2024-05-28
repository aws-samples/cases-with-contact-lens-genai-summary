const { ConnectCasesClient, PutCaseEventConfigurationCommand,} = require("@aws-sdk/client-connectcases");
const region = process.env.AWS_REGION;
const connectCasesClient = new ConnectCasesClient({ region: region});

const connectCaseConfiguration = {
  async updateCaseConfiguration(domainId) {
    let input = {};
    input.domainId = domainId;
    let eventBridge = {};
    let includedData = {};

    includedData.relatedItemData = {};
    includedData.relatedItemData.includeContent = true;

    eventBridge.enabled = true;
    eventBridge.includedData = includedData;

    input.eventBridge = eventBridge;

    //console.log(JSON.stringify(input));

    const command = new PutCaseEventConfigurationCommand(input);
    const response = await connectCasesClient.send(command);

    //console.log(response);
    return response;
  }
};
module.exports = connectCaseConfiguration;
