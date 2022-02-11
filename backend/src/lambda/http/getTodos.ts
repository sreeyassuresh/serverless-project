import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';
const logger = createLogger('getTodos')
// TODO: Get all TODO items for a current user
export const handler = 
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
     
    const items = await getTodosForUser(getUserId(event));
    logger.info(`fetched items ${JSON.stringify(items)}`)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
         items
      })
    }
  }

