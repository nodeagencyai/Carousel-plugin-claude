---
name: carousel:update
description: Update the carousel plugin to the latest version with improved prompts and features.
---

# Update Carousel Plugin

Pull the latest version of the carousel plugin from GitHub.

## Steps

1. Run the marketplace refresh:
```bash
claude plugin marketplace remove node-carousel-marketplace
claude plugin marketplace add nodeagencyai/Carousel-plugin-claude
```

2. Reinstall the plugin:
```bash
claude plugin uninstall carousel
claude plugin install carousel
```

3. Report what's new — read the CHANGELOG.md from the plugin directory if it exists.

4. Tell the user to restart Claude Code for changes to take effect.
