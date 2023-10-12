import json

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