# Order Processing System — Saga Pattern (Choreography)

Three independent services, each owning its own Postgres database, coordinated
purely through RabbitMQ events. There is **no orchestrator** — every service
knows only which events it reacts to and which events it publishes. This is
the choreography style of the saga pattern.

## Services

| Service            | Port | Database              | Owns                          |
|--------------------|------|------------------------|--------------------------------|
| order-service      | 4005 | orders-processing      | Order                          |
| inventory-service  | 4006 | inventory-processing   | Product, Reservation           |
| payment-service    | 4007 | payment-processing     | Payment                        |

## The saga

**Happy path**
```
1. order-service     : create Order (PENDING)         --publishes--> ORDER_CREATED
2. inventory-service : reserve stock                   --publishes--> INVENTORY_RESERVED
3. payment-service    : charge order (STUBBED)          --publishes--> PAYMENT_COMPLETED
4. order-service     : consumes PAYMENT_COMPLETED       --> Order CONFIRMED
```

**Compensating path (fires backwards on failure)**
```
inventory-service : not enough stock  --publishes--> INVENTORY_CANCELED
  -> order-service consumes it        --> Order CANCELED

payment-service    : charge declined   --publishes--> PAYMENT_CANCELED
  -> order-service consumes it        --> Order CANCELED
  -> inventory-service consumes it    --> releases the reservation, restores stock
```

Every handler is idempotent (guarded by unique constraints / status checks),
because RabbitMQ delivers "at least once" — a message can be redelivered
after a crash or a nacked message, and handlers must tolerate that safely.

## ⚠️ Payment service is intentionally stubbed

Per the original ask, `payment-service` does **not** integrate a real payment
gateway. `src/messaging/handlres/inventoryHandler.js` fakes a ~70% success
rate with `Math.random()` so you can actually see both the happy path and the
compensation path fire. Swap the `charge()` function for a real gateway call
(Stripe, etc.) when you're ready.

## Running it locally

You'll need Postgres and RabbitMQ running (e.g. via Docker):

```bash
docker run -d --name pg -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16
docker run -d --name rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

Create the three databases (matching each service's `.env`):

```bash
docker exec -it pg psql -U postgres -c "CREATE DATABASE \"orders-processing\";"
docker exec -it pg psql -U postgres -c "CREATE DATABASE \"inventory-processing\";"
docker exec -it pg psql -U postgres -c "CREATE DATABASE \"payment-processing\";"
```

For each service:

```bash
cd order-service      && npm install && npx prisma migrate deploy && npm run dev
cd inventory-service  && npm install && npx prisma migrate deploy && npm run seed && npm run dev
cd payment-service    && npm install && npx prisma migrate deploy && npm run dev
```

(`npm run seed` in inventory-service loads two products — id `1` with 50 units
in stock, id `2` with only 5 units, so you can trigger the insufficient-stock
compensation path just by ordering more than 5 of product `2`.)

## Trying it out

Create an order (this kicks off the saga):

```bash
curl -X POST http://localhost:4005/orders/created \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2, "price": 25}'
```

Check the order's status a moment later:

```bash
curl http://localhost:4005/orders/<id>
```

Check the inventory reservation and payment record for that order:

```bash
curl http://localhost:4006/inventory/reservations/<orderId>
curl http://localhost:4007/payments/<orderId>
```

Trigger the insufficient-stock compensation path (product `2` only has 5 in stock):

```bash
curl -X POST http://localhost:4005/orders/created \
  -H "Content-Type: application/json" \
  -d '{"productId": 2, "quantity": 999, "price": 10}'
```

## Notes on production hardening (not implemented here, by design)

- **Transactional outbox**: right now, if a service commits its DB write and
  then crashes before publishing the event, the saga stalls. A production
  system would write the event to an `outbox` table in the same DB
  transaction and have a separate relay process publish it to RabbitMQ.
- **Dead-letter queues**: a message that keeps failing will currently be
  requeued forever (`nack(msg, false, true)`). Add a DLQ with a retry limit.
- **Real payment gateway integration**, as noted above.
- **Saga timeout**: if payment-service never responds (crash, network
  partition), the order sits in PENDING forever. A production system usually
  adds a timeout that cancels the order after N minutes.
