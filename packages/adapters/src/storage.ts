import type { RawPayload } from "../../core/src/index";

export interface StorageProvider {
  putRawPayload(sourceId: string, payload: Uint8Array | string, contentType?: string): Promise<RawPayload>;
  getRawPayload(rawRef: string): Promise<Uint8Array | null>;
}

export class R2StorageClient implements StorageProvider {
  private readonly storageMap = new Map<string, Uint8Array>();

  public async putRawPayload(
    sourceId: string,
    payload: Uint8Array | string,
    contentType = "application/json"
  ): Promise<RawPayload> {
    const bytes = typeof payload === "string" ? new TextEncoder().encode(payload) : payload;
    const now = new Date();
    const yyyymm = now.toISOString().slice(0, 7);
    const uuid = crypto.randomUUID();
    const rawRef = `r2://payloads/${sourceId}/${yyyymm}/${uuid}.json`;

    this.storageMap.set(rawRef, bytes);

    return {
      id: uuid,
      source_id: sourceId,
      raw_ref: rawRef,
      payload_bytes: bytes.byteLength,
      content_type: contentType,
      captured_at: now.toISOString()
    };
  }

  public async getRawPayload(rawRef: string): Promise<Uint8Array | null> {
    return this.storageMap.get(rawRef) ?? null;
  }
}
