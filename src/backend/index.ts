import { serialize } from 'azle/experimental';
import express, { Request } from 'express';
import z from 'zod';

const app = express();
app.use(express.json());

//Constructing the database canister URL from env variable
const dbURL = `icp://${process.env.CANISTER_ID_database}`;


/**
 * Converts a JS object into a URL-encoded query string.
 * Used because I couldnt get `req.body` to work in Azle Inter-canister calls.
 */
function toUrlEncoded(obj) {
  return Object.entries(obj)
    .map(([key, value]) => 
      encodeURIComponent(key) + '=' + encodeURIComponent(value as string)
    )
    .join('&');
}

/**
 * Parses the encoded ICP canister response
 * Converts char codes to string, then parses it as JSON.
 */
function parseEncodedResponse(obj: Object){
    const result = Object.keys(obj)
        .sort((a, b) => Number(a) - Number(b))   // Ensure correct order
        .map(key => String.fromCharCode(obj[key]))
        .join('');

    return JSON.parse(result);
}

// Zod schema for validating User objects
const userSchema = z.object({
    id: z.string().length(36).nonempty(),                // UUID (36 chars)
    email: z.string().email().nonempty(),                // Must be a valid email
    name: z.string().nonempty(),                         // Name
    provider: z.string().nonempty(),                     // Provider
    avatar_url: z.string().nonempty()                    // URL to avatar image
});

// Zod schema for validating Workflow objects
const workflowSchema = z.object({
    id: z.string().length(36).nonempty(),                      // UUID of workflow
    user_id: z.string().length(36).nonempty(),                 // User UUID
    title: z.string().nonempty(),                              // Title of the workflow
    json: z.string()                                           // Serialized workflow JSON
});

/**
 * GET /canister-ids
 * Returns the current canister IDs - helpful for debugging
 */
app.get("/canister-ids", (req, res) => {
    res.json({
        "fraktail-main": process.env.CANISTER_ID_fraktal_main,
        "database": process.env.CANISTER_ID_database,
        "trigger-engine": process.env.CANISTER_ID_trigger_engine
    })
})

/**
 * POST /create-user
 * Validates incoming user object, serializes it into a query string, and performs an inter-canister HTTP update call
 * TODO: Change to `req.body`
 */
app.post("/create-user", async (req, res) => {

    try{
        const { id, email, name, provider, avatar_url } = req.body;
        const userObj = { id, email, name, provider, avatar_url };

        const validation = userSchema.safeParse(userObj);

        if (!validation.success) {
            return res.status(400).json({ 
                error: validation.error.format() 
            });
        }

        //req.body does not work, so we'll put req info in query by encoding into the URL
        const params = toUrlEncoded(userObj);

        const response = await fetch(dbURL + "/http_request_update", {
            body: serialize({
                candidPath: '/scripts/http_canister.did',
                args: [{
                    url : "/users/create-user?" + params,
                    method : "POST",
                    body : [],
                    headers : [
                         ["Content-Type", "application/json"]
                    ]
                }]
            })
        });
    
        const responseJson = await response.json();
        const result = parseEncodedResponse(responseJson.body)
        res.json(result);
    }
    catch(error){
        console.log(error)
        res.status(500).json({"error": "Internal Server Error"})
    }
})

/**
 * POST /save-workflow
 * Saves a user-defined workflow to the database canister.
 */
app.post("/save-workflow", async (req, res) => {

    try{
        const { id, user_id, title, json } = req.body;
        const workflowObj = { id, user_id, title, json };

        const validation = workflowSchema.safeParse(workflowObj);

        if (!validation.success) {
            return res.status(400).json({ 
                error: validation.error.format() 
            });
        }

        //req.body does not work, so we'll put req info in query by encoding into the URL
        const params = toUrlEncoded(workflowObj);

        const response = await fetch(dbURL + "/http_request_update", {
            body: serialize({
                candidPath: '/scripts/http_canister.did',
                args: [{
                    url : "/workflows/save-workflow?" + params,
                    method : "POST",
                    body : [],
                    headers : [
                         ["Content-Type", "application/json"]
                    ]
                }]
            })
        });
    
        const responseJson = await response.json();
        const result = parseEncodedResponse(responseJson.body)
        res.json(result);
    }
    catch(error){
        console.log(error)
        res.status(500).json({"error": "Internal Server Error"})
    }
})

/**
 * POST /get-workflow
 * Fetches a single workflow by ID from the canister.
 */
app.post("/get-workflow", async (req, res) => {

    try{
        const { workflow_id } = req.body;
        
        if (!workflow_id) {
            return res.status(400).json({ 
                error: "No workflow ID found." 
            });
        }

        //req.body does not work, so we'll put req info in query by encoding into the URL
        const params = toUrlEncoded({
            workflow_id
        });

        const response = await fetch(dbURL + "/http_request_update", {
            body: serialize({
                candidPath: '/scripts/http_canister.did',
                args: [{
                    url : "/workflows/get-workflow?" + params,
                    method : "GET",
                    body : [],
                    headers : [
                         ["Content-Type", "application/json"]
                    ]
                }]
            })
        });
    
        const responseJson = await response.json();
        const result = parseEncodedResponse(responseJson.body)
        res.json(result);
    }
    catch(error){
        console.log(error)
        res.status(500).json({"error": "Internal Server Error"})
    }
})

/**
 * POST /get-workflows-by-user-id
 * Returns all workflows associated with a specific user.
 */
app.post("/get-workflows-by-user-id", async (req, res) => {

    try{
        const { user_id } = req.body;
        
        if (!user_id) {
            return res.status(400).json({ 
                error: "No user ID found." 
            });
        }

        //req.body does not work, so we'll put req info in query by encoding into the URL
        const params = toUrlEncoded({
            user_id
        });

        const response = await fetch(dbURL + "/http_request_update", {
            body: serialize({
                candidPath: '/scripts/http_canister.did',
                args: [{
                    url : "/workflows/get-workflows-by-user-id?" + params,
                    method : "GET",
                    body : [],
                    headers : [
                         ["Content-Type", "application/json"]
                    ]
                }]
            })
        });
    
        const responseJson = await response.json();
        const result = parseEncodedResponse(responseJson.body)
        res.json(result);
    }
    catch(error){
        console.log(error)
        res.status(500).json({"error": "Internal Server Error"})
    }
})
// Serve static frontend files from /dist
app.use(express.static('/dist'));

app.listen();
