import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // 1. Create or ensure test user exists
    const user = await prisma.user.upsert({
        where: { email: "test@example.com" },
        update: {},
        create: {
            id: "user_123",
            email: "test@example.com",
            password: "password123",
        },
    });

    // 2. Create sample conversation linked to test user
    const conversation = await prisma.conversation.upsert({
        where: { id: "conv_1" },
        update: {},
        create: {
            id: "conv_1",
            title: "Study Session",
            userId: user.id,
        },
    });

    console.log("Database seeded successfully:", { user, conversation });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("Seeding error:", e);
        await prisma.$disconnect();
        process.exit(1);
    });