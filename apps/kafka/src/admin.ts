import { Admin } from "kafkajs"
import { kafka } from "./client"
import type { KafkaTopicType } from "./topics"

let admin: Admin | null = null

export const getAdmin = async (): Promise<Admin> => {
  if (!admin) {
    admin = kafka.admin()
    await admin.connect()
    console.log("Kafka admin connected!")
  }
  return admin
}

export const ensureTopics = async (
  topics: KafkaTopicType[],
  options: { numPartitions?: number; replicationFactor?: number } = {}
): Promise<void> => {
  const { numPartitions = 1, replicationFactor = 1 } = options
  const adminClient = await getAdmin()

  const created = await adminClient.createTopics({
    waitForLeaders: true,
    topics: topics.map((topic) => ({
      topic,
      numPartitions,
      replicationFactor,
    })),
  })

  if (created) {
    console.log(`Created Kafka topics: ${topics.join(", ")}`)
  } else {
    console.log(`Kafka topics already exist: ${topics.join(", ")}`)
  }
}

export const disconnectAdmin = async (): Promise<void> => {
  if (admin) {
    await admin.disconnect()
    admin = null
  }
}
