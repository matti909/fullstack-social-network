# Prisma ORM 8 + Express — setup inicial

Stack: `packages/server` (Express 5 + Apollo Server 5). ORM: Prisma 8 RC
(`prisma@8.0.0-rc.20`, `@prisma/orm-postgres@8.0.0-rc.14`). DB: PostgreSQL
(Neon). Fuente de verdad del modelo: `prisma/contract.prisma`.

## Configuración

- `prisma.config.ts` — apunta el contrato a Postgres vía `DATABASE_URL`:
  `contract: "./prisma/contract.prisma"`, `db: { connection:
  process.env["DATABASE_URL"]! }`.
- `.env` — solo se usa `DATABASE_URL` (cadena del pooler Neon con
  `sslmode=require`). `MONGODB_URI` es legado de Mongoose, ya no aplica.
- `prisma/contract.prisma` — primera línea obligatoria: `// use prisma-8`.
  Sin ella, `contract emit` falla con `CONTRACT.SOURCE_LOAD_FAILED`.

## Sintaxis PSL (Prisma 8, rompe con v7)

- Ya NO existen los atributos `@db.*`. El tipo nativo va en posición de
  tipo: `String @db.VarChar(191)` → `VarChar(191)`, `String @db.Uuid` →
  `Uuid`.
- Excepción: `String @db.Text` → **`String`** a secas (`String` ya se
  almacena como `text`). El diagnóstico que sugiere `Text` es un bug
  conocido: ese tipo no existe y da `PSL_UNRESOLVED_REFERENCE`.
- `@@map("likes")` y `@@unique([userId, postId])` siguen igual.

## Comandos (ejecutar dentro de `packages/server`)

```sh
pnpm prisma contract emit   # valida el PSL y genera prisma/contract.json + prisma/contract.d.ts
pnpm prisma db init         # crea tablas/FKs/índices en la DB (22 ops en el init inicial)
pnpm prisma migration status  # verifica que el espacio esté al día ("No migrations found" = OK tras init)
```

## Modelos migrados (TypeORM → Prisma)

`User`, `Post`, `Comment`, `Like` (`@@map("likes")`), `Notification`.
Detalles en `prisma/contract.prisma`. Decisiones no obvias:

- `Post.likedByAuthUser` NO es columna (se calcula por request en el
  resolver/servicio).
- Doble relación Post↔Comment desambiguada con nombres:
  `"PostComments"` (lista) y `"PostLatestComment"` (OneToOne, `onDelete:
  SetNull`).
- `Like` lleva `@@unique([userId, postId])` (el original TypeORM permitía
  duplicados) y su hook `@AfterInsert createNotification` no tiene
  equivalente en el schema: pasa a código de servicio tras crear el `Like`.
- `Notification.postId` es `Int` plano sin FK, fiel al original.
