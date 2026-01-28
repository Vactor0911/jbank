import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler";
import bodyParser from "body-parser";
import webRouter from "./routes/jwt";
import passport from "./config/passport";
import "dotenv/config";
import bankRouter from "./routes/bank";

const app = express();

app.set("trust proxy", 2);

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// CORS 설정
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Passport 초기화
app.use(passport.initialize());

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
app.use("/api/v1", webRouter);
app.use("/api/bank/v1", bankRouter);

// 전역 오류 처리 미들웨어 등록
app.use(errorHandler);

// 서버 시작
const PORT = Number(process.env.PORT);
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
