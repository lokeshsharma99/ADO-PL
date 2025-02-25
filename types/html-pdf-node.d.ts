declare module 'html-pdf-node' {
  interface PDFOptions {
    format?: string;
    path?: string;
    width?: number | string;
    height?: number | string;
    printBackground?: boolean;
    margin?: {
      top?: number | string;
      right?: number | string;
      bottom?: number | string;
      left?: number | string;
    };
    preferCSSPageSize?: boolean;
    scale?: number;
    landscape?: boolean;
    headerTemplate?: string;
    footerTemplate?: string;
    displayHeaderFooter?: boolean;
    pageRanges?: string;
  }

  interface FileContent {
    content?: string;
    url?: string;
  }

  export function generatePdf(
    file: FileContent,
    options?: PDFOptions
  ): Promise<Buffer>;

  export function generatePdfs(
    files: FileContent[],
    options?: PDFOptions
  ): Promise<Buffer[]>;
} 