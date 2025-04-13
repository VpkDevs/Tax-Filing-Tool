import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='static')

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

@app.route('/service-worker.js')
def serve_service_worker():
    return send_from_directory('static', 'service-worker.js')

@app.errorhandler(404)
def page_not_found(_):
    return 'Page not found', 404

@app.errorhandler(500)
def server_error(error):
    return f'Server error: {str(error)}', 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
