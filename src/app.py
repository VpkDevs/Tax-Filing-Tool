from flask import Flask, request, send_from_directory
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='../static')

@app.route('/')
def home():
    logger.info('Home page accessed')
    return send_from_directory('../', 'index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('../static', path)

@app.route('/service-worker.js')
def serve_service_worker():
    return send_from_directory('../static', 'service-worker.js')

@app.errorhandler(404)
def page_not_found(_):
    logger.warning(f'Page not found: {request.path}')
    return 'Page not found', 404

@app.errorhandler(500)
def server_error(error):
    logger.error(f'Server error: {str(error)}')
    return 'Server error', 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
