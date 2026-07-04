# AlertaCuba — Sistema de Alerta en Tiempo Real

Aplicación web de alertas de emergencia para Cuba. Los administradores emiten alertas desde el panel integrado → todos los usuarios conectados las reciben al instante vía Firebase Realtime Database. Soporta notificaciones push al teléfono (pantalla bloqueada incluida) mediante Firebase Cloud Messaging.

## Stack
- **Frontend**: HTML/CSS/JS puro (single-page app, sin frameworks)
- **Base de datos en tiempo real**: Firebase Realtime Database
- **Push notifications**: Firebase Cloud Messaging (FCM)
- **Datos sísmicos**: USGS GeoJSON feed (sismos en Cuba)
- **Servidor**: Python `http.server` (archivos estáticos)

## Cómo correr
```bash
python3 server.py
```
Abre en http://localhost:5000

## Estructura Firebase (Realtime Database)
```
/alertas/activa       → alerta activa (todos los clientes escuchan aquí)
/alertas/historial/   → historial de alertas emitidas
/config/adminPin      → PIN del panel de administrador (default: 1234)
/tokens/              → tokens FCM de dispositivos suscritos
```

## Panel de administrador
Ir a **Ajustes → Emitir alerta oficial**. PIN por defecto: `1234`.
Para cambiarlo: en Firebase Console → Realtime Database → escribe en `/config/adminPin` el nuevo PIN.

## Notificaciones push en segundo plano (VAPID)
Para que las notificaciones lleguen con la app cerrada:
1. Firebase Console → Configuración del proyecto → Cloud Messaging
2. En "Configuración web" → Generar par de claves (VAPID)
3. Copiar la **clave pública** y pegarla en `index.html` en la constante `VAPID_KEY`

## Reglas de seguridad Firebase (recomendadas)
En Firebase Console → Realtime Database → Reglas:
```json
{
  "rules": {
    "alertas": {
      ".read": true,
      ".write": false,
      "activa": { ".write": "auth != null" },
      "historial": { ".write": "auth != null" }
    },
    "config": { ".read": "auth != null", ".write": "auth != null" },
    "tokens": { ".read": false, ".write": true }
  }
}
```

## Archivos principales
- `index.html` — app completa (UI + lógica + Firebase)
- `firebase-messaging-sw.js` — service worker para push en segundo plano
- `server.py` — servidor HTTP estático

## User preferences
- Idioma: español
- Nombre de la app: AlertaCuba (sin referencias a IA)
- Firebase project: ggggg-f2508
