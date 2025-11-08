import json
import logging
import os
import subprocess
from pathlib import Path

import tornado
from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join
from tornado.web import HTTPError, StaticFileHandler

logger = logging.getLogger(__name__)

# Timeout for subprocess execution (30 seconds)
SUBPROCESS_TIMEOUT = 30


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

            # Execute model card generation
            code_file_path = Path(__file__).resolve()
            main_js_path = os.path.join(
                os.path.dirname(code_file_path),
                "model_card_source",
                "main.js"
            )

            # Verify main.js exists
            if not os.path.exists(main_js_path):
                logger.error(f"main.js not found at {main_js_path}")
                raise HTTPError(500, reason="Model card generator script not found")

            logger.info(f"Generating model card for notebook: {notebook_file_path}")

            # Run subprocess with timeout and proper error handling
            result = subprocess.run(
                ["node", main_js_path, str(notebook_file_path)],
                capture_output=True,
                text=True,
                timeout=SUBPROCESS_TIMEOUT,
                check=False  # Don't raise exception on non-zero exit
            )

            # Check for subprocess errors
            if result.returncode != 0:
                logger.error(
                    f"Model card generation failed with exit code {result.returncode}. "
                    f"stderr: {result.stderr}"
                )
                raise HTTPError(
                    500,
                    reason=f"Model card generation failed: {result.stderr[:200]}"
                )

            # Parse and validate output
            if not result.stdout.strip():
                logger.error("Model card generation produced no output")
                raise HTTPError(500, reason="Model card generation produced no output")

            try:
                data = json.loads(result.stdout)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse model card output as JSON: {e}")
                logger.debug(f"Output was: {result.stdout[:500]}")
                raise HTTPError(
                    500,
                    reason="Model card generation produced invalid JSON output"
                )

            logger.info(f"Successfully generated model card for {notebook_file_path}")
            self.finish(json.dumps(data))

        except HTTPError:
            # Re-raise HTTP errors as-is
            raise
        except subprocess.TimeoutExpired:
            logger.error(f"Model card generation timed out after {SUBPROCESS_TIMEOUT}s")
            raise HTTPError(
                504,
                reason=f"Model card generation timed out after {SUBPROCESS_TIMEOUT} seconds"
            )
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
