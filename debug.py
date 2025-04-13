import os
import sys

# Print current directory
print(f"Current directory: {os.getcwd()}")

# List all files in the current directory
print("\nFiles in current directory:")
for item in os.listdir('.'):
    print(f"- {item}")

# List all files in the src directory if it exists
if os.path.exists('src'):
    print("\nFiles in src directory:")
    for item in os.listdir('src'):
        print(f"- {item}")

# Print Python path
print("\nPython path:")
for path in sys.path:
    print(f"- {path}")

# Print environment variables
print("\nEnvironment variables:")
for key, value in os.environ.items():
    print(f"- {key}: {value}")
