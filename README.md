# SIH-ISRO Frontend

React-based web interface for the Advanced Thermal Satellite Image Super-Resolution System. This frontend provides an interactive map interface for satellite imagery analysis with real-time processing capabilities.

## 🌟 Features

- **Interactive Map Interface**: OpenLayers-based mapping with location selection
- **Real-time Analysis**: Live satellite imagery processing with thermal enhancement
- **Data Visualization**: Charts and metrics display using Recharts
- **3D Graphics**: Three.js integration for advanced visualizations
- **Responsive Design**: Modern UI with CSS modules
- **Data Management**: Save, retrieve, and manage analysis results

## 🏗️ Project Structure

```
frontend/
├── public/
│   └── vite.svg              # Vite logo
├── src/
│   ├── App.jsx               # Main application component
│   ├── App.css               # Main application styles
│   ├── main.jsx              # React entry point
│   ├── index.css             # Global styles
│   ├── OLMap.jsx             # OpenLayers map component
│   ├── MetricsDisplay.jsx    # Analysis metrics display
│   ├── MetricsDisplay.css    # Metrics styling
│   ├── MetricsVisualization.jsx  # Chart components
│   ├── MetricsVisualization.css  # Visualization styling
│   ├── SavedGraphs.jsx       # Saved analysis management
│   ├── SavedGraphs.css       # Saved graphs styling
│   ├── SavedLocations.jsx    # Location history component
│   ├── SavedLocations.css    # Location styling
│   ├── Docs.jsx              # Documentation component
│   ├── Docs.css              # Documentation styling
│   ├── handleSaveAnalysis.js # Analysis saving utility
│   └── assets/
│       └── react.svg         # React logo
├── package.json              # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint configuration
└── index.html               # HTML template
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 16+** (LTS recommended)
- **npm** or **yarn** package manager
- **Modern browser** with ES6+ support

### Installation

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - Development: `http://localhost:5173`
   - The application will automatically reload on code changes

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🌐 Deployment Options

### 1. Static Hosting (Recommended)

#### Vercel (Easiest)
```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod
```

#### Netlify
```bash
# Build the project
npm run build

# Deploy to Netlify (drag & drop dist folder)
# Or use Netlify CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### GitHub Pages
```bash
# Build the project
npm run build

# Deploy using gh-pages
npm install -g gh-pages
gh-pages -d dist
```

### 2. Cloud Platforms

#### AWS S3 + CloudFront
```bash
# Build the project
npm run build

# Upload to S3 bucket (configure as static website)
aws s3 sync dist/ s3://your-bucket-name --delete
```

#### Google Firebase
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### 3. Docker Deployment

Create `Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t sih-isro-frontend .
docker run -p 3000:80 sih-isro-frontend
```

## ⚙️ Configuration

### Environment Variables

Create `.env` file in frontend root:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_TITLE=SIH-ISRO Thermal Analysis
VITE_MAP_DEFAULT_LAT=28.6139
VITE_MAP_DEFAULT_LON=77.2090
```

### Backend Integration

Update API endpoints in components to match your backend URL:
```javascript
// In your components
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
```

### Vite Configuration

Customize `vite.config.js` for production:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Change for subdirectory deployment
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Enable for debugging
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
```

## 🔧 Technology Stack

### Core Technologies
- **React 19.1.1**: Modern UI framework with hooks
- **Vite 7.1.2**: Fast build tool and development server
- **JavaScript/JSX**: Component-based architecture

### Key Libraries
- **OpenLayers 10.6.1**: Advanced mapping and geospatial visualization
- **Recharts 3.2.1**: Responsive chart library for data visualization
- **Three.js 0.180.0**: 3D graphics and WebGL rendering
- **@react-three/fiber 9.3.0**: React renderer for Three.js
- **@react-three/drei 10.7.6**: Three.js utilities and helpers

### Development Tools
- **ESLint**: Code quality and style enforcement
- **Vite Plugin React**: Fast refresh and JSX support
- **CSS Modules**: Scoped styling

## 📱 Browser Compatibility

- **Chrome/Chromium**: 88+
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+

Note: WebGL support required for 3D visualizations

## 🔗 API Integration

The frontend communicates with the Flask backend through these endpoints:

- `POST /analyze` - Submit imagery for analysis
- `GET /api/saved-graphs` - Retrieve saved results
- `POST /api/save-graph` - Save analysis data
- `DELETE /api/graphs/{id}` - Delete saved analysis
- `GET /api/status` - Backend health check

## 🎨 Customization

### Styling
- Modify CSS files in `src/` for component-specific styles
- Update `src/index.css` for global styles
- Customize color themes in individual CSS modules

### Components
- Add new analysis components in `src/`
- Extend map functionality in `OLMap.jsx`
- Create custom visualizations using Recharts

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Kill process on port 5173
   npx kill-port 5173
   ```

2. **Build failures**:
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **CORS issues in development**:
   - Configure proxy in `vite.config.js`
   - Ensure backend allows CORS

### Performance Optimization

- Use `React.memo()` for expensive components
- Implement lazy loading for large datasets
- Optimize map rendering with viewport culling

## 📞 Support

For frontend-specific issues:
- Check browser console for errors
- Verify network requests in developer tools
- Ensure backend API is running and accessible

## 🤝 Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Maintain consistent coding style with ESLint
4. Test across different browsers
5. Document new components and features

---

**Frontend for SIH-ISRO Thermal Analysis System**
