import mysql from "mysql2/promise";
import dotenv from "dotenv"; // 환경 변수 사용한 민감한 정보 관리

// .env 파일 로드
dotenv.config();

// MariaDB 연결
export const mariaDB = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  timezone: "Z",
  connectionLimit: 30,
  supportBigNumbers: true,
  bigNumberStrings: true,
  waitForConnections: true,
  queueLimit: 0,
});

// MariadbPool 연결 확인
mariaDB.getConnection().then(async (conn) => {
  console.log("데이터베이스가 성공적으로 연결되었습니다!");
  conn.release();
});
