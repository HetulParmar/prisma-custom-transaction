import express, { Express, NextFunction, Request, Response } from "express";
import env from "./configs/env";
import cors from "cors";
import bodyParser from "body-parser";
import { postRouter } from "./modules/posts/index.routes";

const app: Express = express();
app.use(
	cors({
		origin: "*"
	})
);
app.use(bodyParser.json());

app.use("/posts", postRouter);

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
	res.status(500).json(error);
});

app.listen(env.PORT, () => {
	console.log(`server started: ${env.PORT}`);
});
