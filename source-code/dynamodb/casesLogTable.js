const CaseLog = process.env.CaseLog;

const { DynamoDBClient, PutItemCommand, UpdateItemCommand, QueryCommand, ScanCommand} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({});

const casesLogTable = {
  async saveInfo(contactId, caseId) {
    try {
      let paramsIns = {
        TableName: CaseLog,
        Item: {
          contactId: { S: contactId },
          caseId: { S: caseId },
        },
      };
      const command = new PutItemCommand(paramsIns);
      const response = await client.send(command);
    } catch (error) {
      console.log(error);
    }
  },
  async updateInfo(contactId, updateKey, updateValue) {
    try {
      let paramsIns = {
        TableName: CaseLog,
        Key: {
            contactId: { S: contactId },
        },
        UpdateExpression: 'set #updateKey = :updateValue',
        ExpressionAttributeNames: {
            '#updateKey': updateKey,
          },        
        ExpressionAttributeValues: {
          ':updateValue': { S: updateValue },
        },        
      };
      console.log('UpdateItemCommand ',paramsIns);      
      const command = new UpdateItemCommand(paramsIns);
      const response = await client.send(command);
    } catch (error) {
      console.log(error);
    }
  },
  async query(contactId) {
    try {
      let paramsIns = {
        TableName: CaseLog,
        KeyConditionExpression: "contactId = :contactId",
        ExpressionAttributeValues: {
          ":contactId": { S: contactId },
        },
      };
      console.log('QueryCommand ',paramsIns);      
      const command = new QueryCommand(paramsIns);
      const response = await client.send(command);
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  async scan(scanKey, scanValue) {
    let response;
    try {
      let paramsIns = {
        TableName: CaseLog,        
        ExpressionAttributeValues: {
          ':scanValue' : {S: scanValue}
        },
        ExpressionAttributeNames:{
          '#scanKey' : scanKey
        },
        FilterExpression: '#scanKey = :scanValue'
      };
      
      console.log('ScanCommand ',paramsIns);      
      const command = new ScanCommand(paramsIns);
      response = await client.send(command);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    return response;
  },
  async scanTwo(scanKey1, scanValue1, scanKey2, scanValue2) {
    let response;
    try {
      let paramsIns = {
        TableName: CaseLog,        
        ExpressionAttributeValues: {
          ':scanValue1' : {S: scanValue1},
          ':scanValue2' : {S: scanValue2},
        },
        ExpressionAttributeNames:{
          '#scanKey1' : scanKey1,
          '#scanKey2' : scanKey2,
        },
        FilterExpression: '#scanKey1 = :scanValue1 AND #scanKey2 = :scanValue2'
      };
      
      console.log('ScanCommand ',paramsIns);      
      const command = new ScanCommand(paramsIns);
      response = await client.send(command);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    return response;
  },
  async scanThree(scanKey1, scanValue1, scanKey2, scanValue2, scanKey3, scanValue3) {
    let response;
    try {
      let paramsIns = {
        TableName: CaseLog,        
        ExpressionAttributeValues: {
          ':scanValue1' : {S: scanValue1},
          ':scanValue2' : {S: scanValue2},
          ':scanValue3' : {S: scanValue3},
        },
        ExpressionAttributeNames:{
          '#scanKey1' : scanKey1,
          '#scanKey2' : scanKey2,
          '#scanKey3' : scanKey3,
        },
        ScanIndexForward: false,
        FilterExpression: '#scanKey1 = :scanValue1 AND #scanKey2 = :scanValue2 AND #scanKey3 = :scanValue3'
      };
      
      console.log('ScanCommand ',paramsIns);      
      const command = new ScanCommand(paramsIns);
      response = await client.send(command);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    return response;
  },
  async scanAll() {
    let response;
    try {
      let paramsIns = {
        TableName: CaseLog
      };
      
      console.log('ScanCommand ',paramsIns);      
      const command = new ScanCommand(paramsIns);
      response = await client.send(command);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    return response;
  },
};
module.exports = casesLogTable;
