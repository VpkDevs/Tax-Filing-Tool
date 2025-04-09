from flask import Flask, render_template, request
import os
import logging
from src.routes.tools import tools_bp
from src.routes.games import games_bp
from src.models import db

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///calculator.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-for-development-only')

# Initialize extensions
db.init_app(app)

# Register blueprints
app.register_blueprint(tools_bp)
app.register_blueprint(games_bp)

@app.route('/')
def home():
    logger.info('Home page accessed')
    return render_template('home.html')

@app.errorhandler(404)
def page_not_found(_):
    logger.warning(f'Page not found: {request.path}')
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(error):
    logger.error(f'Server error: {str(error)}')
    return render_template('500.html'), 500

# Create database tables
@app.before_first_request
def create_tables():
    db.create_all()
    logger.info('Database tables created')

if __name__ == '__main__':
    app.run(debug=True)
