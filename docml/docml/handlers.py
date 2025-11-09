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
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)

    # Prepend the base_url so that it works in a JupyterHub setting
    doc_url = url_path_join(base_url, url_path, "public")
    doc_dir = os.getenv(
        "JLAB_SERVER_EXAMPLE_STATIC_DIR",
        os.path.join(os.path.dirname(__file__), "public"),
    )
    handlers = [("{}/(.*)".format(doc_url), StaticFileHandler, {"path": doc_dir})]
    web_app.add_handlers(".*$", handlers)
