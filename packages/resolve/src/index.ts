import { Entity, EntityIdentifier, Result } from "@meridian/core";

export interface ResolutionRule {
  readonly id: string;
  readonly name: string;
  readonly confidence_threshold: number;
}

export interface EntityResolver {
  resolveIdentifier(identifier: EntityIdentifier): Promise<Result<Entity | null>>;
}
