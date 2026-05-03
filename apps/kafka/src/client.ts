import { Kafka, logLevel } from "kafkajs"
import { kafkaEnv } from "@notifyflow/env"

const globalForKafka = globalThis as unknown as {
  kafka: Kafka | undefined;
}

export const kafka = globalForKafka.kafka ?? new Kafka({
  clientId: "notifyflow",
  brokers: [kafkaEnv.KAFKA_BROKER],
  logLevel: logLevel.WARN,
})

if (process.env.NODE_ENV !== "production") globalForKafka.kafka = kafka

