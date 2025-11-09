import json
import logging
import os
from pathlib import Path

import tornado
try:
    from jupyter_server.base.handlers import APIHandler
    from jupyter_server.utils import url_path_join
except ImportError:
    from notebook.base.handlers import APIHandler
    from notebook.utils import url_path_join
from tornado.web import HTTPError, StaticFileHandler

# Import the new Python analyzer
from .analyzer import ModelCardGenerator

logger = logging.getLogger(__name__)


class ConfigHandler(APIHandler):
    """Handler for loading and saving model card configuration."""

    @tornado.web.authenticated
    def get(self):
        """Load existing modelcard.config file."""
        try:
            # Get notebook path from query parameter
            notebook_path = self.get_argument('path', None)

            if not notebook_path:
                raise HTTPError(400, reason="Missing 'path' parameter")

            # Validate file extension
            if not notebook_path.endswith(".ipynb"):
                raise HTTPError(400, reason="File must have .ipynb extension")

            # Resolve config path (same directory as notebook)
            notebook_file_path = Path(notebook_path).resolve()
            config_path = notebook_file_path.parent / "modelcard.config"

            logger.info(f"Loading model card config from: {config_path}")

            # Check if config file exists
            if not config_path.exists():
                logger.info(f"No config file found at {config_path}, returning empty config")
                self.finish(json.dumps({"sections": []}))
                return

            # Read config file
            try:
                with open(config_path, 'r', encoding='utf-8') as f:
                    config_data = json.load(f)

                # Ensure config has sections key
                if 'sections' not in config_data:
                    config_data = {"sections": []}

                logger.info(f"Successfully loaded config from {config_path}")
                self.finish(json.dumps(config_data))

            except json.JSONDecodeError as e:
                logger.error(f"Invalid JSON in config file: {e}")
                raise HTTPError(400, reason=f"Invalid config file format: {str(e)}")
            except Exception as e:
                logger.error(f"Failed to read config file: {e}")
                raise HTTPError(500, reason=f"Failed to load configuration: {str(e)}")

        except HTTPError:
            raise
        except Exception as e:
            logger.exception("Unexpected error loading config")
            raise HTTPError(500, reason=f"Internal server error: {str(e)}")

    @tornado.web.authenticated
    def post(self):
        """Save modelcard.config file."""
        try:
            input_data = self.get_json_body()

            # Validate input
            if not input_data or 'path' not in input_data or 'config' not in input_data:
                raise HTTPError(400, reason="Missing 'path' or 'config' parameter in request body")

            notebook_path = input_data['path']
            config_data = input_data['config']

            # Validate file extension
            if not notebook_path.endswith(".ipynb"):
                raise HTTPError(400, reason="File must have .ipynb extension")

            # Resolve config path (same directory as notebook)
            notebook_file_path = Path(notebook_path).resolve()
            config_path = notebook_file_path.parent / "modelcard.config"

            # Security: Ensure we're not writing outside notebook directory
            if not str(config_path).startswith(str(notebook_file_path.parent)):
                raise HTTPError(403, reason="Cannot write config outside notebook directory")

            logger.info(f"Saving model card config to: {config_path}")

            # Write config file
            try:
                with open(config_path, 'w', encoding='utf-8') as f:
                    json.dump(config_data, f, indent=2, ensure_ascii=False)
            except Exception as e:
                logger.error(f"Failed to write config file: {e}")
                raise HTTPError(500, reason=f"Failed to save configuration: {str(e)}")

            logger.info(f"Successfully saved config to {config_path}")
            self.finish(json.dumps({"success": True, "path": str(config_path)}))

        except HTTPError:
            raise
        except Exception as e:
            logger.exception("Unexpected error saving config")
            raise HTTPError(500, reason=f"Internal server error: {str(e)}")


class RouteHandler(APIHandler):
    """Handler for model card generation requests."""

    @tornado.web.authenticated
    def get(self):
        """Health check endpoint."""
        self.finish(json.dumps({"data": "This is /jlcards/hello endpoint!"}))

    @tornado.web.authenticated
    def post(self):
        """Generate model card from notebook path."""
        try:
            input_data = self.get_json_body()

            # Validate input
            if not input_data or 'path' not in input_data:
                raise HTTPError(400, reason="Missing 'path' parameter in request body")

            notebook_path = input_data['path']

            # Validate file extension
            if not notebook_path.endswith(".ipynb"):
                raise HTTPError(400, reason="File must have .ipynb extension")

            # Resolve and validate file path
            notebook_file_path = Path(notebook_path).resolve()

            # Security: Check if file exists and is a file (not directory)
            if not notebook_file_path.exists():
                raise HTTPError(404, reason=f"Notebook file not found: {notebook_path}")

            if not notebook_file_path.is_file():
                raise HTTPError(400, reason="Path must point to a file, not a directory")

            logger.info(f"Generating model card for notebook: {notebook_file_path}")

            # Generate model card using Python analyzer
            try:
                generator = ModelCardGenerator(str(notebook_file_path))
                data = generator.generate()
            except FileNotFoundError as e:
                logger.error(f"Notebook file not found: {e}")
                raise HTTPError(404, reason=f"Notebook file not found: {str(e)}")
            except json.JSONDecodeError as e:
                logger.error(f"Invalid notebook JSON format: {e}")
                raise HTTPError(400, reason=f"Invalid notebook format: {str(e)}")
            except Exception as e:
                logger.exception("Error during model card generation")
                raise HTTPError(500, reason=f"Model card generation failed: {str(e)}")

            logger.info(f"Successfully generated model card for {notebook_file_path}")
            self.finish(json.dumps(data))

        except HTTPError:
            # Re-raise HTTP errors as-is
            raise
        except Exception as e:
            logger.exception("Unexpected error in model card generation")
            raise HTTPError(500, reason=f"Internal server error: {str(e)}")


def setup_handlers(web_app, url_path):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]

    # Prepend the base_url so that it works in a JupyterHub setting
    route_pattern = url_path_join(base_url, url_path, "hello")
    config_pattern = url_path_join(base_url, url_path, "config")
    handlers = [
        (route_pattern, RouteHandler),
        (config_pattern, ConfigHandler)
    ]
    web_app.add_handlers(host_pattern, handlers)

    # Prepend the base_url so that it works in a JupyterHub setting
    doc_url = url_path_join(base_url, url_path, "public")
    doc_dir = os.getenv(
        "JLAB_SERVER_EXAMPLE_STATIC_DIR",
        os.path.join(os.path.dirname(__file__), "public"),
    )
    handlers = [("{}/(.*)".format(doc_url), StaticFileHandler, {"path": doc_dir})]
    web_app.add_handlers(".*$", handlers)
