SHELL := /bin/zsh
.SHELLFLAGS := -li -c
.PHONY: expo

expo:
	@repo_name=$$(basename "$$(git rev-parse --show-toplevel)"); \
	worktrees=$$(git worktree list --porcelain | grep '^worktree ' | sed 's/^worktree //'); \
	count=$$(echo "$$worktrees" | wc -l | tr -d ' '); \
	if [ "$$count" -eq 1 ]; then \
		selected=$$(echo "$$worktrees" | head -1); \
	else \
		if command -v fzf >/dev/null 2>&1; then \
			chosen=$$(echo "$$worktrees" | awk -v repo="$$repo_name" '{ name=$$0; gsub(/.*\//, "", name); if(name==repo) name="main"; print name "\t" $$0 }' \
				| fzf --prompt="Select worktree> " --with-nth=1 --delimiter="\t" --height=~10 --reverse \
				| cut -f2); \
			selected="$$chosen"; \
		else \
			echo "Available worktrees:"; \
			echo "$$worktrees" | awk -v repo="$$repo_name" '{ name=$$0; gsub(/.*\//, "", name); if(name==repo) name="main"; printf "  %d) %s\n", NR, name }'; \
			printf "Select worktree number: "; \
			read num; \
			selected=$$(echo "$$worktrees" | sed -n "$${num}p"); \
		fi; \
	fi; \
	if [ -z "$$selected" ]; then \
		echo "Error: invalid selection"; \
		exit 1; \
	fi; \
	echo "Starting Expo in $$(basename "$$selected") ..."; \
	# npxを使用: worktreeにはnode_modulesがないため、親ディレクトリを辿って解決できるnpxを使う（pnpmはローカルのnode_modulesのみ参照するため不可）
	cd "$$selected" && npx expo start
