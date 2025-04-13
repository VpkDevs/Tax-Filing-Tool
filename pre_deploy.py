import subprocess
import sys

# Ensure gunicorn is installed
try:
    import gunicorn
    print("Gunicorn is already installed.")
except ImportError:
    print("Installing gunicorn...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "gunicorn"])
    print("Gunicorn installed successfully.")

print("Pre-deploy script completed successfully.")
