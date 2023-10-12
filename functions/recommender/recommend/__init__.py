import logging
import azure.functions as func
from ..common.utils import json_res

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    func.HttpResponse.mimetype = "application/json"

    try:
        if req.method != "GET":
            return json_res(f"{req.method} method not allowed", 405)
        return json_res("Hello from the RECOMMEND function!")
        
    except Exception as e:
        logging.error(e)
        return json_res("An error occurred", 500, e)
