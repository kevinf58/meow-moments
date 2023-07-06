import express from "express";
import routes from "./routes/authRoutes";
const app = express();
const port = 5000;

app.use(express.json());

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server running on port http://www.localhost:${port}`);
});
