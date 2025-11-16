# ElctrDc - Electrochemistry Research OS

> An all-in-one research platform for electrochemistry researchers. Analyze data, manage literature, and accelerate discoveries with AI-powered insights.

![ElctrDc Banner](https://via.placeholder.com/1200x400/2563eb/ffffff?text=ElctrDc+-+Electrochemistry+Research+OS)

## Features

### 🔬 Comprehensive Data Analysis
- **Multi-Technique Support**: CV, EIS, Battery Cycling, Tafel, and more
- **Instrument Compatibility**: BioLogic, Gamry, Neware, Arbin, and generic CSV
- **Publication-Ready Plots**: Interactive Plotly.js visualizations
- **Automated Workflows**: Streamlined analysis pipelines

### 🤖 AI-Powered Research Assistant
- **Context-Aware**: Understands your project, data, and literature
- **Privacy-First**: Runs locally via Ollama (no data leaves your machine)
- **Specialized Analysis**: CV, EIS, and battery cycling expertise
- **Literature Integration**: Compares results to uploaded papers

### 📚 Integrated Project Management
- **Notion-like Interface**: Block-based notes and pages
- **Literature Management**: PDF upload with text extraction
- **Dataset Organization**: Link data to notes and visualizations
- **Workflow Templates**: Battery research, catalysis, corrosion, etc.

### ⚡ Supported Techniques
- Cyclic Voltammetry (CV)
- Electrochemical Impedance Spectroscopy (EIS)
- Battery Charge/Discharge Cycling
- Chronoamperometry (CA)
- Chronopotentiometry (CP)
- Linear Sweep Voltammetry (LSV)
- Tafel Analysis
- Open Circuit Potential (OCP)

## Quick Start

### Prerequisites

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **PostgreSQL** 16+ ([Download](https://www.postgresql.org/download/) or use Docker)
- **Ollama** (for AI features) ([Download](https://ollama.com/download))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/ElctrDc.git
cd ElctrDc

# 2. Run the setup script
chmod +x setup.sh run.sh
./setup.sh

# 3. Configure environment variables
# Edit .env file with your database connection and other settings
nano .env

# 4. Setup Ollama (for AI features)
ollama serve  # In a separate terminal
ollama pull llama3.1:8b
ollama pull mistral:7b

# 5. Start the application
./run.sh
```

The application will be available at `http://localhost:3000`

### Manual Setup (Alternative)

```bash
# Install dependencies
pnpm install

# Setup database
cp .env.example .env
# Edit .env with your DATABASE_URL

# Generate Prisma client and push schema
pnpm prisma generate
pnpm prisma db push

# Start development server
pnpm dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/elctrdc?schema=public"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# File Storage (Vercel Blob or AWS S3)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Ollama AI
OLLAMA_HOST="http://localhost:11434"
OLLAMA_DEFAULT_MODEL="llama3.1:8b"
OLLAMA_CODE_MODEL="codellama:13b"
OLLAMA_FAST_MODEL="mistral:7b"

# Application
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Project Structure

```
ElctrDc/
├── app/                      # Next.js 14 App Router
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Main application
│   ├── api/                 # API routes
│   ├── globals.css          # Global styles
│   └── layout.tsx           # Root layout
│
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── editor/              # Block-based editor
│   ├── analysis/            # Data analysis components
│   └── ai/                  # AI interface components
│
├── lib/                     # Utility libraries
│   ├── parsers/             # Data parsers (BioLogic, Gamry, etc.)
│   ├── ai/                  # AI integration (Ollama)
│   ├── plotting/            # Plot configurations
│   ├── auth.ts              # Authentication utilities
│   ├── prisma.ts            # Database client
│   └── utils.ts             # Helper functions
│
├── prisma/
│   └── schema.prisma        # Database schema
│
├── types/                   # TypeScript type definitions
│
├── setup.sh                 # Automated setup script
├── run.sh                   # Application launcher
└── README.md                # This file
```

## Supported File Formats

### BioLogic
- `.mpt` - Text format (EC-Lab)
- `.mpr` - Binary format (EC-Lab)

### Gamry
- `.dta` - Gamry data files

### Battery Cyclers
- **Neware**: CSV exports
- **Arbin**: CSV/Excel exports

### Generic
- `.csv` - Comma-separated values
- `.txt` - Tab or comma delimited

## Usage Guide

### 1. Create a Project

```
1. Log in to ElctrDc
2. Click "New Project"
3. Choose a template (Battery Research, CV Analysis, etc.)
4. Add project description and research type
```

### 2. Upload Data

```
1. Navigate to your project
2. Click "Analyze Data" tab
3. Upload your data file (.mpt, .dta, .csv)
4. Data is automatically parsed and previewed
```

### 3. Create Visualizations

```
1. Select a dataset
2. Click "Create Visualization"
3. Choose plot type (CV, Nyquist, Bode, etc.)
4. Customize with plot controls
5. Export as PNG or SVG
```

### 4. Use AI Assistant

```
1. Click the AI icon (floating button)
2. Ask questions about your data:
   - "Explain this CV plot"
   - "What's the peak separation?"
   - "Suggest next experiments"
3. AI uses project context automatically
```

### 5. Manage Literature

```
1. Upload PDF papers to your project
2. AI extracts text and metadata
3. Reference papers in AI queries:
   - "Compare my results to Smith et al. 2023"
   - "What methodology did Paper X use?"
```

## Architecture

ElctrDc is built with modern web technologies:

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **UI**: Tailwind CSS, shadcn/ui (Radix UI)
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **AI**: Ollama (self-hosted LLMs)
- **Plotting**: Plotly.js
- **State**: Zustand
- **Auth**: JWT with bcrypt

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical documentation.

## Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Open Prisma Studio (database GUI)
pnpm db:studio

# Generate Prisma client
pnpm db:generate

# Push schema changes
pnpm db:push

# Create migration
pnpm db:migrate
```

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U yourusername -d elctrdc

# Check if database exists
psql -l | grep elctrdc

# Reset database
pnpm prisma db push --force-reset
```

### Ollama Not Working

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Pull missing models
ollama pull llama3.1:8b
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Roadmap

- [ ] Real-time collaboration
- [ ] Mobile app (React Native)
- [ ] Additional instrument parsers (IviumStat, CHI, etc.)
- [ ] Cloud AI option (for users without local Ollama)
- [ ] Advanced statistical analysis
- [ ] Automated report generation
- [ ] API for external integrations
- [ ] Plugin system for custom workflows

## Acknowledgments

Built with ❤️ for the electrochemistry research community.

Special thanks to:
- Next.js team for the amazing framework
- Vercel for hosting and Blob storage
- Ollama for privacy-first AI
- Plotly for scientific visualization
- shadcn for beautiful UI components
- All contributors and beta testers

---

**ElctrDc** - Accelerating Electrochemistry Research