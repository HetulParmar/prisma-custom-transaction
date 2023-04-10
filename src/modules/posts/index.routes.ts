import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as cls from "cls-hooked";
import { PrismaTransactionScope } from "../../configs/prismaTransactionScope";
import { TransactionScope } from "../../commons/transactionScope";
import { PrismaClientManager } from "../../configs/prismaClientManager";

export const postRouter = Router();

postRouter.post("/", async (_req: Request, res: Response) => {
	try {
		const transactionContext = cls.createNamespace("transaction");
		const prismaClient = new PrismaClient();
		const transactions: TransactionScope = new PrismaTransactionScope(
			prismaClient,
			transactionContext
		);
		const prismaClientManager = new PrismaClientManager(
			prismaClient,
			transactionContext
		);

		await transactions.run(async () => {
			const prisma = prismaClientManager.getClient();
			const newUsers = await prisma.user.create({
				data: {
					name: "hetul",
					email: "hetul1@gmail.com",
					gender: true,
					phone: 91
				}
			});

			await prisma.post.create({
				data: {
					title: "This is hetul's new blog",
					content: "This is hetul new blog content",
					published: true,
					authorId: newUsers.id + 1
				}
			});
		});

		res.status(200).json({
			success: true
		});
	} catch (error) {
		res.status(500).json({ succes: false, error });
	}
});
