import passport from "passport";
import { Strategy as SteamStrategy } from "passport-steam";
import { UserModel } from "../models/user.model";
import { SteamProfile, UserData } from "../types";
import { v4 as uuidv4 } from "uuid";
import { mariaDB } from "./mariadb";
import TransactionHandler from "../utils/transactionHandler";

/**
 * 세션에 사용자 식별자 저장
 */
passport.serializeUser((user: any, done) => {
  // user는 Steam Strategy의 done(null, user)에서 전달된 UserModel
  done(null, { id: user.id, steamId: user.steamId });
});

/**
 * 세션에서 사용자 식별자 기반으로 사용자 정보 조회
 */
passport.deserializeUser(async (data: any, done) => {
  try {
    const user = await UserModel.findById(data.id, mariaDB);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new SteamStrategy(
    {
      returnURL: process.env.STEAM_RETURN_URL,
      realm: process.env.STEAM_REALM,
      apiKey: process.env.STEAM_API_KEY,
    },
    async (
      identifier: string,
      profile: SteamProfile,
      done: (error: any, user?: any) => void
    ) => {
      try {
        // Steam ID 추출
        const steamId = identifier.split("/").pop();
        if (!steamId) {
          return done(new Error("Steam ID가 올바르지 않습니다."), undefined);
        }

        // 기존 사용자 데이터 조회
        const userData: UserData = {
          uuid: "", // UUID는 나중에 DB에서 생성
          steamId: steamId,
          steamName: profile.displayName,
          avatar: profile.photos[2]?.value || profile._json.avatarfull,
        };

        const user = await TransactionHandler.executeInTransaction(
          mariaDB,
          async (connection) => {
            // 사용자 조회
            const user = await UserModel.findBySteamId(steamId, connection);

            // 기존 사용자가 있다면 그대로 반환
            if (user) {
              return user;
            }

            // 사용자가 없다면 생성
            const userUuid = uuidv4();
            await UserModel.create(
              {
                uuid: userUuid,
                steamId: steamId,
                steamName: profile.displayName,
                avatar: profile.photos[2]?.value || profile._json.avatarfull,
                createdAt: new Date(),
                lastLogin: new Date(),
              },
              connection
            );

            // 생성 후 다시 조회하여 완전한 데이터 반환
            const newUser = await UserModel.findByUuid(userUuid, connection);
            if (!newUser) {
              throw new Error("사용자 생성 후 조회에 실패했습니다.");
            }

            return newUser;
          }
        );

        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

export default passport;
