# Contributing to Front-Guard

Thank you for your interest in contributing to Front-Guard! 🛡️

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/gowtham-shankarr/front-guard.git
   cd front-guard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests**
   ```bash
   npm test
   ```

4. **Build the package**
   ```bash
   npm run build
   ```

## Development Workflow

1. Create a new branch for your feature/fix
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the `src/` directory

3. Add tests for your changes

4. Run tests to ensure everything passes
   ```bash
   npm test
   ```

5. Build to verify no errors
   ```bash
   npm run build
   ```

6. Commit your changes
   ```bash
   git commit -m "feat: add new feature"
   ```

7. Push and create a pull request
   ```bash
   git push origin feature/your-feature-name
   ```

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring

## Code Style

- We use **TypeScript** for all code
- Code is linted with **ESLint**
- Code is formatted with **Prettier** (run `npm run format` if available)

## Testing

- All new features should include tests
- Tests are written using **Vitest**
- Test files should be named `*.test.ts` or `*.test.tsx`

## Questions?

Feel free to open an issue for any questions or discussions!

---

**Thank you for contributing! 🙏**
