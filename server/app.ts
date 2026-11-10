require("dotenv").config();

import type { NextFunction, Request, Response } from "express";
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { ErrorMiddleware } = require("./middleware/error");

const app = express();

//body parser
app.use(express.json({ limit: "50mb" }));

//cookie parser
app.use(cookieParser());

// cors=> cross origin resource sharing
app.use(
  cors({
    origin: process.env.ORIGIN,
  }),
);

//testing api
app.get("/test", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is working ",
  });
});

// unknown route
app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
  const err: Error & { statusCode?: number } = new Error(
    `Route ${req.originalUrl} not found`,
  );
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);

module.exports = app;
