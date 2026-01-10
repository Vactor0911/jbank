import Redis from "ioredis";

// Redis 연결
export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  db: Number(process.env.REDIS_DATABASE),
  retryStrategy: (times: number) => {
    // 재시도 횟수가 20회를 넘으면 중단
    if (times > 20) {
      console.error(`Redis 연결 실패: ${times}회 시도 후 중단`);
      return null;
    }

    // 최대 5초 제한
    const delay = Math.min(Math.pow(2, times) * 100, 5000);
    console.log(`Redis 재연결 대기 시간: ${delay}ms (시도 횟수: ${times})`);
    return delay;
  },
});

// Redis 연결 확인
redis.on("error", (err) => {
  console.error("Redis 연결 오류:", err);
});

redis.on("connect", () => {
  console.log("Redis가 성공적으로 연결되었습니다!");
});
