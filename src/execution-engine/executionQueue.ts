class ExecutionQueue{
    
    private queue: any[] = [];
    private isRunning = false;
    
    constructor(){
        this.queue = [];
        this.isRunning = false;
    }

    public showQueue(){
        return this.queue
    }

    public add(task) {
        // Push task and maybe run
        this.queue.push(task);

        if(!this.isRunning){
            this.runNext();
        }
    }

    public async runNext() {
        // Process next task
        if(this.queue.length === 0){
            this.isRunning = false;
            return;
        }

        this.isRunning = true;

        const task = this.queue.shift();

        try{
            //execute task
        } catch(e){
            console.error(e);
        }

        this.runNext();
    }
}

const instance = new ExecutionQueue();
export default instance;