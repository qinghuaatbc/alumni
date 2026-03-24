import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import * as https from 'https';
import * as http from 'http';

function fetchUrl(url: string): Promise<{ data: Buffer; contentType: string }> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': 'https://tv.cctv.com/',
        'Accept': '*/*',
      },
      timeout: 10000,
    }, (res) => {
      // Follow redirects
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        fetchUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ data: Buffer.concat(chunks), contentType: res.headers['content-type'] || '' }));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

@Controller('proxy')
export class ProxyController {

  @Get('m3u8')
  async proxyM3u8(@Query('url') url: string, @Res() res: Response) {
    if (!url) return res.status(400).json({ error: 'url required' });
    try {
      const { data } = await fetchUrl(url);
      let content = data.toString('utf-8');

      const base = new URL(url);
      const basePath = base.origin + base.pathname.replace(/\/[^/]*$/, '/');

      content = content.split('\n').map(line => {
        const t = line.trim();
        if (!t || t.startsWith('#')) return line;

        let abs = t;
        if (!t.startsWith('http')) {
          abs = t.startsWith('/') ? base.origin + t : basePath + t;
        }

        if (abs.includes('.m3u8')) {
          return `http://localhost:3000/proxy/m3u8?url=${encodeURIComponent(abs)}`;
        }
        return `http://localhost:3000/proxy/seg?url=${encodeURIComponent(abs)}`;
      }).join('\n');

      res.set('Content-Type', 'application/vnd.apple.mpegurl');
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Cache-Control', 'no-cache');
      res.send(content);
    } catch (e) {
      res.status(502).json({ error: 'fetch failed', detail: String(e) });
    }
  }

  @Get('seg')
  async proxySeg(@Query('url') url: string, @Res() res: Response) {
    if (!url) return res.status(400).json({ error: 'url required' });
    try {
      const { data, contentType } = await fetchUrl(url);
      res.set('Content-Type', contentType || 'video/MP2T');
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Cache-Control', 'max-age=10');
      res.send(data);
    } catch (e) {
      res.status(502).json({ error: 'fetch failed' });
    }
  }
}
