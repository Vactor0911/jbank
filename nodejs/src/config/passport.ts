import passport from "passport";
import { Strategy as SteamStrategy } from "passport-steam";
import { UserModel } from "../models/user.model";
import { SteamProfile, UserData } from "../types";

/**
 * 세션에 사용자 식별자 저장
 */
passport.serializeUser((user: any, done) => {
  done(null, user.steamId);
});

/**
 * 세션에서 사용자 식별자 기반으로 사용자 정보 조회
 */
passport.deserializeUser(async (steamId: string, done) => {
  try {
    const user = await UserModel.findBySteamId(steamId);
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
          return done(new Error("Invalid Steam ID"), undefined);
        }

        // 기존 사용자 데이터 조회
        const userData: UserData = {
          uuid: "", // UUID는 나중에 DB에서 생성
          steamId: steamId,
          steamName: profile.displayName,
          avatar: profile.photos?.[2]?.value || profile._json.avatarfull,
          profileUrl: profile._json.profileurl,
        };

        // 사용자 생성 또는 조회
        const user = await UserModel.createOrUpdate(userData);

        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);
