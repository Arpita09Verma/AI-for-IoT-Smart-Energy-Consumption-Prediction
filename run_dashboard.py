#!/usr/bin/env python3
"""
Launcher script for the AI for IoT Smart Energy Consumption Prediction Dashboard.
Starts a local HTTP server and automatically opens the dashboard in the default browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Clean logging
        sys.stderr.write(f"[{self.log_date_time_string()}] {format % args}\n")

def main():
    os.chdir(DIRECTORY)
    # Enable address reuse to avoid port binding errors on fast restart
    socketserver.TCPServer.allow_reuse_address = True
    
    server_address = ("", PORT)
    with socketserver.TCPServer(server_address, Handler) as httpd:
        url = f"http://localhost:{PORT}/index.html"
        print("=" * 70)
        print(" AI FOR IOT SMART ENERGY CONSUMPTION PREDICTION DASHBOARD")
        print("=" * 70)
        print(f" Serving dashboard at: {url}")
        print(f" Serving directory:    {DIRECTORY}")
        print(" Press Ctrl+C in terminal to stop the server.")
        print("=" * 70)
        
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nDashboard server stopped.")

if __name__ == "__main__":
    main()
