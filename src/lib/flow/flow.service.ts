import crypto from 'crypto';

type CreateOrderParams = {
    amount: number;
    email: string;
    subject: string;
    urlConfirmation: string;
    urlReturn?: string;
};

const API_BASE = process.env.FLOW_ENVIRONMENT === 'production'
    ? 'https://www.flow.cl/api'
    : 'https://sandbox.flow.cl/api';

function generateSignature(params: Record<string, string>, secretKey: string): string {
    const keys = Object.keys(params).sort();
    const toSign = keys.map(key => `${key}${params[key]}`).join('');
    return crypto.createHmac('sha256', secretKey).update(toSign).digest('hex');
}

export const FlowService = {
    async createOrder(params: CreateOrderParams) {
        let apiKey = process.env.FLOW_API_KEY || '';
        let secretKey = process.env.FLOW_SECRET_KEY || '';
        apiKey = apiKey.trim();
        secretKey = secretKey.trim();

        console.log('[Flow] API key length:', apiKey.length);
        console.log('[Flow] Secret key length:', secretKey.length);
        console.log('[Flow] Environment:', process.env.FLOW_ENVIRONMENT);

        if (!apiKey || !secretKey) {
            return { success: false, error: 'Payment service not configured (missing keys)' };
        }

        const commerceOrder = `RES-${Date.now()}`;
        const currency = 'CLP';

        const requestParams: Record<string, string> = {
            apiKey,
            commerceOrder,
            amount: params.amount.toString(),
            subject: params.subject,
            email: params.email,
            currency,
            urlConfirmation: params.urlConfirmation,
            urlReturn: params.urlReturn || params.urlConfirmation,
        };

        const s = generateSignature(requestParams, secretKey);
        const bodyParams = { ...requestParams, s };
        const body = new URLSearchParams(bodyParams).toString();

        console.log('[Flow] Request body (first 200):', body.substring(0, 200));

        try {
            const response = await fetch(`${API_BASE}/payment/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body,
            });
            const json = await response.json();
            console.log('[Flow] Create response:', json);

            if (json.token && json.url) {
                const paymentUrl = `${json.url}?token=${json.token}`;
                return { success: true, token: json.token, url: paymentUrl };
            }

            const errorMsg = json.message || json.error || 'Error desconocido de Flow';
            return { success: false, error: errorMsg };
        } catch (err: any) {
            console.error('[Flow] Request error:', err);
            return { success: false, error: err.message };
        }
    },

    async getPaymentStatus(token: string) {
        let apiKey = process.env.FLOW_API_KEY || '';
        let secretKey = process.env.FLOW_SECRET_KEY || '';
        apiKey = apiKey.trim();
        secretKey = secretKey.trim();
        if (!apiKey || !secretKey) {
            return { success: false, error: 'Payment service not configured' };
        }

        const requestParams: Record<string, string> = { apiKey, token };
        const s = generateSignature(requestParams, secretKey);

        // ✅ GET with query params instead of POST with body
        const query = new URLSearchParams({ ...requestParams, s }).toString();

        try {
            const response = await fetch(`${API_BASE}/payment/getStatus?${query}`, {
                method: 'GET',
            });
            const json = await response.json();
            console.log('[Flow] getStatus response (full):', JSON.stringify(json, null, 2));

            // ✅ Flow returns status as a number: 2 = paid, 1 = pending, 3 = rejected, 4 = cancelled
            const isPaid = json.status === 2;

            if (isPaid) {
                return { success: true, status: 'PAID' };
            } else {
                return { success: false, status: json.status, error: json.message || json.error || 'Payment not completed' };
            }
        } catch (err: any) {
            console.error('[Flow] getStatus error:', err);
            return { success: false, error: err.message };
        }
    }
};