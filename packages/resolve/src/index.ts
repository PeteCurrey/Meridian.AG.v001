import {
  EntityType,
  IdentifierScheme,
  ok,
  err
} from "../../core/src/index";
import type {
  Entity,
  EntityIdentifier,
  MergeAuditRecord,
  MergeProposal,
  Result
} from "../../core/src/index";

export interface ResolutionRule {
  readonly id: string;
  readonly name: string;
  readonly scheme: IdentifierScheme;
  readonly confidence: number;
}

export const RESOLUTION_RULES: readonly ResolutionRule[] = [
  { id: "RULE_1_CIK", name: "Exact SEC CIK Match", scheme: IdentifierScheme.CIK, confidence: 1.0 },
  { id: "RULE_2_LEI", name: "Exact GLEIF LEI Match", scheme: IdentifierScheme.LEI, confidence: 1.0 },
  { id: "RULE_3_ISIN", name: "Exact Security ISIN Match", scheme: IdentifierScheme.ISIN, confidence: 1.0 },
  { id: "RULE_4_TICKER", name: "Exact Ticker Symbol Match", scheme: IdentifierScheme.TICKER, confidence: 0.95 },
  { id: "RULE_5_COMPANIES_HOUSE", name: "Exact UK Companies House # Match", scheme: IdentifierScheme.COMPANIES_HOUSE, confidence: 1.0 }
];

export class EntityResolver {
  private readonly entities = new Map<string, Entity>();
  private readonly identifierIndex = new Map<string, string>(); // "scheme:value" -> entity_id
  private readonly mergeLedger: MergeAuditRecord[] = [];
  private readonly proposals: MergeProposal[] = [];
  private readonly parentMap = new Map<string, string>(); // Union-Find Disjoint Set

  constructor() {
    this.seedDefaultEntities();
  }

  private seedDefaultEntities(): void {
    // Seed Apex Tech Inc (CIK: 0001234567, LEI: 5493001KJ9572B569811)
    const e1: Entity = {
      id: "e-apex-tech-001",
      name: "Apex Tech Inc",
      type: EntityType.COMPANY,
      identifiers: [
        { scheme: IdentifierScheme.CIK, value: "0001234567", source: "sec_edgar", confidence: 1.0 },
        { scheme: IdentifierScheme.LEI, value: "5493001KJ9572B569811", source: "usaspending", confidence: 1.0 }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.registerEntity(e1);
  }

  public registerEntity(entity: Entity): void {
    this.entities.set(entity.id, entity);
    this.parentMap.set(entity.id, entity.id);

    for (const ident of entity.identifiers) {
      const idxKey = `${ident.scheme}:${ident.value.toUpperCase()}`;
      this.identifierIndex.set(idxKey, entity.id);
    }
  }

  // Union-Find: Find Root Representative Entity
  public findCanonicalId(entityId: string): string {
    if (!this.parentMap.has(entityId)) return entityId;
    let root = entityId;
    while (root !== this.parentMap.get(root)) {
      root = this.parentMap.get(root)!;
    }
    // Path compression
    let curr = entityId;
    while (curr !== root) {
      const nxt = this.parentMap.get(curr)!;
      this.parentMap.set(curr, root);
      curr = nxt;
    }
    return root;
  }

  /**
   * Resolve an identifier against the graph.
   * If exact identifier match -> returns canonical entity.
   * If no match -> returns null.
   */
  public resolveIdentifier(identifier: EntityIdentifier): Result<Entity | null> {
    const idxKey = `${identifier.scheme}:${identifier.value.toUpperCase()}`;
    const matchedId = this.identifierIndex.get(idxKey);

    if (!matchedId) {
      return ok(null);
    }

    const canonicalId = this.findCanonicalId(matchedId);
    const entity = this.entities.get(canonicalId);
    return ok(entity || null);
  }

  /**
   * Explicit Auditable Union-Find Merge.
   * Never merges on fuzzy name; records exact rule that fired.
   */
  public mergeEntities(
    primaryId: string,
    secondaryId: string,
    ruleId: string,
    matchedIdentifier: string
  ): Result<MergeAuditRecord> {
    const rootA = this.findCanonicalId(primaryId);
    const rootB = this.findCanonicalId(secondaryId);

    if (rootA === rootB) {
      return err(new Error(`Entities ${primaryId} and ${secondaryId} are already merged.`));
    }

    // Perform Union in Disjoint Set
    this.parentMap.set(rootB, rootA);

    const record: MergeAuditRecord = {
      id: crypto.randomUUID(),
      primary_entity_id: rootA,
      merged_entity_id: rootB,
      rule_id: ruleId,
      matched_identifier: matchedIdentifier,
      merged_at: new Date().toISOString(),
      status: "ACTIVE"
    };

    this.mergeLedger.push(record);
    return ok(record);
  }

  /**
   * Reversible Unmerge: Breaks Union-Find link.
   */
  public unmerge(mergeAuditId: string): Result<boolean> {
    const idx = this.mergeLedger.findIndex(m => m.id === mergeAuditId);
    if (idx === -1) {
      return err(new Error(`Merge record '${mergeAuditId}' not found.`));
    }

    const record = this.mergeLedger[idx]!;
    this.parentMap.set(record.merged_entity_id, record.merged_entity_id);
    this.mergeLedger[idx] = { ...record, status: "REVERSED" };

    return ok(true);
  }

  /**
   * Name-only fuzzy match handler -> Creates MergeProposal requiring manual operator confirmation.
   */
  public proposeFuzzyNameMatch(
    entityAId: string,
    entityBId: string,
    name: string,
    confidence: number
  ): MergeProposal {
    const proposal: MergeProposal = {
      id: crypto.randomUUID(),
      entity_a_id: entityAId,
      entity_b_id: entityBId,
      candidate_name: name,
      match_confidence: confidence,
      status: "PENDING"
    };
    this.proposals.push(proposal);
    return proposal;
  }

  public getMergeLedger(): readonly MergeAuditRecord[] {
    return [...this.mergeLedger];
  }

  public getProposals(): readonly MergeProposal[] {
    return [...this.proposals];
  }

  public getEntity(id: string): Entity | undefined {
    const canonicalId = this.findCanonicalId(id);
    return this.entities.get(canonicalId);
  }

  public listAllEntities(): readonly Entity[] {
    return Array.from(this.entities.values());
  }
}
