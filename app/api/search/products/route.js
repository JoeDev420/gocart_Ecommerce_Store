const products = await prisma.product.findMany({
  where: {
    store: {
      isActive: true,
    },
    OR: [
      {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        category: {
          contains: q,
          mode: "insensitive",
        },
      },
    ],
  },
  select: {
    id: true,
    name: true,
    images: true,
    category: true,
  },
  take: 6,
  orderBy: {
    createdAt: "desc",
  },
});
