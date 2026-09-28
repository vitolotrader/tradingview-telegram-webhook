// api/telegram-webhook/index.js
export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Credenciales de Telegram
    const TELEGRAM_BOT_TOKEN = '8846708054:***';
    const TELEGRAM_CHAT_ID = '5941016428';

    const data = req.body;

    // Extraer el mensaje de TradingView
    let message = '';

    if (data.alert_message) {
      message = data.alert_message;
    } else if (data.message) {
      message = data.message;
    } else if (data.text) {
      message = data.text;
    } else {
      // Si no hay mensaje específico, mostramos los datos recibidos
      message = `📊 ALERTA TRADINGVIEW\n\n` +
                `Instrumento: ${data.symbol || 'N/A'}\n` +
                `Precio: ${data.price || 'N/A'}\n` +
                `Condición: ${data.condition || 'N/A'}\n` +
                `Hora: ${data.time || new Date().toISOString()}\n\n` +
                `Datos recibidos: ${JSON.stringify(data)}`;
    }

    // Añadir confirmación al mensaje
    const fullMessage = `📊 ALERTA TRADINGVIEW\n\n${message}\n\n✅ Alertas enviadas por Alexis Trading Alert Bot`;

    // Enviar a Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: fullMessage,
        parse_mode: 'HTML'
      })
    });

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error('Error de Telegram:', telegramResult);
      return res.status(500).json({ 
        error: 'Error al enviar a Telegram', 
        details: telegramResult 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Alerta enviada a Telegram',
      telegram_data: telegramResult
    });

  } catch (error) {
    console.error('Error en el webhook:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
}

// Exportar para Vercel serverless functions
export const config = {
  api: {
    bodyParser: false
  }
};
