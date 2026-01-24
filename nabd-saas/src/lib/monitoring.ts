/**
 * 🚨 Monitoring & Alerting Service
 * Used to send critical system alerts to Discord/Slack webhooks.
 */

const WEBHOOK_URL = process.env.MONITORING_WEBHOOK_URL;

type AlertLevel = 'CRITICAL' | 'HIGH' | 'INFO';

interface AlertMeta {
    [key: string]: string | number | boolean | undefined;
}

export async function sendAlert(level: AlertLevel, message: string, meta: AlertMeta = {}) {
    // 1. Log to server console (Always)
    const timestamp = new Date().toISOString();
    console.log(`[ALERT][${level}] ${message}`, meta);

    // 2. If no webhook is configured, stop here (Dev mode)
    if (!WEBHOOK_URL) return;

    // 3. Prepare color code based on severity
    // Red: 15548997 (Critical), Orange: 15105570 (High), Blue: 3447003 (Info)
    const color = level === 'CRITICAL' ? 15548997 : level === 'HIGH' ? 15105570 : 3447003;

    try {
        // 4. Send to Discord/Slack
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: `🚨 ${level}: ${message}`,
                    description: `**Time:** ${timestamp}\n**Environment:** ${process.env.NODE_ENV}`,
                    color: color,
                    fields: Object.entries(meta).map(([key, value]) => ({
                        name: key,
                        value: String(value),
                        inline: true
                    })),
                    footer: { text: "Nabd Monitoring System" }
                }]
            })
        });
    } catch (error) {
        console.error('Failed to send alert to webhook:', error);
    }
}
