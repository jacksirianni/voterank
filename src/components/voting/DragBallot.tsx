'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { clsx } from 'clsx';

interface Option {
  id: string;
  name: string;
  description?: string | null;
}

interface DragBallotProps {
  options: Option[];
  onRankingChange: (ranking: string[]) => void;
  disabled?: boolean;
}

function SortableOption({ option, index, isRanked }: { option: Option; index: number; isRanked: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        'group relative bg-white rounded-xl border p-4 cursor-grab active:cursor-grabbing',
        'transition-all duration-200 ease-out',
        isDragging ? 'opacity-50 scale-105 shadow-xl border-brand-500 z-50' : 'hover:shadow-md hover:border-slate-300',
        isRanked ? 'border-brand-200 bg-brand-50/30' : 'border-slate-200'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Rank number */}
        {isRanked && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-semibold text-sm">
            {index + 1}
          </div>
        )}
        
        {/* Drag handle */}
        <div className="flex-shrink-0 text-slate-400 group-hover:text-slate-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-slate-900">{option.name}</div>
          {option.description && (
            <div className="text-sm text-slate-500 mt-0.5 line-clamp-1">{option.description}</div>
          )}
        </div>

        {/* Unranked indicator */}
        {!isRanked && (
          <div className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
            Unranked
          </div>
        )}
      </div>
    </div>
  );
}

function DragOverlayContent({ option, index }: { option: Option; index: number }) {
  return (
    <div className="bg-white rounded-xl border border-brand-500 p-4 shadow-2xl scale-105 rotate-2">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-semibold text-sm">
          {index + 1}
        </div>
        <div className="text-slate-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-slate-900">{option.name}</div>
        </div>
      </div>
    </div>
  );
}

export default function DragBallot({ options, onRankingChange, disabled }: DragBallotProps) {
  // Split options into ranked and unranked
  const [rankedIds, setRankedIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const rankedOptions = rankedIds
    .map(id => options.find(o => o.id === id))
    .filter((o): o is Option => o !== undefined);

  const unrankedOptions = options.filter(o => !rankedIds.includes(o.id));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're dealing with ranked vs unranked sections
    const isActiveRanked = rankedIds.includes(activeId);
    const isOverRanked = rankedIds.includes(overId);
    const isOverRankedSection = overId === 'ranked-section';
    const isOverUnrankedSection = overId === 'unranked-section';

    let newRankedIds: string[];

    if (isOverUnrankedSection) {
      // Moving to unranked section - remove from ranking
      newRankedIds = rankedIds.filter(id => id !== activeId);
    } else if (isOverRankedSection || (isOverRanked && !isActiveRanked)) {
      // Moving to ranked section - add to ranking
      if (!rankedIds.includes(activeId)) {
        newRankedIds = [...rankedIds, activeId];
      } else {
        newRankedIds = rankedIds;
      }
    } else if (isActiveRanked && isOverRanked) {
      // Reordering within ranked section
      const oldIndex = rankedIds.indexOf(activeId);
      const newIndex = rankedIds.indexOf(overId);
      newRankedIds = arrayMove(rankedIds, oldIndex, newIndex);
    } else if (!isActiveRanked && !isOverRanked) {
      // Both in unranked - add active to ranked
      newRankedIds = [...rankedIds, activeId];
    } else {
      newRankedIds = rankedIds;
    }

    setRankedIds(newRankedIds);
    onRankingChange(newRankedIds);
  };

  const handleUnrank = useCallback((id: string) => {
    const newRankedIds = rankedIds.filter(rid => rid !== id);
    setRankedIds(newRankedIds);
    onRankingChange(newRankedIds);
  }, [rankedIds, onRankingChange]);

  const handleRank = useCallback((id: string) => {
    const newRankedIds = [...rankedIds, id];
    setRankedIds(newRankedIds);
    onRankingChange(newRankedIds);
  }, [rankedIds, onRankingChange]);

  const activeOption = activeId ? options.find(o => o.id === activeId) : null;
  const activeIndex = activeId ? rankedIds.indexOf(activeId) : -1;

  if (disabled) {
    return (
      <div className="opacity-50 pointer-events-none">
        <div className="text-center py-8 text-slate-500">
          Voting is disabled
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="text-brand-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm text-brand-800">
              <p className="font-medium">Drag candidates to rank them</p>
              <p className="text-brand-600 mt-1">
                Your first choice gets the most support. You don&apos;t have to rank everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Ranked section */}
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs">✓</span>
            Your Ranking ({rankedOptions.length})
          </h3>
          <SortableContext items={rankedIds} strategy={verticalListSortingStrategy}>
            <div 
              className={clsx(
                'min-h-[120px] rounded-xl border-2 border-dashed p-3 space-y-2 transition-colors',
                rankedOptions.length === 0 ? 'border-slate-200 bg-slate-50' : 'border-brand-200 bg-brand-50/30'
              )}
            >
              {rankedOptions.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 py-8">
                  Drag candidates here to rank them
                </div>
              ) : (
                rankedOptions.map((option, index) => (
                  <div key={option.id} className="relative group">
                    <SortableOption option={option} index={index} isRanked={true} />
                    <button
                      onClick={() => handleUnrank(option.id)}
                      className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                      title="Remove from ranking"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </SortableContext>
        </div>

        {/* Unranked section */}
        {unrankedOptions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-3">
              Unranked ({unrankedOptions.length})
            </h3>
            <SortableContext items={unrankedOptions.map(o => o.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {unrankedOptions.map((option, index) => (
                  <div key={option.id} className="relative group cursor-pointer" onClick={() => handleRank(option.id)}>
                    <SortableOption option={option} index={index} isRanked={false} />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-brand-600 text-sm font-medium">
                      Click to add →
                    </div>
                  </div>
                ))}
              </div>
            </SortableContext>
          </div>
        )}
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeOption ? (
          <DragOverlayContent option={activeOption} index={activeIndex >= 0 ? activeIndex : rankedIds.length} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
