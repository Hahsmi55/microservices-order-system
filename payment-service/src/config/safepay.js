const axios = require('axios');
const logger = require('../utils/logger');


const client = axios.create({
  baseURL: process.env.SAFEPAY_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

async function createPaymentTracker({ amount, currency = 'PKR', orderId }) {
  if (!process.env.SAFEPAY_API_KEY) {
    logger.warn('SAFEPAY_API_KEY not set – using mock tracker for local development');
    const mockToken = `mock_tracker_${orderId}_${Date.now()}`;
    return {
      token: mockToken,
      raw: { mock: true, token: mockToken },
    };
  }

  const amountInLowest = Math.round(Number(amount) * 100);

  try {

    const response = await client.post('/order/v1/init', {
      client: process.env.SAFEPAY_API_KEY,
      amount: amountInLowest,
      currency: currency.toUpperCase(),
      environment: process.env.SAFEPAY_ENVIRONMENT,      
      metadata: {
        order_id: orderId,
      },
    });

    const data = response.data?.data || response.data;
    const token = data?.token || data?.tracker?.token || data?.data?.token;

    if (!token) {
      logger.error('SafePay response missing token', { data: response.data });
      throw new Error('SafePay did not return a payment token');
    }

    logger.info('SafePay tracker created', { orderId, token: token.slice(0, 12) + '...' });
    return { token, raw: response.data };
  } catch (err) {
    const message = err.response?.data?.message || err.message;
    logger.error('SafePay createPaymentTracker failed', {
      orderId,
      status: err.response?.status,
      message,
    });
    throw new Error(`SafePay error: ${message}`);
  }
}

/**
 * Build a hosted checkout URL from a tracker token.
 */
function buildCheckoutUrl(token, orderId) {
  const base =
    process.env.SAFEPAY_ENVIRONMENT === 'sandbox'
      ? 'https://sandbox.api.getsafepay.com/components'
      : 'https://www.getsafepay.com/components';

  const params = new URLSearchParams({
    env: process.env.SAFEPAY_ENVIRONMENT,
    beacon: token,
    source: 'custom',
    order_id: orderId,
    redirect_url: process.env.PAYMENT_SUCCESS_URL,
    cancel_url: process.env.PAYMENT_CANCEL_URL,
  });

  return `${base}?${params.toString()}`;
}

/**
 * Very light signature check placeholder.
 * In production you should verify the webhook signature using your secret.
 */
function verifyWebhookSignature(/* payload, signature */) {
  // TODO: implement real HMAC verification with SAFEPAY_SECRET_KEY
  // For sandbox / demo we accept all webhooks
  return true;
}

module.exports = {
  createPaymentTracker,
  buildCheckoutUrl,
  verifyWebhookSignature,
};
