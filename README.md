<p align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/file-text.svg" alt="Invoice Builder" width="100" height="100" />
</p>

<h1 align="center">🧾 Invoice Builder</h1>
<h3 align="center">Professional invoice generation with PDF export</h3>

<p align="center">
  <em>Create, manage, and download beautiful invoices in seconds</em>
</p>

<p align="center">
  <a href="https://github.com/Infyneis">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/samy-djemili/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/HeroUI-2.0-7C3AED?style=flat-square" alt="HeroUI" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-6.0-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
</p>

---

## ✨ Overview

A modern, professional **invoice builder** application featuring two distinct modes: **Business** for companies and **Freelancer** for independent professionals. Generate beautiful PDF invoices with a sleek purple-themed UI powered by HeroUI and Tailwind CSS.

<p align="center">
  <img src="https://img.shields.io/badge/📅_Completed-December_18,_2024-A78BFA?style=for-the-badge" alt="Completed" />
  <img src="https://img.shields.io/badge/🎨_Theme-Purple_Modern-7C3AED?style=for-the-badge" alt="Theme" />
</p>

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🏢 **Business Mode** | Full company invoicing with tax IDs, company details, and corporate branding |
| 👤 **Freelancer Mode** | Simplified invoicing for independent professionals with hourly rates |
| 📄 **PDF Export** | Generate professional PDF invoices with react-pdf |
| 🎨 **Modern UI** | Beautiful purple theme with HeroUI components and glassmorphism effects |
| 💾 **Data Persistence** | PostgreSQL database with Prisma ORM for reliable storage |
| 📊 **Invoice Management** | Create, edit, duplicate, and track all your invoices |
| 🧮 **Auto Calculations** | Automatic subtotals, taxes, and grand totals |
| 📱 **Responsive Design** | Works perfectly on desktop, tablet, and mobile |
| 🐳 **Docker Ready** | One-command setup with Docker Compose |

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
      <br>Next.js 16
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
      <br>React 19
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
      <br>Tailwind 4
    </td>
    <td align="center" width="96">
      <img src="https://raw.githubusercontent.com/heroui-inc/heroui/main/apps/docs/public/isotipo.png" width="48" height="48" alt="HeroUI" />
      <br>HeroUI
    </td>
  </tr>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=postgres" width="48" height="48" alt="PostgreSQL" />
      <br>PostgreSQL
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=prisma" width="48" height="48" alt="Prisma" />
      <br>Prisma
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=docker" width="48" height="48" alt="Docker" />
      <br>Docker
    </td>
    <td align="center" width="96">
      <img src="https://react-pdf.org/images/logo.png" width="48" height="48" alt="react-pdf" />
      <br>react-pdf
    </td>
    <td align="center" width="96">
      <img src="https://pnpm.io/img/pnpm-no-name-with-frame.svg" width="48" height="48" alt="pnpm" />
      <br>pnpm
    </td>
  </tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js Frontend                           │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ Invoice Form │  │ Invoice List │  │ PDF Preview/Download  │  │
│  │ (Business/   │  │              │  │                       │  │
│  │  Freelancer) │  │              │  │                       │  │
│  └──────────────┘  └──────────────┘  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                       API Routes (App Router)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Backend Services                           │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │   Invoice    │  │    Client    │  │    PDF Generator      │  │
│  │   Service    │  │   Service    │  │    (react-pdf)        │  │
│  └──────────────┘  └──────────────┘  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │    PostgreSQL     │
                    │    (Docker)       │
                    └───────────────────┘
```

---

## 📂 Project Structure

```
invoice_builder/
├── 🚀 start.sh                      # One-click setup & launch
├── 🐳 docker-compose.yml            # PostgreSQL container
├── 📦 package.json                  # Dependencies
├── 🔧 prisma/
│   └── schema.prisma                # Database schema
├── src/
│   ├── app/
│   │   ├── 🏠 layout.tsx            # Root layout with providers
│   │   ├── 📄 page.tsx              # Dashboard/home page
│   │   ├── api/
│   │   │   ├── 🧾 invoices/         # Invoice CRUD endpoints
│   │   │   ├── 👥 clients/          # Client management
│   │   │   └── 📄 pdf/              # PDF generation endpoint
│   │   └── invoices/
│   │       ├── 📝 new/page.tsx      # Create invoice
│   │       ├── 📋 [id]/page.tsx     # View/edit invoice
│   │       └── 📊 page.tsx          # Invoice list
│   ├── components/
│   │   ├── 📝 invoice-form/         # Invoice form components
│   │   │   ├── business-form.tsx    # Business mode form
│   │   │   ├── freelancer-form.tsx  # Freelancer mode form
│   │   │   └── line-items.tsx       # Invoice line items
│   │   ├── 📄 pdf/                  # PDF template components
│   │   │   ├── invoice-pdf.tsx      # PDF document template
│   │   │   └── pdf-preview.tsx      # In-browser preview
│   │   ├── 🎨 ui/                   # HeroUI components
│   │   └── 📊 dashboard/            # Dashboard widgets
│   ├── lib/
│   │   ├── 🗄️ prisma.ts             # Prisma client
│   │   ├── 📄 pdf.ts                # PDF generation logic
│   │   └── 🔢 calculations.ts       # Invoice calculations
│   └── types/
│       └── 📝 invoice.ts            # TypeScript types
└── public/
    └── 🖼️ templates/                # Invoice templates/logos
