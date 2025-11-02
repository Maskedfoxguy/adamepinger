# Setting Up Pre-commit Hooks with Husky

This project supports automatic code quality checks before commits using Husky and lint-staged.

## Installation

To enable pre-commit hooks:

```bash
# From the root directory
npx husky init

# Create the pre-commit hook
echo 'npx lint-staged' > .husky/pre-commit
chmod +x .husky/pre-commit
```

## What It Does

When enabled, the pre-commit hook will:

1. **Lint** all staged files with ESLint
2. **Format** all staged files with Prettier
3. **Automatically fix** issues when possible
4. **Block the commit** if there are unfixable errors

## Configured Checks

- `server/**/*.js` - ESLint + Prettier
- `client/src/**/*.{js,jsx}` - ESLint + Prettier
- `*.{json,md}` - Prettier

## Configuration Files

- `.lintstagedrc.json` - Defines what runs on staged files
- `.husky/pre-commit` - Git hook script
- `.eslintrc.json` - ESLint rules (root, server, client)
- `.prettierrc.json` - Prettier formatting rules

## Bypassing Hooks (Emergency Use Only)

If you need to commit without running hooks:

```bash
git commit --no-verify -m "your message"
```

**Note:** This should only be used in emergencies. The hooks are there to maintain code quality.

## Troubleshooting

### Hooks not running
- Ensure you're in the root directory when running `npx husky init`
- Check that `.husky/pre-commit` exists and is executable

### ESLint errors
Run locally to see errors:
```bash
npm run lint --prefix server
npm run lint --prefix client
```

### Prettier issues
Format files manually:
```bash
npm run format --prefix server
npm run format --prefix client
```

## Disabling Hooks

To disable hooks temporarily:
```bash
# Remove the husky directory
rm -rf .husky
```

To re-enable, follow the installation steps above.
