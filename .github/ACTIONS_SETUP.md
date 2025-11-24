# GitHub Actions Setup Guide

This repository includes two GitHub Actions workflows for automated testing and publishing.

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)
- **Triggers:** On push to main/master or on pull requests
- **Tests:** Runs on Node.js 18, 20, and 22
- **Actions:**
  - Installs dependencies
  - Runs linter
  - Runs tests
  - Builds package

### 2. Publish Workflow (`.github/workflows/publish.yml`)
- **Triggers:** On GitHub release creation or manual dispatch
- **Actions:**
  - Installs dependencies
  - Runs tests
  - Builds package
  - Publishes to npm (with provenance)

## Setup Instructions

### Step 1: Create npm Access Token

1. Go to [npmjs.com](https://www.npmjs.com) and login
2. Click on your profile → **Access Tokens**
3. Click **Generate New Token** → **Classic Token**
4. Select **Automation** type
5. Copy the token (you'll only see it once!)

### Step 2: Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click **Add secret**

### Step 3: Publishing a New Version

#### Method 1: Using GitHub Releases (Recommended)

1. Update version in `package.json`:
   ```bash
   npm version patch  # or minor, or major
   ```

2. Push the version tag:
   ```bash
   git push --tags
   ```

3. Create a GitHub Release:
   - Go to your repository on GitHub
   - Click **Releases** → **Create a new release**
   - Choose the tag you just pushed
   - Add release notes
   - Click **Publish release**

4. The workflow will automatically:
   - Run tests
   - Build the package
   - Publish to npm

#### Method 2: Manual Trigger

1. Go to **Actions** tab in GitHub
2. Select **Publish to npm** workflow
3. Click **Run workflow**
4. Select branch and click **Run workflow**

### Step 4: Verify Publication

After the workflow completes:
- Check [npmjs.com/package/front-guard](https://www.npmjs.com/package/front-guard)
- Verify the new version is published

## Workflow Status Badges

Add these badges to your README.md:

```markdown
[![CI](https://github.com/gowtham-shankarr/front-guard/actions/workflows/ci.yml/badge.svg)](https://github.com/gowtham-shankarr/front-guard/actions/workflows/ci.yml)
[![Publish](https://github.com/gowtham-shankarr/front-guard/actions/workflows/publish.yml/badge.svg)](https://github.com/gowtham-shankarr/front-guard/actions/workflows/publish.yml)
```

## Troubleshooting

### npm publish fails with authentication error
- Verify `NPM_TOKEN` secret is set correctly in GitHub
- Ensure token has `Automation` type permissions

### Tests fail in CI
- Check test output in GitHub Actions logs
- Ensure all tests pass locally before pushing

### Build fails
- Verify `package.json` scripts are correct
- Check Node.js version compatibility

## Security Notes

- **Never commit** your npm token to the repository
- Use `NPM_TOKEN` secret for automation
- The `--provenance` flag adds supply chain security metadata
- Tokens are automatically masked in GitHub Actions logs

## Version Bumping Workflow

```bash
# 1. Make your changes
git add .
git commit -m "feat: add new feature"

# 2. Bump version (automatically updates package.json and creates git tag)
npm version patch   # 0.0.1 → 0.0.2 (bug fixes)
npm version minor   # 0.0.2 → 0.1.0 (new features)
npm version major   # 0.1.0 → 1.0.0 (breaking changes)

# 3. Push with tags
git push --follow-tags

# 4. Create GitHub Release
# Go to GitHub → Releases → Create new release
# GitHub Actions will automatically publish to npm
```

## Manual Publishing (Alternative)

If you prefer to publish manually:

```bash
npm login
npm test
npm run build
npm publish --access public
```

---

**Ready to automate!** 🚀
