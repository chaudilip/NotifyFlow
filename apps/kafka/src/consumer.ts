import { Consumer, EachMessagePayload } from "kafkajs";
import { kafka } from "./client";
import { KafkaTopic } from "./topics";
import { NotificationMessage, publishDlq } from "./producer";

interface CreateConsumerOptions {
  fromBeginning?: boolean,
  maxRetries?: number, // defualt 3 
  retryBackoffMs?: number // default 200ms, doubles each attempt
}

export const createConsumer = async (
  groupId: string,
  handler: (message: NotificationMessage) => Promise<void>,
  options: CreateConsumerOptions = {}
): Promise<Consumer> => {
  const { fromBeginning = false, maxRetries = 3, retryBackoffMs = 200 } = options
  const consumer = kafka.consumer({ groupId })
  await consumer.connect()
  console.log(`Kafka consumer connected with groupId: ${groupId}`)

  await consumer.subscribe({ topic: KafkaTopic.NOTIFICATIONS, fromBeginning: fromBeginning })

  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      if (!message.value) return
      let lastError: unknown = null
      let parsed: NotificationMessage;
      try {
        parsed = JSON.parse(message.value.toString())
      } catch (error) {
        console.error("Failed to parse message value as JSON:", error)
        return;
      }
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          await handler(parsed)
          return;
        }
        catch (err: unknown) {
          lastError = err
          if (attempt < maxRetries) {
            const delay = retryBackoffMs * 2 ** (attempt - 1)
            console.warn(`Error processing message, attempt ${attempt}/${maxRetries}. Retrying in ${delay}ms...`, err)
            await new Promise(r => setTimeout(r, delay)) // exponential backoff
          }
        }
      }
      const err = lastError instanceof Error ? lastError : new Error(String(lastError))
      await publishDlq({
        originalMessage: parsed,
        error: { name: err.name, message: err.message, stack: err.stack },
        attempts: maxRetries,
        failedAt: new Date().toISOString()
      })
      console.error(
        `DLQ: notificationId=${parsed.notificationId} failed after ${maxRetries} attempts. Error: ${err.message}`,
      )
    }
  })
  return consumer
}
