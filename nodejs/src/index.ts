import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// 환경변수 설정
dotenv.config();

const app = express();

// CORS 설정
app.use(
  cors({
    credentials: true,
  })
);

// 기본 라우트 설정
app.get("/", (_req: Request, res: Response) => {
  res.send("Jbank Express Server!");
});

// 서버 시작
const PORT = Number(process.env.PORT);
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
