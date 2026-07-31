import type { RawPayload } from "../../core/src/index.ts";

export interface StorageProvider {
  putRawPayload(sourceId: string, payload: Buffer | string, contentType?: string): Promise<RawPayload>;
  getRawPayload(rawRef: string): Promise<Buffer | null>;
}

export class R2StorageClient implements StorageProvider {
  private readonly storageMap = new Map<string, Buffer>();

  public async putRawPayload(
    sourceId: string,
    payload: Buffer | string,
    contentType = "application/json"
  ): Promise<RawPayload> {
    const buffer = typeof payload === "string" ? Buffer.from(payload, "utf-8") : payload;
    const now = new Date();
    const yyyymm = now.toISOString().slice(0, 7);
    const uuid = crypto.randomUUID();
    const rawRef = `r2://payloads/${sourceId}/${yyyymm}/${uuid}.json`;

    this.storageMap.set(rawRef, buffer);

    return {
      id: uuid,
      source_id: sourceId,
      raw_ref: rawRef,
      payload_bytes: buffer.byteLength,
      content_type: contentType,
      captured_at: now.toISOString()
    };
  }

  public async getRawPayload(rawRef: string): Promise<Buffer | null> {
    return this.storageMap.get(rawRef) ?? null;
  }
}
