const {   ConnectCasesClient,   CreateRelatedItemCommand, } = require("@aws-sdk/client-connectcases");
const region = process.env.AWS_REGION;
const connectCasesClient = new ConnectCasesClient({ region: region });

const connectCaseComment = {
  async updateCaseComments(domainId, caseId, commentText) {
    let input = {};
    input.caseId = caseId;
    input.domainId = domainId;
    input.type = "Comment";

    let comment = {};
    comment.body = 'post call summary - '+ commentText;
    comment.contentType = "Text/Plain";

    let content = {};
    content.comment = comment;

    input.content = content;

    const command = new CreateRelatedItemCommand(input);
    const response = await connectCasesClient.send(command);

    return response;
  },
};

module.exports = connectCaseComment;
