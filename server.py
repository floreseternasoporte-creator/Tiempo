#!/usr/bin/env python3
"""Servidor HTTP simple para AlertaCuba (archivos estáticos)."""
import http.server
import socketserver
import os

PORT = 5000

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Headers necesarios para Service Worker y notificaciones
        self.send_header('Service-Worker-Allowed', '/')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def log_message(self, format, *args):
        pass  # silenciar logs de acceso

os.chdir(os.path.dirname(os.path.abspath(__file__)))

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"AlertaCuba corriendo en http://0.0.0.0:{PORT}")
    httpd.serve_forever()
