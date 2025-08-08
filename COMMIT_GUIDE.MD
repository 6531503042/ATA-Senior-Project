# ATA-IT

## Commit Guidelines

### Commit Message Format


### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style/formatting
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/modifying tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `revert`: Reverting changes

### Scopes
- `user`: User module
- `auth`: Authentication module
- `config`: Configuration
- `db`: Database
- `api`: API endpoints
- `middleware`: Middleware components
- `core`: Core functionality
- `pkg`: Shared packages

### Emojis Guide
| Emoji | Code | Type | Example Usage |
|-------|------|------|---------------|
| ✨ | `:sparkles:` | New Features | `feat(user): ✨ Add user registration` |
| 🐛 | `:bug:` | Bug Fixes | `fix(auth): 🐛 Fix token validation` |
| 📝 | `:memo:` | Documentation | `docs: 📝 Update API documentation` |
| ♻️ | `:recycle:` | Refactoring | `refactor(core): ♻️ Improve error handling` |
| 🔧 | `:wrench:` | Configuration | `chore(config): 🔧 Update env variables` |
| 🔒 | `:lock:` | Security | `fix(auth): 🔒 Enhance password hashing` |
| ⚡️ | `:zap:` | Performance | `perf(db): ⚡️ Optimize queries` |
| 🧪 | `:test_tube:` | Testing | `test(user): 🧪 Add unit tests` |
| 🎨 | `:art:` | Style/UI | `style: 🎨 Format code` |
| 🔥 | `:fire:` | Remove Code | `refactor: 🔥 Remove deprecated code` |

### Examples

```git
feat(user): ✨ Add user registration endpoint
fix(auth): 🐛 Fix refresh token validation
docs(api): 📝 Update API documentation
refactor(core): ♻️ Improve error handling
test(auth): 🧪 Add authentication tests
style(all): 🎨 Apply go fmt
perf(db): ⚡️ Optimize MongoDB queries
chore(deps): 🔧 Update dependencies
```

### Best Practices

1. **Atomic Commits**
   - Each commit should represent one logical change
   - Keep commits focused and concise

2. **Meaningful Messages**
   - Write clear, descriptive commit messages
   - Use present tense ("Add feature" not "Added feature")
   - Start with a capital letter

3. **Reference Issues**
   - Include issue numbers when applicable
   - Example: `feat(user): ✨ Add login page (#123)`

4. **Breaking Changes**
   - Mark breaking changes with `BREAKING CHANGE:` in commit body
   - Example:
   ```
   feat(auth): 💥 Update authentication flow
   
   BREAKING CHANGE: JWT token structure changed
   ```

5. **Revert Commits**
   ```
   revert: 🔙 feat(user): Add user registration
   
   This reverts commit hash123...
   ```

### Branch Naming


Examples:
- `feat/user-registration`
- `fix/auth-token-validation`
- `docs/api-documentation`
- `refactor/error-handling`

### Pre-commit Checklist

- [ ] Code follows project style guidelines
- [ ] Tests are passing
- [ ] Documentation is updated
- [ ] Commit message follows guidelines
- [ ] Branch is up to date with main/master