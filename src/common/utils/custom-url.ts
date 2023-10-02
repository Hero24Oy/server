export class CustomUrl {
  private readonly url: URL;

  private readonly searchParams: URLSearchParams;

  constructor(baseName: string, path: string, params: Record<string, string>) {
    this.url = new URL(path, baseName);
    this.searchParams = new URLSearchParams(params);
  }

  toString(): string {
    return `${this.url.origin}${
      this.url.pathname
    }?${this.searchParams.toString()}`;
  }

  getUrl(): URL {
    return new URL(this.toString());
  }
}
