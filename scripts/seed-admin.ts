import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.upsert({
    where: { usuario: 'josnei' },
    update: {
      senha: 'Clonar77*'
    },
    create: {
      usuario: 'josnei',
      nome: 'Josnei',
      senha: 'Clonar77*',
      role: 'ADMIN'
    },
  })
  console.log('Admin user created:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
