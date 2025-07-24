import compression, { CompressionOptions } from 'compression';
import { Request, Response } from 'express';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import helmet, { HelmetOptions } from 'helmet';
import 'colors';

// Compression Middleware Manager
class CompressionManager {
  static getOptions(): CompressionOptions {
    return {
      threshold: 2048,
      filter: (req: Request, res: Response) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
      },
    };
  }
}

// Rate Limiter Middleware Manager
type HitCountData = {
  count: number;
  firstHit: Date | string;
  lastHit: Date;
  pathCounts: { [path: string]: number };
};

class RateLimiterManager {
  private static hitCounts: Record<string, HitCountData> = {};
  private static trustedIPs = ['192.168.12.31', '192.168.12.37', ''];

  static getLimiter(): RateLimitRequestHandler {
    return rateLimit({
      windowMs: 5 * 60 * 1000,
      limit: 300,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: {
        statusCode: 429,
        error: 'Too Many Requests',
        message:
          'You have exceeded the allowed number of requests. Please try again later.',
      },
      skip: (req: any) => RateLimiterManager.trustedIPs.includes(req.ip),
      keyGenerator: (req: any) => {
        const ip = req.ip;
        const path = req.path;
        const now = new Date();

        if (!RateLimiterManager.hitCounts[ip]) {
          RateLimiterManager.hitCounts[ip] = {
            count: 1,
            firstHit: now,
            lastHit: now,
            pathCounts: { [path]: 1 },
          };
        } else {
          RateLimiterManager.hitCounts[ip].count++;
          RateLimiterManager.hitCounts[ip].lastHit = now;
          RateLimiterManager.hitCounts[ip].pathCounts[path] =
            (RateLimiterManager.hitCounts[ip].pathCounts[path] || 0) + 1;
        }

        // eslint-disable-next-line no-console
        console.log(
          `from ${ip} | Total: ${RateLimiterManager.hitCounts[ip].count} | First: ${RateLimiterManager.hitCounts[
            ip
          ].firstHit.toLocaleString()} | Last: ${RateLimiterManager.hitCounts[
            ip
          ].lastHit.toLocaleTimeString()} on ${
            RateLimiterManager.hitCounts[ip].pathCounts[path]
          } on ${path} | ${RateLimiterManager.hitCounts[ip].pathCounts[path]}`
            .grey,
        );
        return ip;
      },
    });
  }
}

// Helmet Middleware Manager
class HelmetManager {
  static getOptions(): HelmetOptions {
    return {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://192.168.12.31:5003',
          ],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://192.168.12.31:5003'],
          connectSrc: ["'self'", 'https://192.168.12.31:5003'],
          imgSrc: ["'self'", 'https://192.168.12.31:5003', 'data:'],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'self'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'same-origin' },
      dnsPrefetchControl: { allow: false },
      frameguard: { action: 'deny' },
      hsts: {
        maxAge: 63072000,
        includeSubDomains: true,
        preload: true,
      },
      hidePoweredBy: true,
      ieNoOpen: true,
      noSniff: true,
      permittedCrossDomainPolicies: { permittedPolicies: 'none' },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
    };
  }

  static getHelmet() {
    return helmet(HelmetManager.getOptions());
  }
}

// Exported instances for use in your app
export const compressionOptions = CompressionManager.getOptions();
export const limiterRate = RateLimiterManager.getLimiter();
export const helmetConfig = HelmetManager.getHelmet();
