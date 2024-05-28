# Amazon Connect Cases - Generative AI call summarization

## Introduction

With generative AI-powered post-contact summarization, you get essential information from customer conversations in a structured, concise, and easy to read format. You can quickly review the summaries and understand the context instead of reading through transcripts and monitoring calls. Your agents save time when they view post-contact summarization associated with Amazon Connect cases.

In this solution for each contact, when the post-contact summarization is available, you attach the post-contact summarization to the case that is created as part of that contact. If a caller had five cases opened in the past, the agent can see all the cases and their respective post-contact summaries. This helps the agent understand the call's circumstances that led to the case being opened efficiently.

## Prerequisites
It is assumed that you understand the use of the services below and you have the following prerequisites:
1. An AWS account with both management console and programmatic administrator access.
2. An existing Amazon Connect instance.
3. Amazon Connect Customer Profiles enabled on Connect Instance.
4. Amazon Connect Cases enabled on Connect Instance. 
5. [Amazon Connect Contact Lens post contact summarization is enabled](https://docs.aws.amazon.com/connect/latest/adminguide/view-generative-ai-contact-summaries.html).

## Architecture diagram 

In the below architecture, there are two mains steps:

Step 1: Whenever an agent creates or updates a Case, Amazon Connect Cases event writes the case ID and the contact ID to Amazon Dynamo DB. 

Step 2: Amazon Connect writes Contact Lens file to Amazon S3, which contains a post-call summary. Amazon S3 event with Contact ID detail is configured to invoke an AWS Lambda function. The AWS Lambda does an Amazon Dynamo DB look up to fetch the Case ID. Amazon Connect Case API is called to add the post-call summary to the Case comments.

![Architecture Diagram](images/cases-with-contact-lens-genai-summary.png?raw=true)

## Walkthrough

1.  Download the content [here](https://github.com/aws-samples/cases-with-contact-lens-genai-summary/archive/refs/heads/main.zip)) and unzip.
2.  Go inside source-code folder and Run "npm install"
3.  Zip the contents of source-code folder with name source-code.zip
4.	Create a new S3 solution bucket in your AWS account.
5.	Upload the source-code zip file (step 3) into S3 Bucket (step 4).
6.	Run the CFT located [here](cft/cases-with-contact-lens-genai-summary-cft.yaml).
7.	Following parameters needed for the CFT:
    1.	ConnectContactLensS3Bucket: Copy the Data storage S3 bucket from the Amazon Connect instance.
    2.	CasesDomainId: Copy the case domain ID from the Amazon Connect instance.
    3.	SolutionSourceBucket: Solution bucket name created in step 4

![CloudFormation Template Screenshot](images/cft-screenshot2.png?raw=true)

8.	Once CloudFormation execution is successful, configure the Amazon S3 event.
    1. Navigate to Amazon Connect S3 data store bucket (step 7.1)

    2. Click on Properties
![Properties](images/b-s3Bucket.png?raw=true)

    3. Click on Create event notification
![Properties](images/c-event.png?raw=true)

    4. Configure one of the following option
        1. Option 1: With Contact Lens redaction turned on, configure two events for the respective channel
           
            For Voice channel
           
                Enter a logical event name, e.g. cases-voice-sum
                Prefix: Analysis/Voice/Redacted
                Suffix: .json
           
            For Chat channel
           
                Enter a logical event name, e.g. cases-chat-sum
                Prefix: Analysis/Chat/Redacted
                Suffix: .json
        3. Option 2: With NO Contact Lens redaction, configure two events for the respective channel
           
            For Voice channel
           
                Enter a logical event name, e.g. cases-voice-sum
                Prefix: Analysis/Voice
                Suffix: .json
           
            For Chat channel
           
                Enter a logical event name, e.g. cases-chat-sum
                Prefix: Analysis/Chat
                Suffix: .json
           
    Screenshot example below
  	
![Properties](images/d-eventname.png?raw=true)

    5. Select Put under vent types
![Properties](images/e-eventtype.png?raw=true)

    6. Under the destination, select Lambda function and specific the AWS lambda function name “<stackname>-CasesEventFunction”
![Properties](images/f-destination.png?raw=true)

## Validate
1. Create or update your cases by placing test call or using the Agent workspace
2. You see Contact ID and Cases event in the Amazon DynamoDB table
3. You see post-contact summary under each Cases comment section in the Agent Workspace Cases view.

![S3 ](images/validate.png?raw=true)

## Conclusion
In this guide, you learned how to associate Amazon Connect Contact Lens’s generative AI powered post-contact summary to Amazon Connect Cases.
