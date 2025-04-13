#!/bin/bash

# Print Python version for debugging
python --version

# Print current directory
echo "Current directory: $(pwd)"

# List files in src directory
echo "Files in src directory:"
ls -la src/

# Try to run the app with Flask's development server
echo "Starting the application with Flask..."
python server.py
