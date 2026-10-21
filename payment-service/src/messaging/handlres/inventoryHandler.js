const prisma = require("../../config/prisma.config")
const logger = require("../../utils/logger")
const { publishPaymentFailed } = require("../events/paymentEvents")
const { createPaymentTracker, buildCheckoutUrl } = require('../../config/safepay');

async function inventoryHandler(payload) {
  const orderId = payload.orderId || payload.id;
  const amount = payload.amount ?? payload.total;
  const currency = (payload.currency || 'PKR').toUpperCase();

  if (!orderId || amount == null) {
    throw new Error('order.created payload must contain orderId/id and amount/total');
  }

  const existing = await prisma.payment.findUnique({ where: { orderId: orderId } });
  if (existing) {
    logger.info('Payment already exists for order – skipping', { orderId, status: existing.status });
    return existing;
  }

  const payment = await prisma.payment.create({
    data: {
      orderId: orderId,
      amount,
      currency,
      status: 'PENDING',
    }
  });

  logger.info('Payment record created', { paymentId: payment.id, orderId });

  try {
    
    const { token } = await createPaymentTracker({
      amount,
      currency,
      orderId: orderId,
    });

    const checkoutUrl = buildCheckoutUrl(token, orderId);

    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        safepayTracker: token,
        checkoutUrl,
      },
    });


    return updated;
  } catch (err) {

    const failed = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'FAILED'
      },
    });

    await publishPaymentFailed({
      paymentId: failed.id,
      orderId: failed.orderId,
      amount: Number(failed.amount),
      currency: failed.currency,
      status: failed.status,
    });

    throw err;
  }
}

module.exports = { inventoryHandler }