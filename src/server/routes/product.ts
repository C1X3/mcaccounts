import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '@/utils/prisma';

export const productRouter = router({
    // Get all products
    getAll: publicProcedure.query(async () => {
        return await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }),

    // Get a single product by ID
    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            return await prisma.product.findUnique({
                where: { id: input.id },
            });
        }),

    // Create a new product
    create: publicProcedure
        .input(
            z.object({
                name: z.string().min(1),
                description: z.string().min(1),
                price: z.number().min(0),
                stock: z.number().min(0),
                image: z.string().min(1),
                additionalImages: z.array(z.string()),
                category: z.string().min(1),
                badge: z.string(),
                rating: z.number().min(0).max(5),
                features: z.array(z.string()),
            })
        )
        .mutation(async ({ input }) => {
            return await prisma.product.create({
                data: input,
            });
        }),

    // Update an existing product
    update: publicProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(1).optional(),
                description: z.string().min(1).optional(),
                price: z.number().min(0).optional(),
                stock: z.number().min(0).optional(),
                image: z.string().min(1).optional(),
                additionalImages: z.array(z.string()).optional(),
                category: z.string().min(1).optional(),
                badge: z.string().optional(),
                rating: z.number().min(0).max(5).optional(),
                features: z.array(z.string()).optional(),
            })
        )
        .mutation(async ({ input }) => {
            const { id, ...data } = input;
            return await prisma.product.update({
                where: { id },
                data,
            });
        }),

    // Delete a product
    delete: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {
            return await prisma.product.delete({
                where: { id: input.id },
            });
        }),
}); 