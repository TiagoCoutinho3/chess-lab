import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Opening } from '../types';
import {
  OpeningNode,
  buildOpeningTree,
  filterOpeningTree,
  getAncestorIdsForOpening,
} from '../utils/openingsTree';
import {
  ChevronRight,
  Search,
  X,
  BookOpen,
  Play,
  Check,
  Layers,
  Sparkles,
} from 'lucide-react';

interface OpeningsTreeListProps {
  openings: Opening[];
  selectedOpening: Opening;
  onSelectOpening: (opening: Opening) => void;
}

export const OpeningsTreeList: React.FC<OpeningsTreeListProps> = ({
  openings,
  selectedOpening,
  onSelectOpening,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const selectedItemRef = useRef<HTMLButtonElement | null>(null);

  // Build the hierarchical tree in memory
  const fullTree = useMemo(() => {
    return buildOpeningTree(openings);
  }, [openings]);

  // Filter tree based on search query
  const { filteredTree, autoExpandedIds, totalMatches } = useMemo(() => {
    return filterOpeningTree(fullTree, searchQuery);
  }, [fullTree, searchQuery]);

  // When selected opening changes, auto-expand its ancestor nodes
  useEffect(() => {
    const ancestors = getAncestorIdsForOpening(fullTree, selectedOpening);
    if (ancestors.length > 0) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        ancestors.forEach((id) => next.add(id));
        return next;
      });
    }
  }, [selectedOpening, fullTree]);

  // When searching, auto-expand nodes that match or contain matches
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        autoExpandedIds.forEach((id) => next.add(id));
        return next;
      });
    }
  }, [searchQuery, autoExpandedIds]);

  const toggleExpand = (nodeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const isOpeningSelected = (op?: Opening) => {
    if (!op) return false;
    return op.name === selectedOpening.name && op.eco === selectedOpening.eco;
  };

  const handleNodeClick = (node: OpeningNode) => {
    if (node.opening) {
      onSelectOpening(node.opening);
    }
    // If node has children, ensure it expands when clicked
    if (node.children.length > 0) {
      if (!expandedIds.has(node.id)) {
        toggleExpand(node.id);
      }
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search and filter header */}
      <div className="mb-3 space-y-2 flex-shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por abertura ou variante..."
            className="w-full pl-9 pr-8 py-2 bg-[#F7F9FC] focus:bg-white border border-[#DDE3EA] focus:border-[#8AA7E1] rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {searchQuery.trim() !== '' && (
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>
              {totalMatches === 0
                ? 'Nenhuma abertura encontrada'
                : `${totalMatches} resultado${totalMatches === 1 ? '' : 's'}`}
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#5B21B6] hover:underline font-semibold"
            >
              Limpar filtro
            </button>
          </div>
        )}
      </div>

      {/* Tree list with scroll */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
        {filteredTree.length === 0 ? (
          <div className="text-center py-10 px-4 text-slate-400">
            <p className="text-xs font-semibold">Nenhuma abertura encontrada.</p>
            <p className="text-[11px] mt-1">Tente buscar por outro termo.</p>
          </div>
        ) : (
          filteredTree.map((familyNode) => {
            const isFamExpanded = expandedIds.has(familyNode.id);
            const isFamActive = isOpeningSelected(familyNode.opening);
            const hasChildren = familyNode.children.length > 0;

            return (
              <div
                key={familyNode.id}
                className={`rounded-2xl border transition-all duration-150 overflow-hidden ${
                  isFamActive
                    ? 'border-[#8AA7E1] bg-[#F0F5FF]'
                    : isFamExpanded
                    ? 'border-slate-200 bg-white shadow-xs'
                    : 'border-[#EAEFF5] bg-[#F7F9FC]/70 hover:bg-[#F7F9FC] hover:border-slate-300'
                }`}
              >
                {/* Level 1: Family Row */}
                <div
                  onClick={() => {
                    if (familyNode.opening) {
                      handleNodeClick(familyNode);
                    } else if (hasChildren) {
                      toggleExpand(familyNode.id);
                    }
                  }}
                  className={`w-full p-2.5 flex items-center justify-between gap-2 text-left cursor-pointer select-none transition-colors ${
                    isFamActive
                      ? 'text-[#1E40AF]'
                      : 'text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {/* Expand/Collapse Button */}
                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={(e) => toggleExpand(familyNode.id, e)}
                        className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-all flex-shrink-0"
                        title={isFamExpanded ? 'Recolher' : 'Expandir'}
                      >
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isFamExpanded ? 'rotate-90 text-slate-700' : ''
                          }`}
                        />
                      </button>
                    ) : (
                      <div className="w-6 flex-shrink-0 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold truncate ${
                            isFamActive ? 'text-[#1E40AF]' : 'text-slate-900'
                          }`}
                        >
                          {familyNode.name}
                        </span>
                        {isFamActive && (
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
                        )}
                      </div>
                      {hasChildren && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          {familyNode.totalVariantsCount} variaç
                          {familyNode.totalVariantsCount === 1 ? 'ão' : 'ões'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Single ECO badge on Family Level */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#EDE7FF] text-[#5B21B6] border border-[#DDD6FE]">
                      {familyNode.eco}
                    </span>
                  </div>
                </div>

                {/* Level 2 & Level 3: Indented Variants and Subvariants */}
                {hasChildren && isFamExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 py-1.5 pl-3 pr-2 space-y-1">
                    {familyNode.children.map((variantNode) => {
                      const isVarExpanded = expandedIds.has(variantNode.id);
                      const isVarActive = isOpeningSelected(variantNode.opening);
                      const hasSubchildren = variantNode.children.length > 0;

                      return (
                        <div
                          key={variantNode.id}
                          className="relative pl-3 border-l-2 border-slate-200 hover:border-slate-300 transition-colors"
                        >
                          {/* Level 2: Variant Row */}
                          <button
                            type="button"
                            ref={isVarActive ? selectedItemRef : null}
                            onClick={() => handleNodeClick(variantNode)}
                            className={`w-full py-1.5 px-2 rounded-xl text-left text-xs transition-all flex items-center justify-between gap-2 group ${
                              isVarActive
                                ? 'bg-[#8AA7E1] text-white font-bold shadow-xs'
                                : 'text-slate-700 hover:bg-slate-200/50'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              {hasSubchildren && (
                                <span
                                  onClick={(e) => toggleExpand(variantNode.id, e)}
                                  className={`p-0.5 rounded hover:bg-black/10 transition-transform duration-150 ${
                                    isVarExpanded ? 'rotate-90' : ''
                                  }`}
                                >
                                  <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                                </span>
                              )}
                              <span className="truncate">{variantNode.name}</span>
                            </div>

                            <div className="flex items-center gap-1 flex-shrink-0">
                              {hasSubchildren && !isVarActive && (
                                <span className="text-[10px] text-slate-400 font-normal">
                                  {variantNode.children.length}
                                </span>
                              )}
                              {isVarActive && (
                                <Check className="w-3.5 h-3.5 text-white" />
                              )}
                            </div>
                          </button>

                          {/* Level 3: Subvariant Rows */}
                          {hasSubchildren && isVarExpanded && (
                            <div className="pl-3 py-1 space-y-1 border-l border-slate-200 ml-2 mt-1">
                              {variantNode.children.map((subNode) => {
                                const isSubActive = isOpeningSelected(subNode.opening);

                                return (
                                  <button
                                    key={subNode.id}
                                    type="button"
                                    ref={isSubActive ? selectedItemRef : null}
                                    onClick={() => handleNodeClick(subNode)}
                                    className={`w-full py-1 px-2 rounded-lg text-left text-[11px] transition-all flex items-center justify-between gap-2 ${
                                      isSubActive
                                        ? 'bg-[#8AA7E1] text-white font-bold shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                      <span
                                        className={`w-1 h-1 rounded-full flex-shrink-0 ${
                                          isSubActive ? 'bg-white' : 'bg-slate-400'
                                        }`}
                                      />
                                      <span className="truncate">{subNode.name}</span>
                                    </div>
                                    {isSubActive && (
                                      <Check className="w-3 h-3 text-white flex-shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
