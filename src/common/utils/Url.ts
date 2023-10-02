export class UrlWithSearchParams {
  constructor(
    private readonly url: URL,
    private readonly searchParams: URLSearchParams,
  ) {}

  toString(): string {
    return `${this.url.origin}${
      this.url.pathname
    }?${this.searchParams.toString()}`;
  }

  getUrl(): URL {
    return new URL(this.toString());
  }
}
