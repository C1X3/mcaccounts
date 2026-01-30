import { z } from "zod";
import { prisma } from "@/utils/prisma";
import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import { TRPCError } from "@trpc/server";

export const productRouter = createTRPCRouter({
  getAll: baseProcedure
    .input(
      z.object({
        isHomePage: z.boolean().default(false),
        isProductPage: z.boolean().default(false),
      }),
    )
    .query(async ({ input }) => {
      const raw = await prisma.product.findMany({
        orderBy: { order: "asc" },
        where: {
          ...(input.isHomePage && { hideHomePage: false }),
          ...(input.isProductPage && { hideProductPage: false }),
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          price: true,
          image: true,
          additionalImages: true,
          category: true,
          rating: true,
          badge: true,
          features: true,
          stock: true,
          slashPrice: true,
          hideHomePage: true,
          hideProductPage: true,
          isFeatured: true,
          order: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return raw.map(({ stock: stockArr, ...rest }) => ({
        ...rest,
        stock: stockArr.length,
      }));
    }),
  getBySlugForArticle: baseProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input }) => {
      const product = await prisma.product.findUnique({
        where: { slug: input.slug },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          price: true,
          image: true,
          additionalImages: true,
          category: true,
          rating: true,
          badge: true,
          features: true,
          stock: true,
          slashPrice: true,
          hideHomePage: true,
          hideProductPage: true,
          isFeatured: true,
          order: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!product) return null;

      const { stock: stockArr, ...rest } = product;
      return {
        ...rest,
        stock: stockArr.length,
      };
    }),

  getAllWithStock: adminProcedure.query(async () => {
    return await prisma.product.findMany({
      orderBy: { order: "asc" },
    });
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().min(1),
        price: z.number().min(0),
        stock: z.array(z.string()),
        image: z.string().min(1),
        additionalImages: z.array(z.string()),
        category: z.string().min(1),
        badge: z.string().optional(),
        rating: z.number().min(0).max(5),
        features: z.array(z.string()),
        slashPrice: z.number().optional(),
        hideHomePage: z.boolean().default(false),
        hideProductPage: z.boolean().default(false),
        isFeatured: z.boolean().default(false),
        stripeProductName: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.product.create({
        data: input,
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        price: z.number().min(0).optional(),
        stock: z.array(z.string()).optional(),
        image: z.string().min(1).optional(),
        additionalImages: z.array(z.string()).optional(),
        category: z.string().min(1).optional(),
        badge: z.string().optional(),
        rating: z.number().min(0).max(5).optional(),
        features: z.array(z.string()).optional(),
        slashPrice: z.number().optional(),
        order: z.number().optional(),
        hideHomePage: z.boolean().optional(),
        hideProductPage: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        stripeProductName: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Support users can only update stock
      if (ctx.role === "support") {
        const { id, stock } = input;
        // Check if they're trying to update anything other than stock
        const otherFields = Object.keys(input).filter(
          (key) => key !== "id" && key !== "stock",
        );
        if (otherFields.length > 0) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Support users can only update product stock",
          });
        }
        // Allow stock-only update
        if (stock !== undefined) {
          return await prisma.product.update({
            where: { id },
            data: { stock },
          });
        }
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No stock data provided",
        });
      }

      // Admin can update everything
      const { id, ...data } = input;
      return await prisma.product.update({
        where: { id },
        data,
      });
    }),

  // Stock-only update for support users
  updateStock: adminProcedure
    .input(
      z.object({
        id: z.string(),
        stock: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, stock } = input;
      return await prisma.product.update({
        where: { id },
        data: { stock },
      });
    }),

  updateOrders: adminProcedure
    .input(
      z.object({
        productOrders: z.array(
          z.object({
            id: z.string(),
            order: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const { productOrders } = input;

      // Update products in transaction
      const updates = productOrders.map(({ id, order }) =>
        prisma.product.update({
          where: { id },
          data: { order },
        }),
      );

      await prisma.$transaction(updates);

      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      return await prisma.product.delete({
        where: { id: input.id },
      });
    }),
});
