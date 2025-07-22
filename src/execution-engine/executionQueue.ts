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

                await handleAction(action, data); // Handle the action asynchronously

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
async function handleAction(action: any, data: any): Promise<void> {
    switch (action.appType) {
        case "telegram":
            console.log(`Handling Action: ${action.appType} & ${action.event}`);
            await telegramActionsHandler(action, data);
            break;

        case "email":
            console.log(`Handling Action: ${action.appType} & ${action.event}`);
            await emailActionsHandler(action);
            break;

        default:
            console.error(`Unknown action type: ${action.appType}`);
            break;
    }
}
