import { Opening } from '../types';

export interface OpeningNode {
  id: string;
  name: string; // Short display name (e.g., "Paris Gambit" or "Gent Gambit")
  fullName: string; // Full name (e.g., "Amar Opening: Paris Gambit, Gent Gambit")
  eco: string;
  level: 1 | 2 | 3;
  opening?: Opening;
  children: OpeningNode[];
  totalVariantsCount: number; // Total number of selectable openings in this subtree
}

/**
 * Parses an opening name according to standard ECO conventions:
 * "Family: Variant, Subvariant"
 */
export function parseOpeningName(fullName: string): {
  familyName: string;
  variantName: string | null;
  subvariantName: string | null;
} {
  let familyName = '';
  let variantName: string | null = null;
  let subvariantName: string | null = null;

  if (fullName.includes(':')) {
    const colonIdx = fullName.indexOf(':');
    familyName = fullName.slice(0, colonIdx).trim();
    const rest = fullName.slice(colonIdx + 1).trim();
    if (rest.includes(',')) {
      const commaIdx = rest.indexOf(',');
      variantName = rest.slice(0, commaIdx).trim();
      subvariantName = rest.slice(commaIdx + 1).trim();
    } else {
      variantName = rest;
    }
  } else if (fullName.includes(',')) {
    const commaIdx = fullName.indexOf(',');
    familyName = fullName.slice(0, commaIdx).trim();
    variantName = fullName.slice(commaIdx + 1).trim();
  } else {
    familyName = fullName.trim();
  }

  return { familyName, variantName, subvariantName };
}

interface IntermediateNode {
  id: string;
  name: string;
  fullName: string;
  eco: string;
  level: 1 | 2 | 3;
  opening?: Opening;
  childrenMap: Map<string, IntermediateNode>;
}

/**
 * Builds a hierarchical tree structure (Family -> Variant -> Subvariant)
 * from a flat list of openings.
 */
export function buildOpeningTree(openings: Opening[]): OpeningNode[] {
  const rootFamilies = new Map<string, IntermediateNode>();

  openings.forEach((op, index) => {
    // Skip template or invalid entries if any
    if (!op.name || op.name === 'name' || !op.pgn || op.pgn === 'pgn') {
      return;
    }

    const { familyName, variantName, subvariantName } = parseOpeningName(op.name);
    if (!familyName) return;

    // 1. Level 1 - Family
    const familyKey = familyName.toLowerCase();
    if (!rootFamilies.has(familyKey)) {
      rootFamilies.set(familyKey, {
        id: `fam_${familyName}`,
        name: familyName,
        fullName: familyName,
        eco: op.eco,
        level: 1,
        opening: undefined,
        childrenMap: new Map(),
      });
    }
    const familyNode = rootFamilies.get(familyKey)!;
    if (!familyNode.eco && op.eco) familyNode.eco = op.eco;

    if (!variantName && !subvariantName) {
      // Direct family opening
      familyNode.opening = op;
      return;
    }

    // 2. Level 2 - Variant
    const safeVariantName = variantName || 'Principal';
    const variantKey = safeVariantName.toLowerCase();
    if (!familyNode.childrenMap.has(variantKey)) {
      familyNode.childrenMap.set(variantKey, {
        id: `${familyNode.id}_var_${safeVariantName}`,
        name: safeVariantName,
        fullName: `${familyName}: ${safeVariantName}`,
        eco: op.eco,
        level: 2,
        opening: undefined,
        childrenMap: new Map(),
      });
    }
    const variantNode = familyNode.childrenMap.get(variantKey)!;

    if (!subvariantName) {
      variantNode.opening = op;
      return;
    }

    // 3. Level 3 - Subvariant
    const subKey = `${subvariantName.toLowerCase()}_${index}`;
    variantNode.childrenMap.set(subKey, {
      id: `${variantNode.id}_sub_${subvariantName}_${index}`,
      name: subvariantName,
      fullName: op.name,
      eco: op.eco,
      level: 3,
      opening: op,
      childrenMap: new Map(),
    });
  });

  // Helper to convert intermediate nodes to final OpeningNode with count
  function convertToNode(intermediate: IntermediateNode): OpeningNode {
    const children = Array.from(intermediate.childrenMap.values()).map(convertToNode);
    let count = intermediate.opening ? 1 : 0;
    children.forEach((child) => {
      count += child.totalVariantsCount;
    });

    return {
      id: intermediate.id,
      name: intermediate.name,
      fullName: intermediate.fullName,
      eco: intermediate.eco,
      level: intermediate.level,
      opening: intermediate.opening,
      children,
      totalVariantsCount: count,
    };
  }

  return Array.from(rootFamilies.values()).map(convertToNode);
}

/**
 * Finds all ancestor IDs for a given opening to auto-expand the tree.
 */
export function getAncestorIdsForOpening(
  tree: OpeningNode[],
  targetOpening: Opening | null | undefined
): string[] {
  if (!targetOpening) return [];

  const path: string[] = [];

  function search(node: OpeningNode): boolean {
    const isMatch =
      node.opening &&
      (node.opening.name === targetOpening.name && node.opening.pgn === targetOpening.pgn);

    if (isMatch) {
      return true;
    }

    if (node.children.length > 0) {
      for (const child of node.children) {
        if (search(child)) {
          path.push(node.id);
          return true;
        }
      }
    }

    return false;
  }

  for (const root of tree) {
    if (search(root)) {
      path.push(root.id);
      break;
    }
  }

  return path;
}

/**
 * Filters the opening tree based on a search term, returning filtered nodes
 * and the IDs of all ancestors that should be auto-expanded to reveal matches.
 */
export function filterOpeningTree(
  tree: OpeningNode[],
  searchQuery: string
): {
  filteredTree: OpeningNode[];
  autoExpandedIds: Set<string>;
  totalMatches: number;
} {
  const query = searchQuery.trim().toLowerCase();
  if (!query) {
    return {
      filteredTree: tree,
      autoExpandedIds: new Set(),
      totalMatches: tree.reduce((acc, node) => acc + node.totalVariantsCount, 0),
    };
  }

  const autoExpandedIds = new Set<string>();
  let totalMatches = 0;

  function filterNode(node: OpeningNode): OpeningNode | null {
    const nameMatches =
      node.name.toLowerCase().includes(query) ||
      node.fullName.toLowerCase().includes(query) ||
      (node.eco && node.eco.toLowerCase().includes(query));

    const filteredChildren: OpeningNode[] = [];
    for (const child of node.children) {
      const filteredChild = filterNode(child);
      if (filteredChild) {
        filteredChildren.push(filteredChild);
      }
    }

    const hasMatchingDescendants = filteredChildren.length > 0;
    const isDirectMatch = nameMatches && !!node.opening;

    if (isDirectMatch) {
      totalMatches++;
    }

    if (nameMatches || hasMatchingDescendants) {
      if (hasMatchingDescendants) {
        autoExpandedIds.add(node.id);
      }

      return {
        ...node,
        children: filteredChildren,
      };
    }

    return null;
  }

  const filteredTree: OpeningNode[] = [];
  for (const root of tree) {
    const filteredRoot = filterNode(root);
    if (filteredRoot) {
      filteredTree.push(filteredRoot);
    }
  }

  return {
    filteredTree,
    autoExpandedIds,
    totalMatches,
  };
}
