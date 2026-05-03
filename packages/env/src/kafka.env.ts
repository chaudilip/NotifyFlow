import { createEnv } from "@t3-oss/env-core";
import { z } from 'zod'

export const kafkaEnv = createEnv({
  server: {
    KAFKA_BROKER: z.string().min(1).default("localhost:9092"),
  },
  runtimeEnv: process.env
})
