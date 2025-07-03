import express, { Request } from 'express';

let db = {
    hello: ''
};

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server Running");
})

app.post("/webhook/:userId/:workflowId/:secret", (req, res) => {
    const userId = req.params.userId;
    const workflowId = req.params.workflowId;

    console.log(`Request Recieved for userID: ${userId} & workflowID: ${workflowId}`);

    res.send(`Request Recieved for userID: ${userId} & workflowID: ${workflowId}`);
})

app.listen();
