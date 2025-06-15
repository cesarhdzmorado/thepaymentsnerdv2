# ai/src/config.py

from dotenv import load_dotenv
import os

# This line loads the .env file from the project's root directory
load_dotenv()

# We can also define other configurations here if we want
# For example, to make the model name configurable
OPENAI_MODEL_NAME = os.environ.get("OPENAI_MODEL_NAME", "gpt-4-turbo")