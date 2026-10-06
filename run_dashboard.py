#!/usr/bin/env python3
"""
Launcher script for the AI for IoT Smart Energy Consumption Prediction Dashboard.
Runs the unified backend API & LSTM prediction server, opening the dashboard in the default browser.
"""

import os
import sys
import subprocess
import webbrowser
import threading
import time

DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def find_capable_python():
    """Detects whether current python or py -3.12 has tensorflow and flask installed."""
    try:
        import tensorflow
        import flask
        import flask_cors
        return None  # Current interpreter has all dependencies
    except ImportError:
        pass

    # Check if py -3.12 is available with requirements
    try:
        res = subprocess.run(
            ["py", "-3.12", "-c", "import tensorflow, flask, flask_cors; print('READY')"],
            capture_output=True,
            text=True
        )
        if "READY" in res.stdout:
            return ["py", "-3.12"]
    except Exception:
        pass

    return None

def open_browser_delayed(url, delay=1.5):
    time.sleep(delay)
    print(f"\n[Launcher] Opening dashboard in browser: {url}")
    webbrowser.open(url)

def main():
    os.chdir(DIRECTORY)
    alt_py = find_capable_python()
    if alt_py:
        print("=" * 70)
        print(" AI FOR IOT SMART ENERGY CONSUMPTION PREDICTION DASHBOARD")
        print("=" * 70)
        print("[Launcher] Launching via Python 3.12 environment (TensorFlow + Flask)...")
        threading.Thread(target=open_browser_delayed, args=("http://localhost:8000/",), daemon=True).start()
        cmd = alt_py + [os.path.join(DIRECTORY, "server.py")]
        subprocess.run(cmd)
        return

    threading.Thread(target=open_browser_delayed, args=("http://localhost:8000/",), daemon=True).start()
    import server
    server.run_server()

if __name__ == "__main__":
    main()
