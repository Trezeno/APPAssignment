from flask import Flask, render_template, jsonify, request
import json, os

app = Flask(__name__)

# Multi-line comments were ruining the formatting when saving file so
# all done in single line comments for that reason


# Home-page routing, on start up this is what will run
@app.route('/')
def index():
  return render_template('index.html')


# GET method when accessing /api/jobs URL - this will run when any GET command has been run using XHR with
# the url in the @app.route('url') section, read the contents of the job_list.json file, and return it back
# to the client
@app.route('/api/jobs', methods=['GET'])
def jobs():
  site_root = os.path.realpath(os.path.dirname(__file__))
  json_url = os.path.join(site_root, "data", "job_list.json")
  with open(json_url, 'r') as openfile:
    json_object = json.load(openfile)
  return json_object


# PUT method when accessing /api/jobs URL - this will run when any PUT command has been run using XHR with
# the url in the @app.route('url') section. It will check whether the request .is_json and if so, will navigate
# to the .json file on the server and open it, re-writing the contents of the file with the request that was given,
# storing the data this way to be received via a XHR GET request later
@app.route('/api/jobs', methods=['PUT'])
def upload():
  print("Saving jobs list")
  messageOK = jsonify(message="Job List Update SUCCESS")
  messageFail = jsonify(message="Jobs List Update FAILED")
  if request.is_json:
    req = request.get_json()
    print(req)
    site_root = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(site_root, "data", "job_list.json")
    with open(json_url, 'w') as openfile:
      json.dump(req, openfile)
    return messageOK, 200
  else:
    return messageFail, 400


# Code to run the app
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080)
