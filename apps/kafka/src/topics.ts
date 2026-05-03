export const KafkaTopic = {
  NOTIFICATIONS: "notifyflow.notifications",
  NOTIFICATION_DLQ: "notifyflow.notifications.dlq",
} as const

export type KafkaTopicType = typeof KafkaTopic[keyof typeof KafkaTopic]
