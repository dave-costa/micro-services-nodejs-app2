import { PrismaClient } from "@prisma/client"
import amq from "amqplib/callback_api"
import cors from "cors"
import express from "express"

amq.connect(
  "amqps://thpkabcl:8VL91xRpoU-b7t8fQjSHfX2F9djr73Mo@shark.rmq.cloudamqp.com/thpkabcl",
  (error0, connect) => {
    if (error0) {
      throw error0
    }
    connect.createChannel((error1, channel) => {
      if (error1) {
        throw error1
      }
      channel.assertQueue("product_added", { durable: false })
      // precisa disso
      // para cada queue
      // a gente ta vendo se tem a queue
      const server = express()
      const prisma = new PrismaClient()
      server.use(
        cors({
          origin: ["http://localhost:4994", "http://localhost:3000"],
        })
      )
      server.use(express.json())
      server.use(express.urlencoded({ extended: true }))

      channel.consume("product_added", async (msg) => {
        // a gente consome o conteudo da
        // nossa queue

        // para string ->> console.log(msg?.content.toString())

        // a mensagem eh um buffo
        // que a gente converte para string
        if (msg) {
          const received = JSON.parse(msg.content.toString()) // para obj
          const product = {
            other_app_id: received.id,
            title: received.title,
            image: received.image,
            likes: received.likes,
          }
          const productCreatedAppMain = await prisma.product.create({
            data: product,
          })
          console.log(productCreatedAppMain)
        }
      })
      const callListen = () => {
        console.log("server is running on: http://localhost:5050")
      }
      server.listen(5050, callListen)
    })
    process.on("beforeExit", () => {
      console.log("closing")
      connect.close()
    })
  }
)
