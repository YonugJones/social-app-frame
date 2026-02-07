import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  // Clean slate (safe for dev)
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  // 1️⃣ Create users
  const users = await prisma.user.createMany({
    data: [
      { username: 'alice', email: 'alice@example.com', displayName: 'Alice' },
      { username: 'bob', email: 'bob@example.com', displayName: 'Bob' },
      {
        username: 'charlie',
        email: 'charlie@example.com',
        displayName: 'Charlie',
      },
      { username: 'diana', email: 'diana@example.com', displayName: 'Diana' },
      { username: 'eve', email: 'eve@example.com', displayName: 'Eve' },
    ],
  })

  const allUsers = await prisma.user.findMany()

  // 2️⃣ Create posts (10 total)
  const posts = []

  for (let i = 0; i < 10; i++) {
    const author = allUsers[i % allUsers.length]

    const post = await prisma.post.create({
      data: {
        authorId: author.id,
        content: `Post #${i + 1} by ${author.username}`,
      },
    })

    posts.push(post)
  }

  // 3️⃣ Create comments (15 total)
  for (let i = 0; i < 15; i++) {
    const author = allUsers[i % allUsers.length]
    const post = posts[i % posts.length]

    await prisma.comment.create({
      data: {
        authorId: author.id,
        postId: post.id,
        content: `Comment #${i + 1} on post ${post.id.slice(0, 6)}`,
      },
    })
  }

  console.log('🌱 Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
