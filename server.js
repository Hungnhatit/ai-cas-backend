import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./src/config/database.js";
import './src/model/associations.js';

import router from './src/routes/index.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(morgan("common"));

// -------< routers >-------
app.get('/', (req, res) => {
  res.send('Welcome to the LightEdu API Database');
})

app.use('/api', router);

// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("Database & tables created!");
//   })
//   .catch((err) => console.error("Error:", err));

sequelize.authenticate()
  .then(() => console.log("✅ Database connected..."))
  .catch(err => console.error("❌ Error: ", err));


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
