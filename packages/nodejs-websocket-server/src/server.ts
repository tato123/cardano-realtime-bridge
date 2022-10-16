import express from "express";
import expressWs from "express-ws";
import { EventEmitter } from 'node:events';
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";

const myEmitter = new EventEmitter();


// --------------------------------------------------
// Create server
// --------------------------------------------------
const PORT =  9001;

const app = express()
expressWs(app);

app.set("etag", false);
app.disable("x-powered-by");

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

app.get('/health', (req, res) => {
  res.send('ok')
})

app.post("/events", async (req,res) => {
  myEmitter.emit("cardano-event", req.body);
  res.send("ok");
})

app.ws("/", (ws, req) => {
  myEmitter.on("cardano-event", (data) => {
    if (typeof data === 'string' || data instanceof String) {
      ws.send(data)
    } else {
      ws.send(JSON.stringify(data));
    }
  });
})


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Eventuall Back End App listening at http://0.0.0.0:${PORT}`);
});