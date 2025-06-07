# Mage VSCode Extension Makefile
# Provides convenient shortcuts for common development tasks

.PHONY: help install clean build package sync test lint format dev release

# Default target
help: ## Show this help message
	@echo "Mage VSCode Extension Development Commands:"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	@echo "📦 Installing dependencies..."
	npm ci

clean: ## Clean build artifacts
	@echo "🧹 Cleaning build artifacts..."
	npm run clean

build: clean ## Build the extension
	@echo "🔨 Building extension..."
	npm run build

package: build ## Package the extension into .vsix file
	@echo "📦 Packaging extension..."
	npm run package

sync: ## Sync language files from main repository
	@echo "🔄 Syncing language files..."
	npm run sync-language

test: build ## Run tests
	@echo "🧪 Running tests..."
	npm test

lint: ## Run ESLint
	@echo "🔍 Linting code..."
	npm run lint

format: ## Format code with Prettier
	@echo "✨ Formatting code..."
	npm run format

dev: ## Start development mode (watch)
	@echo "🚀 Starting development mode..."
	npm run dev

release: sync package test ## Full release workflow: sync, package, and test
	@echo "🚀 Release workflow completed!"
	@echo "📦 Extension packaged and ready for release"

# Development shortcuts
quick-build: ## Quick build without cleaning
	@echo "⚡ Quick build..."
	npm run compile

quick-package: quick-build ## Quick package without full build
	@echo "⚡ Quick package..."
	npx vsce package

# Update workflows
update-grammar: ## Update grammar files with validation
	@echo "📝 Updating grammar files..."
	npm run update-grammar

# CI/Development status
status: ## Show current development status
	@echo "📊 Current Status:"
	@echo "  Node version: $$(node --version)"
	@echo "  NPM version:  $$(npm --version)"
	@echo "  Git branch:   $$(git branch --show-current 2>/dev/null || echo 'not a git repo')"
	@echo "  Git status:   $$(git status --porcelain | wc -l) files changed"
	@if [ -f "package.json" ]; then \
		echo "  Package version: $$(node -p "require('./package.json').version")"; \
	fi
	@if [ -f "*.vsix" ]; then \
		echo "  VSIX files: $$(ls -1 *.vsix 2>/dev/null | wc -l)"; \
	fi 