/** Explicit file response; route authorization runs before any bytes are sent. */
export class Download {
  readonly body: string;
  readonly contentType: string;
  readonly filename: string;
  constructor(body: string, contentType: string, filename: string) {
    this.body = body; this.contentType = contentType; this.filename = filename;
  }
}
