export class CustomFetcher {
  private readonly url: URL;

  private readonly searchParams: URLSearchParams;

  constructor(baseName: string, path: string, params: Record<string, string>) {
    this.url = new URL(path, baseName);
    this.searchParams = new URLSearchParams(params);
  }

  getStringifiedUrl(): string {
    return `${this.url.origin}${
      this.url.pathname
    }?${this.searchParams.toString()}`;
  }

  getUrl(): URL {
    return new URL(this.getStringifiedUrl());
  }

  async get(headers: HeadersInit): Promise<Response> {
    return fetch(this.getUrl(), {
      headers,
      method: 'GET',
    });
  }

  async post(headers: HeadersInit, body: BodyInit): Promise<Response> {
    return fetch(this.getUrl(), {
      headers,
      method: 'POST',
      body,
    });
  }
}
