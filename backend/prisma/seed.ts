import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SUBCATEGORIES = [
    "shirts",
    "t-shirts",
    "jeans",
    "bags",
    "jackets",
    "trousers",
    "shorts",
    "shoes",
];

const ROOTS = [
    { name: "Men", slug: "men", sortOrder: 1 },
    { name: "Women", slug: "women", sortOrder: 2 },
    { name: "Kids", slug: "kids", sortOrder: 3 },
];

const toLabel = (slug: string) =>
    slug
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("-");

async function seed() {
    for (const root of ROOTS) {
        let parent = await prisma.category.findFirst({
            where: { slug: root.slug, parentId: null },
        });

        if (!parent) {
            parent = await prisma.category.create({
                data: {
                    name: root.name,
                    slug: root.slug,
                    sortOrder: root.sortOrder,
                },
            });
            console.log(`created root category: ${root.slug}`);
        }

        for (let index = 0; index < SUBCATEGORIES.length; index++) {
            const slug = SUBCATEGORIES[index];
            const existing = await prisma.category.findFirst({
                where: { slug, parentId: parent.id },
            });

            if (!existing) {
                await prisma.category.create({
                    data: {
                        name: toLabel(slug),
                        slug,
                        parentId: parent.id,
                        sortOrder: index + 1,
                    },
                });
                console.log(`created ${root.slug}/${slug}`);
            }
        }
    }

    console.log("category seed complete");
}

seed()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
