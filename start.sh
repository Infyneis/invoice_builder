#!/bin/bash

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   🧾 INVOICE BUILDER - Start Script                                       ║
# ║   Professional invoice generation with PDF export                         ║
# ║                                                                           ║
# ║   Author: Samy DJEMILI                                                    ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

set -e

# ═══════════════════════════════════════════════════════════════════════════
# 🎨 Colors and Formatting
# ═══════════════════════════════════════════════════════════════════════════

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# ═══════════════════════════════════════════════════════════════════════════
# 📝 Helper Functions
# ═══════════════════════════════════════════════════════════════════════════

print_header() {
    echo ""
    echo -e "${PURPLE}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC}  ${WHITE}${BOLD}🧾 INVOICE BUILDER${NC}                                         ${PURPLE}║${NC}"
    echo -e "${PURPLE}║${NC}  ${CYAN}Professional invoices made simple${NC}                          ${PURPLE}║${NC}"
    echo -e "${PURPLE}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    echo -e "${PURPLE}▶${NC} ${WHITE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🔍 Dependency Checks
# ═══════════════════════════════════════════════════════════════════════════

check_dependencies() {
    print_step "Checking dependencies..."
    echo ""

    # 📦 Check for pnpm/npm/yarn
    if command -v pnpm &> /dev/null; then
        PKG_MANAGER="pnpm"
        print_success "pnpm found"
    elif command -v yarn &> /dev/null; then
        PKG_MANAGER="yarn"
        print_success "yarn found"
    elif command -v npm &> /dev/null; then
        PKG_MANAGER="npm"
        print_success "npm found"
    else
        print_error "No package manager found. Please install pnpm, yarn, or npm."
        exit 1
    fi

    # 🐳 Check for Docker
    if command -v docker &> /dev/null; then
        print_success "Docker found"
    else
        print_error "Docker not found. Please install Docker Desktop."
        echo -e "   ${CYAN}Download: https://www.docker.com/products/docker-desktop${NC}"
        exit 1
    fi

    # 🐳 Check for Docker Compose
    if docker compose version &> /dev/null; then
        print_success "Docker Compose found"
    else
        print_error "Docker Compose not found. Please update Docker Desktop."
        exit 1
    fi

    # 🟢 Check for Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        print_success "Node.js found ($NODE_VERSION)"
    else
        print_error "Node.js not found. Please install Node.js 18+."
        exit 1
    fi

    echo ""
}

# ═══════════════════════════════════════════════════════════════════════════
# 🐳 Docker Services
# ═══════════════════════════════════════════════════════════════════════════

start_docker_services() {
    print_step "Starting Docker services..."
    echo ""

    # 🔄 Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker Desktop."
        exit 1
    fi

    # 🐘 Start PostgreSQL container
    print_info "Starting PostgreSQL database..."
    docker compose up -d

    # ⏳ Wait for PostgreSQL to be ready
    print_info "Waiting for PostgreSQL to be ready..."
    sleep 3

    # 🔍 Check if container is running
    if docker compose ps | grep -q "running"; then
        print_success "PostgreSQL is running"
    else
        print_warning "PostgreSQL might still be starting..."
    fi

    echo ""
}

# ═══════════════════════════════════════════════════════════════════════════
# 📦 Install Dependencies
# ═══════════════════════════════════════════════════════════════════════════

install_dependencies() {
    print_step "Installing dependencies..."
    echo ""

    if [ ! -d "node_modules" ]; then
        print_info "Installing packages with $PKG_MANAGER..."
        $PKG_MANAGER install
        print_success "Dependencies installed"
    else
        print_success "Dependencies already installed"
    fi

    echo ""
}

# ═══════════════════════════════════════════════════════════════════════════
# 🗄️ Database Setup
# ═══════════════════════════════════════════════════════════════════════════

setup_database() {
    print_step "Setting up database..."
    echo ""

    # 🔧 Generate Prisma client
    print_info "Generating Prisma client..."
    $PKG_MANAGER prisma generate 2>/dev/null || true

    # 🗄️ Run database migrations
    print_info "Running database migrations..."
    $PKG_MANAGER prisma db push 2>/dev/null || true

    print_success "Database ready"
    echo ""
}

# ═══════════════════════════════════════════════════════════════════════════
# 🚀 Start Development Server
# ═══════════════════════════════════════════════════════════════════════════

start_dev_server() {
    print_step "Starting development server..."
    echo ""

    # 🌐 Find available port
    PORT=3000
    while lsof -i :$PORT &> /dev/null; do
        PORT=$((PORT + 1))
    done

    if [ $PORT -ne 3000 ]; then
        print_warning "Port 3000 is in use, using port $PORT"
    fi

    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "   ${WHITE}${BOLD}🧾 Invoice Builder is starting!${NC}"
    echo ""
    echo -e "   ${CYAN}Local:${NC}    http://localhost:$PORT"
    echo -e "   ${CYAN}Database:${NC} PostgreSQL on localhost:5432"
    echo ""
    echo -e "   ${YELLOW}Press Ctrl+C to stop the server${NC}"
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""

    # 🚀 Start the dev server
    PORT=$PORT $PKG_MANAGER dev
}

# ═══════════════════════════════════════════════════════════════════════════
# 📋 Help Menu
# ═══════════════════════════════════════════════════════════════════════════

show_help() {
    print_header
    echo -e "${WHITE}Usage:${NC} ./start.sh [option]"
    echo ""
    echo -e "${WHITE}Options:${NC}"
    echo -e "  ${CYAN}(none)${NC}      Start development server (default)"
    echo -e "  ${CYAN}--prod${NC}      Build and start production server"
    echo -e "  ${CYAN}--build${NC}     Build for production only"
    echo -e "  ${CYAN}--db${NC}        Start only database services"
    echo -e "  ${CYAN}--stop${NC}      Stop all Docker services"
    echo -e "  ${CYAN}--reset${NC}     Reset database (WARNING: deletes all data)"
    echo -e "  ${CYAN}-h, --help${NC}  Show this help message"
    echo ""
}

# ═══════════════════════════════════════════════════════════════════════════
# 🎯 Main Script
# ═══════════════════════════════════════════════════════════════════════════

main() {
    case "${1:-}" in
        -h|--help)
            show_help
            exit 0
            ;;
        --prod)
            print_header
            check_dependencies
            start_docker_services
            install_dependencies
            setup_database
            print_step "Building for production..."
            $PKG_MANAGER build
            print_step "Starting production server..."
            $PKG_MANAGER start
            ;;
        --build)
            print_header
            check_dependencies
            install_dependencies
            print_step "Building for production..."
            $PKG_MANAGER build
            print_success "Build complete!"
            ;;
        --db)
            print_header
            check_dependencies
            start_docker_services
            print_success "Database services started!"
            ;;
        --stop)
            print_header
            print_step "Stopping Docker services..."
            docker compose down
            print_success "Services stopped!"
            ;;
        --reset)
            print_header
            print_warning "This will delete all invoice data!"
            read -p "Are you sure? (y/N) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                docker compose down -v
                print_success "Database reset complete!"
            else
                print_info "Operation cancelled"
            fi
            ;;
        *)
            print_header
            check_dependencies
            start_docker_services
            install_dependencies
            setup_database
            start_dev_server
            ;;
    esac
}

# 🚀 Run the script
main "$@"
