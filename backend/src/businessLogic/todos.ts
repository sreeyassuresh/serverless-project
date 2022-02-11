import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { AttachmentUtils } from '../dataLayer/attachmentUtils'
import { createLogger } from '../utils/logger'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess()
const attachDetails = new AttachmentUtils()
const logger = createLogger('getTodos')

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    
    logger.info(`fetching items for todos in todos`) 
    return await todoAccess.getAllTodos(userId);
}

export async function createTodo(newTodo: CreateTodoRequest,userId: string): Promise<TodoItem> {
    
    logger.info(`creating items for todo in todos ${JSON.stringify(newTodo)}`)
    const itemId = uuid.v4()

    return await todoAccess.createTodo({
        userId: userId,
        todoId: itemId,
        createdAt: new Date().toISOString(),
        name: newTodo.name,
        dueDate: newTodo.dueDate,             
        done: false,
        attachmentUrl: ''       
    })
}

export async function updateTodo(updateTodo: UpdateTodoRequest,todoId: string, userId: string) {
    
    logger.info(`updating items for todos in todos ${JSON.stringify(updateTodo)}`)
    return await todoAccess.updateTodo({
        name: updateTodo.name,
        dueDate: updateTodo.dueDate,             
        done: updateTodo.done,    
    }, todoId, userId)
}

export async function deleteTodo(todoId: string, userId: string) {
    logger.info(`deleting items for todos in todos ${todoId}`)
    return await todoAccess.deleteTodo(todoId, userId)
}

export async function createAttachmentPresignedUrl(todoId: string, userId: string) : Promise<string> {
    logger.info(`creating signed url for todo in todos ${todoId}`)
		const imageId = uuid.v4()
    const url = await attachDetails.createAttachmentPresignedUrl(imageId);
		await todoAccess.updateTodoImageURL(imageId,todoId,userId);
		return url;

}


