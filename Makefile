THEME_PATH := $(CURDIR)
DEV_GHOST_PATH := '/Users/toddbirchard/Projects/ghostnew'
DEV_GHOST_THEME_PATH := '/Users/toddbirchard/Projects/ghostnew/content/themes/hackersandslackers-theme'

define HELP
Manage development of Hackersandslackers Ghost theme.

Usage:

make build           - Install all dependencies & build theme.
make dev             - Restart local ghost instant and compile site.
make clean           - Purge cache, locked, dependencies, logs, & lockfiles.
make update          - Update production dependencies to latest versions.
make reset           - Clean, update, and build site.

endef
export HELP

.PHONY: build dev clean update reset help

all help:
	@echo "$$HELP"


.PHONY: build
build:
	yarn run build


.PHONY: dev
dev:
	if [ -d $(DEV_GHOST_THEME_PATH) ]; then rm -rf $(DEV_GHOST_THEME_PATH); fi
	cp -R $(THEME_PATH) $(DEV_GHOST_THEME_PATH) && \
	cd $(DEV_GHOST_THEME_PATH) && pnpm dev && \
	cd $(DEV_GHOST_PATH) && ghost restart --verbose && cd $(THEME_PATH)


.PHONY: clean
clean:
	find . -name 'package-lock.json' -delete
	find . -name 'pnpm-lock.yaml' -delete
	find . -name 'yarn-error.log' -delete
	find . -name '.pnp.cjs' -delete
	find . -name '*.map'  -delete
	find . -wholename 'assets/built/*.js' -exec rm -rf {} +
	find . -wholename 'assets/built/*.css' -exec rm -rf {} +
	find . -wholename '*.lock' -delete
	find . -type d -wholename './.yarn' -exec rm -rf {} +
	find . -type d -wholename '**/node_modules' -exec rm -rf {} +


.PHONY: update
update:
	pnpm install -g npm@latest && \
	pnpm install -g npm-check-updates@latest && \
	pnpm install -g ghost-cli@latest && \
	cd $(DEV_GHOST_PATH) && ghost update && \
	cd $(DEV_GHOST_THEME_PATH) && ncu
