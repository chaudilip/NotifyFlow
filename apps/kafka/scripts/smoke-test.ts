
import '../loadEnv'
import { createConsumer } from "../src/consumer"
import { disconnectProducer, NotificationMessage, publishNotification } from "../src/producer";
import { Consumer } from 'kafkajs';

const runId = Date.now()
const message: NotificationMessage = {
  notificationId: `test-notification-${runId}`,
  tenantId: `test-tenant-id-${runId}`,
  channel: "email",
  to: "dilipchau3602@gmail.com",
  subject: "Test Notification",
  body: "This is a test notification message."
}

const main = async () => {
  try {
    let consumer: Consumer | null = null

    consumer = await createConsumer(`smoke-test-group-${runId}`, async (msg: NotificationMessage) => {
      console.log("Received message:", msg)
      if (msg.notificationId !== message.notificationId) return // ignore stale messages from prior runs
      console.log("Smoke test successful! Message received correctly.")
      // Tear down outside eachMessage — disconnect waits for the handler to return,
      // so awaiting it here would deadlock.
      setImmediate(async () => {
        await consumer?.disconnect()
        await disconnectProducer()
        process.exit(0)
      })
    })
    await publishNotification(message)

    setTimeout(() => {
      console.error("Smoke test failed: Message was not received within the expected time.");
      process.exit(1)
    }, 10_000)
  }
  catch (err: unknown) {
    console.error("Error publishing message:", err)
  }
}

main().catch((error) => {
  console.error("Error in smoke test:", error);
  process.exit(1)
})






