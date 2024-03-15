import express, {
  Application,
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./infrastructure/database/dbConfig";
import dotenv from "dotenv";
import path from "path";
import router from "./interface/routes/investor";

const app: Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

dotenv.config({ path: path.resolve(__dirname, "../.env") });

app.use("/api", router);

app.get("*", (req: Request, res: Response) => {
  res.status(404).json({ error: true, message: "request not found" });
  return;
});

connectDB(process.env.MONGODB_CONNECTION_URL || "")
  .then((res) => {
    app.listen(3000, () => {
      console.log(`server is running on port 3000`);
    });
  })
  .catch((error) => {
    console.log({ error, message: "mongodb connection issue" });
  });
