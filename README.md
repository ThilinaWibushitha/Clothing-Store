# Velvet Vogue - Premium Fashion E-commerce Platform

![Velvet Vogue Logo](./Assets/logo.png)

A modern, responsive, and accessible e-commerce platform built for fashion retail. Features a secure PHP backend with MongoDB, modern JavaScript frontend, and comprehensive testing suite.

## 🚀 Features

### Frontend
- **Responsive Design**: Mobile-first approach with modern CSS Grid and Flexbox
- **Accessibility**: WCAG 2.1 AA compliant with semantic HTML and ARIA labels
- **Performance**: Optimized images, lazy loading, and efficient JavaScript modules
- **User Experience**: Intuitive navigation, smooth animations, and interactive elements
- **SEO Optimized**: Structured data, meta tags, and semantic markup

### Backend
- **Security**: CSRF protection, rate limiting, input validation, and secure sessions
- **Database**: MongoDB integration with proper error handling
- **Authentication**: Secure login system with password hashing
- **API**: RESTful endpoints with proper HTTP status codes
- **Logging**: Comprehensive security and error logging

### Testing
- **E2E Testing**: Cypress integration tests
- **Accessibility Testing**: Automated accessibility audits
- **Performance Testing**: Lighthouse integration
- **Security Testing**: Automated security audits

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Modern CSS Grid/Flexbox
- **Backend**: PHP 7.4+, MongoDB
- **Testing**: Cypress, Lighthouse, Pa11y
- **Development**: ESLint, Prettier, Stylelint
- **Performance**: Lazy loading, image optimization, minification

## 📋 Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0
- PHP >= 7.4.0
- MongoDB >= 4.4
- Composer (for PHP dependencies)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/velvetvogue/ecommerce-platform.git
cd ecommerce-platform
```

### 2. Install Dependencies
```bash
# Install all dependencies (frontend + backend)
npm run install-all

# Or install separately
npm install
npm run install-backend
```

### 3. Start MongoDB
```bash
# Start MongoDB service
mongod
```

### 4. Start Development Server
```bash
# Start PHP development server
npm run dev
# or
npm start
```

### 5. Access the Application
- Frontend: http://127.0.0.1:5500
- Backend API: http://localhost:8000

## 📁 Project Structure

```
velvet-vogue-ecommerce/
├── Assets/                 # Images, icons, and media files
├── CSS/                   # Stylesheets
│   ├── Main.css          # Main styles with CSS custom properties
│   ├── nav.css           # Navigation styles
│   ├── slider.css        # Slider/carousel styles
│   └── ...               # Component-specific styles
├── Js/                    # JavaScript modules
│   ├── main.js           # Main application logic
│   ├── slider.js         # Slider functionality
│   ├── cart.js           # Shopping cart logic
│   └── buy.js            # Payment processing
├── backend/               # PHP backend
│   ├── index.php         # Main API endpoint
│   ├── admin.php         # Admin panel
│   ├── payment.php       # Payment processing
│   └── vendor/          # Composer dependencies
├── cypress/              # E2E tests
│   ├── e2e/              # Test files
│   └── fixtures/         # Test data
├── *.html                # HTML pages
├── package.json          # Node.js dependencies and scripts
├── composer.json         # PHP dependencies
└── README.md            # This file
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### E2E Testing with Cypress
```bash
# Open Cypress Test Runner
npm run test:e2e:open

# Run tests headlessly
npm run test:e2e:headless
```

### Accessibility Testing
```bash
npm run accessibility:audit
```

### Performance Testing
```bash
npm run performance:lighthouse
```

## 🔧 Development Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run all tests |
| `npm run lint` | Lint code |
| `npm run format` | Format code |
| `npm run security:audit` | Security audit |
| `npm run clean` | Clean dependencies |
| `npm run fresh-install` | Fresh installation |

## 🔒 Security Features

- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: Login attempt limiting
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Output encoding and CSP headers
- **Session Security**: Secure session management
- **Password Security**: Bcrypt hashing

## ♿ Accessibility Features

- **Semantic HTML**: Proper heading structure and landmarks
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant colors
- **Focus Management**: Visible focus indicators
- **Alt Text**: Descriptive image alternatives

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 480px, 768px, 1024px, 1200px
- **Flexible Grid**: CSS Grid and Flexbox layouts
- **Touch Friendly**: Appropriate touch targets
- **Performance**: Optimized for mobile networks

## 🚀 Performance Optimizations

- **Image Optimization**: Lazy loading and WebP support
- **Code Splitting**: Modular JavaScript architecture
- **Caching**: Browser and server-side caching
- **Minification**: CSS and JavaScript minification
- **CDN Ready**: Optimized for content delivery networks

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```bash
   # Ensure MongoDB is running
   mongod
   ```

2. **PHP Dependencies Missing**
   ```bash
   npm run install-backend
   ```

3. **Port Already in Use**
   ```bash
   # Kill process on port 8000
   lsof -ti:8000 | xargs kill -9
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: Modern JavaScript and CSS
- **Backend Development**: PHP and MongoDB
- **UI/UX Design**: Responsive and accessible design
- **Testing**: Comprehensive test coverage

## 🔄 Version History

- **v2.0.0**: Complete rewrite with modern practices
- **v1.0.0**: Initial release

---

