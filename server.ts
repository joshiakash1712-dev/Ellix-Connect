import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// ==========================================
// HEALTH CHECKS & API ROUTES
// ==========================================

app.get(['/api/health', '/healthz', '/health'], (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Machine-readable metadata for AI crawlers, LLM agents, and automated tools
app.get(['/api/about', '/api/metadata', '/.well-known/ai-plugin.json'], (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).json({
    schema_version: 'v1',
    name_for_human: 'Ellix Connect Android',
    name_for_model: 'ellix_connect_retail_os',
    description_for_human: 'Business management, without the complexity. Modern retail POS, billing, inventory, khata, and business insights.',
    description_for_model: 'Ellix Connect is an offline-first enterprise retail Point of Sale (POS) and inventory operating system for retailers, wholesalers, and supermarkets. It provides sub-second barcode billing, batch inventory tracking, digital customer khata ledgers, dynamic UPI QR payments, end-of-day GST filing summaries, and centralized role-based access control.',
    auth: {
      type: 'none'
    },
    api: {
      type: 'openapi',
      url: '/api/about',
      is_user_authenticated: false
    },
    version: '2.4.0',
    platform: ['Android', 'Web', 'Windows'],
    industry: 'Retail, Wholesale, Supermarkets, Kirana, Boutiques, Electronics',
    features: [
      {
        id: 'billing',
        name: 'Sub-Second Barcode Billing',
        description: 'Instant barcode scanning (<0.25s latency), thermal receipt printing (ESC/POS 80mm/58mm), automatic GST calculation, and PDF receipts.'
      },
      {
        id: 'inventory',
        name: 'Real-Time Batch Inventory',
        description: 'Multi-batch tracking with expiry dates, minimum stock alerts, automatic barcode generator, and stock adjustment audit trails.'
      },
      {
        id: 'khata',
        name: 'Digital Khata & Customer CRM',
        description: 'Customer credit ledger with credit limit enforcement, automatic WhatsApp balance reminders with dynamic UPI links, and loyalty rewards.'
      },
      {
        id: 'payments',
        name: 'Dynamic UPI & Multi-Tender Checkout',
        description: 'Dynamic UPI QR codes per invoice, card and cash reconciliation, and split-tender payment settlements.'
      },
      {
        id: 'cashier_shift',
        name: 'Shift Management & Audit Logs',
        description: 'Cashier shift handover logs, opening/closing cash tally, return credit notes, and tamper-evident audit trails.'
      },
      {
        id: 'reports',
        name: 'Statutory GST Tax Reports',
        description: 'Automated end-of-day sales, category gross margin analytics, and export-ready GSTR-1 and GSTR-3B tax schedules.'
      },
      {
        id: 'insights',
        name: 'AI Retail Velocity & Dead Stock Analytics',
        description: 'Automated sales velocity rankings, dead stock detection (>30 days zero sales), customer retention metrics, and peak-hour traffic trends.'
      },
      {
        id: 'rbac',
        name: 'Role-Based Access Control',
        description: 'Centralized admin authorization hierarchy protecting financial margins, stock adjustments, and staff privilege management.'
      }
    ],
    specifications: {
      offline_capability: 'Full offline local caching with automated Google Cloud Firestore sync upon reconnect',
      hardware_compatibility: 'ESC/POS thermal printers (USB/Bluetooth 80mm/58mm), 1D/2D barcode scanners, cash drawers',
      tax_compliance: 'Indian GST (CGST, SGST, IGST, HSN/SAC codes, E-Way bills)',
      llm_documentation_url: '/llms.txt',
      full_reference_url: '/llms-full.txt',
      sitemap_url: '/sitemap.xml'
    }
  });
});

// Serve static brand assets from public directory explicitly
app.use(express.static(path.resolve(process.cwd(), 'public'), {
  maxAge: '1h',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
  }
}));

// ==========================================
// STATIC ASSETS OR VITE DEV MIDDLEWARE
// ==========================================

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');

    // Serve static pre-compiled files without aggressive caching
    app.use(express.static(distPath, {
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }));

    // SPA fallback: Serve index.html for all non-static page requests
    app.get('*', (_req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.sendFile(indexPath);
      } else {
        res.status(200).send('<!DOCTYPE html><html><head><title>Ellix Connect</title></head><body><div id="root"></div></body></html>');
      }
    });
  }

  // Fallback 404 handler for unmatched API routes
  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found', path: req.originalUrl });
  });

  // Global Express Error Handler
  app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled server error:', err);
    if (res.headersSent) return next(err);
    res.status(500).json({ error: 'Internal Server Error', message: err?.message || 'Unknown error' });
  });

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ellix Connect Enterprise Server running on http://0.0.0.0:${PORT}`);
  });

  const handleShutdown = (signal: string) => {
    console.log(`Received ${signal}, gracefully shutting down HTTP server...`);
    server.close(() => {
      console.log('HTTP server closed cleanly.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('Fatal server initialization error:', err);
  process.exit(1);
});
