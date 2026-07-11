import {cache} from "react";
import { db } from "./db";

export const getHeroAlias = cache(async (id) => {
    const heroes = await db.query.heroes.alias()
})