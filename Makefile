SHELL := /bin/zsh
.PHONY: expo

expo:
	@repo_name=$$(basename "$$(git rev-parse --show-toplevel)"); \
	worktrees=$$(git worktree list --porcelain | grep '^worktree ' | sed 's/^worktree //'); \
	count=$$(echo "$$worktrees" | wc -l | tr -d ' '); \
	if [ "$$count" -eq 1 ]; then \
		selected=$$(echo "$$worktrees" | head -1); \
	else \
		echo "Available worktrees:"; \
		echo "$$worktrees" | awk -v repo="$$repo_name" '{ name=$$0; gsub(/.*\//, "", name); if(name==repo) name="main"; printf "  %d) %s\n", NR, name }'; \
		printf "Select worktree number: "; \
		read num; \
		selected=$$(echo "$$worktrees" | sed -n "$${num}p"); \
	fi; \
	if [ -z "$$selected" ]; then \
		echo "Error: invalid selection"; \
		exit 1; \
	fi; \
	echo "Starting Expo in $$(basename "$$selected") ..."; \
	cd "$$selected" && pnpm expo start
