import express from "express";
import type { Application, Request, Response } from "express";

const PORT = 4000;
const app: Application = express();

app.use(express.json());

app.get("/", (_req: Request, res: Response) => res.send("Express is successfully running!"));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
