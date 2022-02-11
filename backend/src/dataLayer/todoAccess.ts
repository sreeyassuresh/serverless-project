import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const logger = createLogger('TodoAccess')
const XAWS = AWSXRay.captureAWS(AWS)

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly todoTableIndex = process.env.TODOS_USERID_INDEX,
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    ) { }

    async getAllTodos(userId: string): Promise<TodoItem[]> {

        const result = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.todoTableIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        logger.info(`fetched items ${JSON.stringify(items)}`)
        return items as TodoItem[]
    }

    async updateTodo(item: TodoUpdate, todoId: string, userId: string) {
        let rec = await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                'todoId': todoId,
                'userId': userId
            },
            UpdateExpression: "set #name = :r, dueDate = :p, done = :a",
            ExpressionAttributeValues: {
                ":r": item.name,
                ":p": item.dueDate,
                ":a": item.done
            },
            ExpressionAttributeNames: {
                '#name': 'name',
            },
        }).promise()

        logger.info(`updated items for todos in updateTodo $${JSON.stringify(rec)}`)
    }

    async deleteTodo(todoId: string, userId: string) {
        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {
                todoId,
                userId
            }
        }).promise()
        logger.info(`deleted item ${todoId}`)
    }

    async createTodo(item: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todoTable,
            Item: item
        }).promise()
        return item
    }

    async updateTodoImageURL(imageId: string, todoId: string, userId: string) {
			logger.info(`imageId to be updated in the todo table  $${JSON.stringify(imageId)}`)
        let rec = await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                'todoId': todoId,
                'userId': userId
            },
            UpdateExpression: "set  attachmentUrl = :a",
            ExpressionAttributeValues: {
                ":a": `https://${this.bucketName}.s3.amazonaws.com/${imageId}`
            },
        }).promise()
        logger.info(`updated items for todos in updateTodo $${JSON.stringify(rec)}`)
    }
}

function createDynamoDBClient() {
    return new XAWS.DynamoDB.DocumentClient()
}
