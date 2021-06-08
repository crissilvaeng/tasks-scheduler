export interface KeyPair {
  readonly apiKey: string;
  readonly apiSecret?: string;
  readonly status: string;
  readonly salt?: string;
}
