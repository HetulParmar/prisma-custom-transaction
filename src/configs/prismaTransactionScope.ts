import { Prisma, PrismaClient } from "@prisma/client";
import * as cls from "cls-hooked";
import { TransactionScope } from "../commons/transactionScope";

export const PRISMA_CLIENT_KEY = "prisma";

export class PrismaTransactionScope implements TransactionScope {
	private readonly prisma: PrismaClient;
	private readonly transactionContext: cls.Namespace;

	constructor(prisma: PrismaClient, transactionContext: cls.Namespace) {
		this.prisma = prisma;
		this.transactionContext = transactionContext;
	}

	async run(fn: () => Promise<void>): Promise<void> {
		const prisma = this.transactionContext.get(
			PRISMA_CLIENT_KEY
		) as Prisma.TransactionClient;

		if (prisma) {
			await fn();
		} else {
			await this.prisma.$transaction(async (prisma) => {
				await this.transactionContext.runPromise(async () => {
					this.transactionContext.set(PRISMA_CLIENT_KEY, prisma);
					try {
						await fn();
					} catch (err) {
						this.transactionContext.set(PRISMA_CLIENT_KEY, null);
						throw err;
					}
				});
			});
		}
	}
}
