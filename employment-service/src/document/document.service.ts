import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';

@Injectable()
export class DocumentService {
  async createPdfFromTemplate(templateString: string, data: any): Promise<Buffer> {
    const template = handlebars.compile(templateString);
    const html = template(data);
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdfBuffer;
  }

  async uploadToS3(buffer: Buffer, key: string): Promise<string> {
    console.log(`MOCK UPLOAD: Uploading to S3 with key: ${key}`);
    return `https://your-s3-bucket.s3.amazonaws.com/${key}`;
  }
}
