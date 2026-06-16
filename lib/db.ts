import "server-only";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

//어뎁터 생성(prisma7,설정 객체 url필수)
const adapter = new PrismaBetterSqlite3({
  url: "file:./database.db",
});

//클라이언트 생성(어탭터 주입)
const db = new PrismaClient({ adapter });

export default db;
