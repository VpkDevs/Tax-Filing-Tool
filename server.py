import os
from src.app import app

if __name__ == "__main__":
    # Get the port from the environment variable or use 5000 as default
    port = int(os.environ.get("PORT", 5000))
    
    # Run the application
    app.run(host="0.0.0.0", port=port)
