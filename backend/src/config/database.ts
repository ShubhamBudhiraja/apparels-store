/**
 * MongoDB connection is no longer used.
 * All domain data now lives in PostgreSQL via Prisma.
 */
export const connectDB = async () => {
    console.log("connectDB is a no-op; Prisma handles PostgreSQL");
};
