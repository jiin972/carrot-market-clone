import "server-only";
// import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/prisma";
// import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

//어뎁터 생성(prisma7,설정 객체 url필수)
// const adapter = new PrismaBetterSqlite3({
//   url: env("DATABASE_URL"),
// });

// const connectionString = process.env.DATABASE_URL;

// const pool = new Pool({ connectionString });
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

//클라이언트 생성(어탭터 주입)
const db = new PrismaClient({ adapter });

export default db;
