import './loadEnv'
import { errorHandler } from "@notifyflow/api-utils";
import "./config/container";
import router from "./routes"

import express from 'express'

const app = express()

app.use(express.json())
app.use("/api",router)

app.get('/health',(_,res) => res.json({status:"Ok"}))

app.use(errorHandler)

export default app;
