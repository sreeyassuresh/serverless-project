import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils';
import { updateTodo } from '../../businessLogic/todos'
const logger = createLogger('updateTodo')
export const handler = 
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updateTodoReq: UpdateTodoRequest = JSON.parse(event.body)
    if(!todoId) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
           error: 'Todo Id is required'
        })
      }
    }
    // TODO: Implement updating a new TODO item
    logger.info(`recieved item ${JSON.stringify(updateTodo)}`)
    const item = await updateTodo(updateTodoReq, todoId, getUserId(event));
    logger.info(`updated items ${JSON.stringify(item)}`)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
         item
      })
    }
  }


