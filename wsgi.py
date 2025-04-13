import os
from src.app import app

if __name__ == "__main__":
    try:
        # Try to use waitress if available
        from waitress import serve
        print("Using waitress for WSGI server...")
        serve(app, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
    except ImportError:
        # Fall back to Flask's development server
        print("WARNING: Using Flask development server. Not recommended for production.")
        app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
