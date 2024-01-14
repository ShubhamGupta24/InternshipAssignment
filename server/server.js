const express = require("express");
const app = express();
const router = require("./routes/auth-route")


//MiddleWare to parse json data
app.use(express.json())


// Mount the Router: To use the router in your main Express app, you can "mount" it at a specific URL prefix
app.use("/api/auth", router);
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
});