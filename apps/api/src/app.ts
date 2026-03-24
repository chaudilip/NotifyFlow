import { errorHandler } from "@notifyflow/api-utils";
import "./loadEnv";
import "./config/container";

import express from 'express'

const app = express()

app.use(express.json())

app.get('/health',(_,res) => res.json({status:"Ok"}))

app.use(errorHandler)

export default app;
