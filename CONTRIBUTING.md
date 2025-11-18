# Contributing to Timesheet Tracker

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Node version)

### Suggesting Features

Feature requests are welcome! Please:
- Check if the feature has already been requested
- Clearly describe the feature and its use case
- Explain how it would benefit users
- Consider if it fits the project's scope

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed
4. **Test your changes**
   - Run `npm start` and test manually
   - Run `npm run build` to ensure production build works
   - Use the [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)
5. **Commit with clear messages**
   ```bash
   git commit -m "Add feature: description of what you added"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** with:
   - Description of changes
   - Why the changes are needed
   - Any testing you've done
   - Screenshots for UI changes

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env` and configure for development:
   ```bash
   cp .env .env.local
   # Edit .env.local with test data
   ```
4. Start development server:
   ```bash
   npm start
   ```

## Code Style

- Use functional React components with hooks
- Follow existing naming conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use Material-UI components when possible

## Project Structure

```
src/
├── App.js          # Main application component
├── config.js       # Configuration utility
├── index.js        # React entry point
└── ...

public/
├── index.html      # HTML template
└── ...

Documentation:
├── README.md
├── QUICKSTART.md
├── CHANGELOG.md
├── TESTING_CHECKLIST.md
└── CONTRIBUTING.md
```

## Feature Development Guidelines

### Before Starting

- Check existing issues and PRs to avoid duplication
- Discuss major changes in an issue first
- Ensure the feature aligns with project goals

### While Developing

- Keep commits focused and atomic
- Write clear commit messages
- Test on multiple browsers
- Ensure responsive design works
- Check accessibility (keyboard navigation, screen readers)

### Before Submitting

- [ ] Code follows existing style
- [ ] All features work as expected
- [ ] No console errors or warnings
- [ ] Production build compiles successfully
- [ ] Documentation updated if needed
- [ ] CHANGELOG.md updated with changes
- [ ] Testing checklist reviewed

## Areas for Contribution

### Priority Features
- Multiple client management system
- Email integration for sending invoices
- Custom invoice templates
- Tax calculation options
- Cloud sync and backup

### Improvements
- Better mobile responsiveness
- Dark mode support
- Accessibility enhancements
- Performance optimizations
- Additional export formats (Excel, JSON)

### Documentation
- Video tutorials
- Usage examples
- FAQ section
- Deployment guides for specific platforms
- Translation to other languages

### Testing
- Unit tests for components
- Integration tests
- End-to-end tests
- Browser compatibility testing

## Getting Help

- Check existing documentation first
- Search closed issues for similar questions
- Open a new issue with the "question" label
- Be specific about what you need help with

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be acknowledged in:
- CHANGELOG.md for their specific contributions
- GitHub's contributor graph
- Future releases

---

Thank you for contributing to making Timesheet Tracker better! 🎉
