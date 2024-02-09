import geoip2.database
from flask import Flask, jsonify

app = Flask(__name__)

def convert_to_dict(obj):
    """
    Recursively converts a geoip2 response object to a dictionary.
    """
    if hasattr(obj, '__dict__'):
        return {key: convert_to_dict(value) for key, value in obj.__dict__.items() if not key.startswith('_')}
    elif isinstance(obj, list):
        return [convert_to_dict(item) for item in obj]
    else:
        return obj

def getInf(ip):
    with geoip2.database.Reader("./GeoLite2-City.mmdb") as reader:
        resp = reader.city(ip)
        resp_dict = convert_to_dict(resp)
    return resp_dict

@app.route("/<ip>")
def mainp(ip:str):
    try:
        if ip == "favicon.ico":
            return ""
        info = getInf(ip)
        print(info)
        return jsonify(info)
    except Exception as e:
        return jsonify({"erorr":"invalid ip"})

if __name__ == "__main__":
    app.run("0.0.0.0", 4269)
