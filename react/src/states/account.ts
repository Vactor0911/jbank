import { atom } from "jotai";
import type { AccountData } from "../services/accountService";

export const accountDataAtom = atom<AccountData[]>([]);
