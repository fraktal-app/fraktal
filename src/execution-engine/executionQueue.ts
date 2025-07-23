import { AIActionsHandler } from "./blocks/ai/ai";
import { discordActionHandler } from "./blocks/discord/discord";
import { emailActionsHandler } from "./blocks/email/email";
import { telegramActionsHandler } from "./blocks/telegram/telegram";

// A class that manages execution of queued async tasks
class ExecutionQueue {
    private queue: any[] = [];         // Queue to store tasks
    private isRunning = false;         // Flag to prevent concurrent runs

    constructor() {
        this.queue = [];
        this.isRunning = false;
    }

    // Debug method to view current queue
    public showQueue() {
        return this.queue;
    }

    // Adds a new task to the queue and starts processing if idle
    public add(task: any) {
        this.queue.push(task);

        if (!this.isRunning) {
            this.runNext(); // Fire off the processing loop
        }
    }

    // Processes one task at a time from the queue
    public async runNext() {
        if (this.queue.length === 0) {
            this.isRunning = false;
            return;
        }

        this.isRunning = true;
        const task = this.queue.shift(); // Take the next task

        try {
            // Ensure the task has actions to execute
            if (task.json.actions && task.json.actions.length > 0) {
                const action = task.json.actions.shift(); // Take the first action
                const data = task.data; //Take related state data

                const responseData = await handleAction(action, data); // Handle the action asynchronously

                if(responseData){
                    const label = `${action.id!}.${action.appType!}`

                    //Add message data to workflow
                    task.data = {
                        ...(task.data || {}),
                        [label] : responseData
                    }
                }


                // If there are more actions left, clone and requeue the task
                if (task.json.actions.length > 0) {
                    const clonedTask = JSON.parse(JSON.stringify(task));
                    this.add(clonedTask); // Re-queue for further processing
                }
            }

        } catch (e) {
            console.error("Error while processing task:", e); // Catch any task-level errors
        }

        // Process the next task (awaited to avoid call stack overflow)
        await this.runNext();
    }
}

// Singleton instance of the ExecutionQueue
const instance = new ExecutionQueue();
export default instance;

// Handles an individual action based on its app type
async function handleAction(action: any, data: any){
    console.log(`Handling Action: ${action.appType} & ${action.event}`);
    
    switch (action.appType) {
        case "telegram":
            return await telegramActionsHandler(action, data);

        case "ai":
            return await AIActionsHandler(action, data);

        case "discord":
            return await discordActionHandler(action, data);

        case "email":
            return await emailActionsHandler(action, data);

        default:
            console.error(`Unknown action type: ${action.appType}`);
            break;
    }
}
