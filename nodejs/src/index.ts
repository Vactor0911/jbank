import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
import bodyParser from "body-parser";
import { authRouter } from "./routes";

// 환경변수 설정
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

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

// 헬스체크 라우트 설정
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "서버가 정상적으로 작동 중입니다.",
  });
});

// 라우트 정의
app.use("/api/auth", authRouter);

// 전역 오류 처리 미들웨어 등록
app.use(errorHandler);

// 서버 시작
const PORT = Number(process.env.PORT);
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
