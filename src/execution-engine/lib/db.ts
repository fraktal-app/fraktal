import { serialize } from 'azle/experimental';

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

export async function fetchWorkflowFromDB(userId: string, workflowId: string){
    try{
        const dbURL = `icp://${process.env.CANISTER_ID_database}`;

        if (!workflowId || !userId) {
            throw new Error("WorkflowId & UserId not found");
        }

        //req.body does not work, so we'll put req info in query by encoding into the URL
        const params = toUrlEncoded({
            workflow_id: workflowId
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
        
        return result;
    }
    catch(error){
        console.log(error)
        throw new Error("Internal Server Error");
    }
}