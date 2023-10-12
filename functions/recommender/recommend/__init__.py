import json
import logging

import azure.functions as func

def json_res(message: str, status_code: int = 200, error: Exception = None) -> func.HttpResponse:
    body = {
        "status_code": status_code,
        "message": message,
        "error": str(error) if error else None,
    }
    return func.HttpResponse(
        body=json.dumps(body),
        status_code=status_code,
    )

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    func.HttpResponse.mimetype = "application/json"

    try:
        if req.method != "GET":
            return json_res(f"{req.method} method not allowed", 405)
        return json_res("Hello from the recommend function!")
        
    except Exception as e:
        logging.error(e)
        return json_res("An error occurred", 500, e)
