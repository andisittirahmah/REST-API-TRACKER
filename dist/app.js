import express from "express";
import trackerRoutes from "./routes/tracker-route.js";
import errorMiddleware from "./middleware/error.js";
import notFoundMiddleware from "./middleware/not-found.js";
const app = express();
const PORT = 8000;
app.use(express.json());
app.use(trackerRoutes);
app.use(errorMiddleware);
app.use(notFoundMiddleware);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
