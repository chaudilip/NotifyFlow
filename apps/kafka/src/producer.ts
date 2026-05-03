import { Producer } from "kafkajs"
import { kafka } from "./client"
import { KafkaTopic } from "./topics"

export interface NotificationMessage {
  notificationId: string,
  tenantId: string,
  channel: "email" | "sms" | "webhook",
  to: string,
  subject?: string,
  body: string
}

export interface DlqEntry {
  originalMessage: NotificationMessage,
  error: { name: string; message: string; stack?: string },
  attempts: number,
  failedAt: string
}


let producer: Producer | null = null

export const getProducer = async (): Promise<Producer> => {
  if (!producer) {
    producer = kafka.producer(
      {
        allowAutoTopicCreation: false,
        idempotent: true, // no duplicate writes on producer retry
      }
    )
    await producer.connect()
    console.log("Kafka producer connected!")
  }
  return producer
}

export const publishNotification = async (message: NotificationMessage) => {
  const producer = await getProducer()
  await producer.send({
    topic: KafkaTopic.NOTIFICATIONS,
    messages: [
      {
        // key = tenantId so messages from same tenant go to same partition
        // this guarantees ordering per tenant
        key: message.tenantId,
        value: JSON.stringify(message)
      }
    ]
  })
}

export const publishDlq = async (entry: DlqEntry) => {
  const producer = await getProducer()
  await producer.send({
    topic: KafkaTopic.NOTIFICATION_DLQ,
    messages: [
      {
        key: entry.originalMessage.tenantId,
        value: JSON.stringify(entry)
      }
    ]
  })
}

export const disconnectProducer = async () => {
  if (producer) {
    await producer.disconnect();
    producer = null;
  }
}
