# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please follow these steps:

1. **Do NOT** open a public issue
2. Email the maintainer at: [your-email@example.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work on a fix as soon as possible.

## Security Best Practices

### For Contributors:
- Never commit `.env` files with real credentials
- Always use environment variables for secrets
- Run `npm audit` before committing
- Keep dependencies up to date
- Use strong JWT secrets in production

### For Deployment:
- Change all default secrets before deploying
- Use HTTPS in production
- Enable CORS only for trusted domains
- Implement rate limiting
- Use secure headers (helmet.js)
- Regular security audits

## Security Scanning

This project uses:
- **Trivy** - Vulnerability scanner for dependencies and containers
- **npm audit** - Node.js package vulnerability checker
- **GitHub Security Alerts** - Automated dependency updates

## Known Security Considerations

1. **JWT Secret**: Default secret is for development only
2. **No Database**: Currently using in-memory storage (lost on restart)
3. **No Rate Limiting**: Should be added for production
4. **CORS**: Currently allows all origins (development only)

## Security Updates

Security patches are released as soon as possible after discovery.
