# TradingView → Telegram Webhook

Servidor serverless para recibir alertas de TradingView y reenviarlas a Telegram.

## Estructura del proyecto

```
tradingview-telegram-webhook/
├── package.json
├── api/
│   └── telegram-webhook/
│       └── index.js
└── README.md
```

## Cómo funciona

1. TradingView envía un POST al webhook cuando se cumple una alerta
2. El servidor recibe los datos, formatea el mensaje y lo envía a Telegram
3. Usa el bot token y chat ID configurados en el código

## Telegram credentials (EN EL CÓDIGO)

Reemplaza en `api/telegram-webhook/index.js`:
- `TELEGRAM_BOT_TOKEN` → tu token del bot de Telegram
- `TELEGRAM_CHAT_ID` → tu chat ID personal

## Desplegar en Vercel

### Opción A: Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Iniciar sesión
vercel login

# Desplegar
cd tradingview-telegram-webhook
vercel
```

### Opción B: GitHub + Vercel

1. Crea un repositorio en GitHub
2. Sube los archivos (git push)
3. Ve a Vercel → "Add New Project" → importa el repositorio
4. Vercel deploya automáticamente

## URL del webhook

Después del despliegue, la URL será algo como:
```
https://tu-proyecto.vercel.app/api/telegram-webhook
```

## Configurar alerta en TradingView

1. Abre tu gráfico en TradingView
2. Crea una alerta (icono de campana)
3. En "Alerta", selecciona "Webhook URL"
4. Pega tu URL de Vercel
5. En el cuerpo del mensaje, envía JSON:

```json
{
  "alert_message": "🔔 ALERTA XAU/USD Long\nZona: 2050.00 - 2051.50\nStop: 2045.00\nTP: 2060.00"
}
```

## Mensajes de prueba

Puedes probar el webhook con curl:

```bash
curl -X POST https://tu-proyecto.vercel.app/api/telegram-webhook \
  -H "Content-Type: application/json" \
  -d '{"alert_message":"🔔 PRUEBA DE ALERTA - TradingView ↔ Telegram"}'
```

## Notas

- El servidor es serverless (Vercel), se ejecuta solo cuando recibe una petición
- No hay servidor permanente, solo la función lambda
- Las credenciales están en el código (puedes moverlas a variables de entorno para mayor seguridad)