```

---

## 🚀 Quick Start

### Prerequisites

- 🐳 **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
- 🟢 **Node.js 18+** - [Download](https://nodejs.org)
- 📦 **pnpm** (recommended) - `npm install -g pnpm`

### One-Command Launch 🎯

```bash
./start.sh
```

This script automatically:

1. ✅ Checks for pnpm, Docker, and Node.js
2. 🐳 Starts PostgreSQL via Docker Compose
3. 📦 Installs npm dependencies
4. 🗄️ Sets up the database with Prisma
5. 🚀 Launches the dev server at **<http://localhost:3000>**

---

## 📖 Invoice Modes

### 🏢 Business Mode

Perfect for companies and corporations:

| Field | Description |
|-------|-------------|
| Company Name | Your business name |
| Tax ID / VAT | Company registration number |
| Company Address | Full business address |
| Bank Details | IBAN, BIC, bank name |
| Logo | Upload company logo |
| Payment Terms | Net 30, Net 60, etc. |

### 👤 Freelancer Mode

Streamlined for independent professionals:

| Field | Description |
|-------|-------------|
| Full Name | Your professional name |
| Professional Title | e.g., "Web Developer" |
| Contact Info | Email, phone, website |
| Hourly Rate | Default rate for calculations |
| Payment Methods | PayPal, bank transfer, etc. |

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| 🟣 Purple 600 | `#7C3AED` | Primary accent |
| 🟣 Purple 500 | `#8B5CF6` | Buttons, links |
| 🟣 Purple 400 | `#A78BFA` | Hover states |
| 🟣 Purple 300 | `#C4B5FD` | Borders, highlights |
| ⚫ Background | `#09090B` | Main background |
| ⚫ Card | `#18181B` | Card backgrounds |
| ⚫ Border | `#27272A` | Borders, dividers |

### Components

- **Glassmorphism cards** with subtle blur effects
- **Gradient accents** on buttons and highlights
- **Smooth animations** with Framer Motion
- **Dark mode first** design approach

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `./start.sh` | Setup everything and start the app |
| `./start.sh --prod` | Build and run production server |
| `./start.sh --build` | Build for production only |
| `./start.sh --db` | Start only database services |
| `./start.sh --stop` | Stop all Docker services |
| `./start.sh --reset` | Reset database (deletes all data) |
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm prisma studio` | Open Prisma database GUI |

---

## 🗄️ Database Schema

```prisma
model Invoice {
  id          String      @id @default(cuid())
  number      String      @unique
  type        InvoiceType @default(BUSINESS)
  status      Status      @default(DRAFT)

  // Sender info
  senderName     String
  senderEmail    String
  senderAddress  String
  senderTaxId    String?

  // Client info
  clientId    String
  client      Client      @relation(fields: [clientId], references: [id])

  // Dates
  issueDate   DateTime    @default(now())
  dueDate     DateTime

  // Items & totals
  items       LineItem[]
  subtotal    Decimal
  taxRate     Decimal     @default(0)
  taxAmount   Decimal
  total       Decimal

  // Metadata
  notes       String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

---

## 🛠️ Manual Setup

<details>
<summary>Click to expand manual setup instructions</summary>

### 1. Clone the repository

```bash
git clone https://github.com/Infyneis/invoice-builder.git
cd invoice-builder
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

### 4. Setup environment

```bash
cp .env.example .env
```

### 5. Initialize database

```bash
pnpm prisma generate
pnpm prisma db push
```

### 6. Start development server

```bash
pnpm dev
```

</details>

---

## 🐛 Troubleshooting

### Database connection failed

```bash
# Check if PostgreSQL is running
docker compose ps

# View logs
docker compose logs postgres

# Restart the container
docker compose down && docker compose up -d
```

### Prisma errors

```bash
# Regenerate Prisma client
pnpm prisma generate

# Reset database (WARNING: deletes all data)
pnpm prisma db push --force-reset
```

### Port 3000 already in use

The start script automatically finds an available port. Or manually:

```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

---

## 🚢 Deployment

### Vercel + Neon/Supabase

1. Push your code to GitHub
2. Import on [Vercel](https://vercel.com)
3. Add PostgreSQL connection string from [Neon](https://neon.tech) or [Supabase](https://supabase.com)
4. Deploy!

### Docker Production

```bash
docker compose -f docker-compose.prod.yml up -d
```

---

## 📄 License

This project is open source and available for personal/educational use.

---

## 🙏 Acknowledgments

- ⚛️ [Next.js](https://nextjs.org) - React framework
- 🎨 [HeroUI](https://heroui.com) - Beautiful React components
- 🎨 [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- 📄 [react-pdf](https://react-pdf.org) - PDF generation
- 🗄️ [Prisma](https://prisma.io) - Database ORM
- 🐳 [Docker](https://docker.com) - Containerization
- 💡 [Lucide](https://lucide.dev) - Beautiful icons

---

<p align="center">
  Made with 💜 by <strong>Samy DJEMILI</strong>
</p>

<p align="center">
  <a href="#top">⬆️ Back to top</a>
</p>
