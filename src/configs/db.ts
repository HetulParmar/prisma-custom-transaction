import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();
const db = {
	users: prismaClient.user,
	posts: prismaClient.post
};
export default db;
