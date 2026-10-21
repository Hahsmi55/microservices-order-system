const prisma = require('../config/prisma.config');
const logger = require('../utils/logger');
const { publishPaymentSucceded, publishPaymentFailed} = require("../messaging/events/paymentEvents")
const { verifyWebhookSignature } = require("../config/safepay")


async function markPaymentSucceeded(orderId, extra = {}) {
  const payment = await prisma.payment.findUnique({
    where: { orderId: String(orderId) },
  });

  if (!payment) {
    throw new Error(`Payment not found for order ${orderId}`);
  }

  if (payment.status === 'SUCCEEDED') {
    return payment; // idempotent
  }

  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: 'SUCCEEDED',
      }
  });

  await publishPaymentSucceded({
    orderId: updated.orderId,
  });

  logger.info('Payment succeeded', { orderId: updated.orderId });
  return updated;
}

async function markPaymentFailed(orderId) {
  const payment = await prisma.payment.findUnique({
    where: { orderId: String(orderId) },
  });

  if (!payment) {
    throw new Error(`Payment not found for order ${orderId}`);
  }

  if (payment.status === 'FAILED' || payment.status === 'CANCELLED') {
    return payment;
  }

  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: 'FAILED'
    },
  });

  await publishPaymentFailed({
    orderId: updated.orderId,
  });

  logger.info('Payment failed', { orderId: updated.orderId, reason });
  return updated;
}


/**
 * SafePay webhook (or redirect success callback).
 * Body can contain: order_id / orderId, tracker, status, etc.
 */
async function handleWebhook(req, res) {
  try {
    const signature = req.headers['x-sfpy-signature'] || req.headers['x-safepay-signature'];
    if (!verifyWebhookSignature(req.body, signature)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const orderId =
      req.body.order_id ||
      req.body.orderId ||
      req.body.reference ||
      req.query.order_id;

    const status = (req.body.status || req.body.event || '').toLowerCase();

    if (!orderId) {
      return res.status(400).json({ error: 'order_id required' });
    }

    if (status.includes('success') || status.includes('paid') || status === 'tracker.completed') {
      await markPaymentSucceeded(orderId, { webhook: req.body });
    } else if (status.includes('fail') || status.includes('cancel')) {
      await markPaymentFailed(orderId, status || 'cancelled via webhook');
    } else {
      // Unknown status – just acknowledge
      logger.info('Webhook received with unhandled status', { orderId, status, body: req.body });
    }

    return res.json({ received: true });
  } catch (err) {
    logger.error('Webhook handler error', { error: err.message });
    return res.status(500).json({ error: err.message });
  }
}

async function getCheckoutUrl(req, res) {

  const orderId = parseInt(req.params.orderId)

  const url = prisma.payment.findFirst({
    where : {
      orderId : orderId
    }
  })

  if( url === undefined || url !== String) {
    return res.json({message : "Could not find checkout url"})
  }

  return res.status(200).json(url)

}

module.exports = {
  markPaymentSucceeded,
  markPaymentFailed,
  handleWebhook,
  getCheckoutUrl
};
