import express from "express";
const PORT = 4000;
const app = express();
app.use(express.json());
app.get("/", (_req, res) => res.send("Express is successfully running!"));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map