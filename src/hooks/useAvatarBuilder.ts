import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  VoxelAvatarOptions,
  VoxelCategory,
  VoxelColorGroup,
} from '../types/avatar';
import {
  VOXEL_CATEGORIES,
  VOXEL_COLOR_GROUPS,
  DEFAULT_USER_AVATAR_OPTIONS,
} from '../data/voxelArtSchema';
import {
  generateVoxelAvatarDataUri,
  getUserAvatarOptions,
  saveUserAvatarOptions,
} from '../utils/avatarGenerator';
import { USER_AVATAR_UPDATED_EVENT } from '../utils/storage';

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function useAvatarBuilder() {
  const [savedOptions, setSavedOptions] = useState<VoxelAvatarOptions>(() =>
    getUserAvatarOptions()
  );
  const [options, setOptions] = useState<VoxelAvatarOptions>(() => ({
    ...savedOptions,
  }));

  // Sync with global storage changes
  useEffect(() => {
    const handleAvatarUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<VoxelAvatarOptions>;
      if (customEvent.detail) {
        setSavedOptions(customEvent.detail);
      } else {
        setSavedOptions(getUserAvatarOptions());
      }
    };

    window.addEventListener(USER_AVATAR_UPDATED_EVENT, handleAvatarUpdated);
    return () => {
      window.removeEventListener(USER_AVATAR_UPDATED_EVENT, handleAvatarUpdated);
    };
  }, []);

  // When opening or re-initializing, ensure we load stored options
  const reloadFromStorage = useCallback(() => {
    const current = getUserAvatarOptions();
    setSavedOptions(current);
    setOptions({ ...current });
  }, []);

  // Live memoized preview SVG data URI
  const svgDataUri = useMemo(() => {
    return generateVoxelAvatarDataUri(options, 256, 16);
  }, [options]);

  // Check if options have been modified compared to saved state
  const isDirty = useMemo(() => {
    return JSON.stringify(options) !== JSON.stringify(savedOptions);
  }, [options, savedOptions]);

  // Helper to get all options for a specific category including 'none'
  const getVariantsForCategory = useCallback((category: VoxelCategory) => {
    const catDef = VOXEL_CATEGORIES.find((c) => c.id === category);
    if (!catDef) return [];

    const variants = [...catDef.variants];
    if (catDef.allowNone) {
      return [{ id: 'none', label: 'Nenhum / Sem' }, ...variants];
    }
    return variants;
  }, []);

  // Get current active variant id for a category
  const getCurrentVariantId = useCallback(
    (category: VoxelCategory): string => {
      switch (category) {
        case 'top':
          return options.topVariant ?? 'none';
        case 'outfit':
          return options.outfitVariant ?? 'plain';
        case 'eyes':
          return options.eyesVariant ?? 'open';
        case 'mouth':
          return options.mouthVariant ?? 'smile';
        case 'eyebrows':
          return options.eyebrowsVariant ?? 'flat';
        case 'nose':
          return options.noseVariant ?? 'block';
        case 'beard':
          return options.beardVariant ?? 'none';
        case 'glasses':
          return options.glassesVariant ?? 'none';
        case 'cheeks':
          return options.cheeksVariant ?? 'none';
        default:
          return 'none';
      }
    },
    [options]
  );

  // Set explicit variant for category
  const setCategoryVariant = useCallback(
    (category: VoxelCategory, variantId: string) => {
      setOptions((prev) => {
        const next = { ...prev };
        switch (category) {
          case 'top':
            next.topVariant = variantId;
            next.topProbability = variantId === 'none' ? 0 : 100;
            break;
          case 'outfit':
            next.outfitVariant = variantId;
            break;
          case 'eyes':
            next.eyesVariant = variantId;
            break;
          case 'mouth':
            next.mouthVariant = variantId;
            break;
          case 'eyebrows':
            next.eyebrowsVariant = variantId;
            next.eyebrowsProbability = variantId === 'none' ? 0 : 100;
            break;
          case 'nose':
            next.noseVariant = variantId;
            break;
          case 'beard':
            next.beardVariant = variantId;
            next.beardProbability = variantId === 'none' ? 0 : 100;
            break;
          case 'glasses':
            next.glassesVariant = variantId;
            next.glassesProbability = variantId === 'none' ? 0 : 100;
            break;
          case 'cheeks':
            next.cheeksVariant = variantId;
            next.cheeksProbability = variantId === 'none' ? 0 : 100;
            break;
        }
        return next;
      });
    },
    []
  );

  // Navigate to next variant for a category
  const nextVariant = useCallback(
    (category: VoxelCategory) => {
      const list = getVariantsForCategory(category);
      if (list.length === 0) return;

      const currentId = getCurrentVariantId(category);
      const currentIndex = list.findIndex((v) => v.id === currentId);
      const nextIndex = (currentIndex + 1) % list.length;
      setCategoryVariant(category, list[nextIndex].id);
    },
    [getVariantsForCategory, getCurrentVariantId, setCategoryVariant]
  );

  // Navigate to previous variant for a category
  const prevVariant = useCallback(
    (category: VoxelCategory) => {
      const list = getVariantsForCategory(category);
      if (list.length === 0) return;

      const currentId = getCurrentVariantId(category);
      const currentIndex = list.findIndex((v) => v.id === currentId);
      const prevIndex = currentIndex <= 0 ? list.length - 1 : currentIndex - 1;
      setCategoryVariant(category, list[prevIndex].id);
    },
    [getVariantsForCategory, getCurrentVariantId, setCategoryVariant]
  );

  // Set color for color group
  const setColor = useCallback(
    (group: VoxelColorGroup, hex: string) => {
      const clean = hex.replace(/^#/, '');
      setOptions((prev) => {
        if (group === 'backgroundColor') {
          return { ...prev, backgroundColor: [clean] };
        }
        return { ...prev, [group]: clean };
      });
    },
    []
  );

  // Randomize all categories and colors
  const randomize = useCallback(() => {
    const randomOptions: Record<string, any> = {
      animationVariant: 'none',
    };

    // Category parts
    VOXEL_CATEGORIES.forEach((cat) => {
      const variants = cat.variants;
      if (cat.allowNone) {
        // Higher chance of having top/eyebrows, moderate/lower chance for beard/glasses/cheeks
        let chanceOfNone = 0.5;
        if (cat.id === 'top') chanceOfNone = 0.05;
        if (cat.id === 'eyebrows') chanceOfNone = 0.1;
        if (cat.id === 'beard') chanceOfNone = 0.65;
        if (cat.id === 'glasses') chanceOfNone = 0.7;
        if (cat.id === 'cheeks') chanceOfNone = 0.6;

        if (Math.random() < chanceOfNone) {
          randomOptions[`${cat.id}Variant`] = 'none';
          randomOptions[`${cat.id}Probability`] = 0;
        } else {
          const picked = getRandomItem(variants);
          randomOptions[`${cat.id}Variant`] = picked.id;
          randomOptions[`${cat.id}Probability`] = 100;
        }
      } else {
        const picked = getRandomItem(variants);
        randomOptions[`${cat.id}Variant`] = picked.id;
      }
    });

    // Colors
    VOXEL_COLOR_GROUPS.forEach((colorGroup) => {
      const pickedColor = getRandomItem(colorGroup.colors).hex;
      if (colorGroup.id === 'backgroundColor') {
        randomOptions.backgroundColor = [pickedColor];
      } else {
        randomOptions[colorGroup.id] = pickedColor;
      }
    });

    setOptions(randomOptions as VoxelAvatarOptions);
  }, []);

  // Save current options to storage
  const save = useCallback(() => {
    saveUserAvatarOptions(options);
    setSavedOptions({ ...options });
    return options;
  }, [options]);

  // Revert back to saved options or defaults
  const reset = useCallback(() => {
    setOptions({ ...savedOptions });
  }, [savedOptions]);

  const resetToDefault = useCallback(() => {
    setOptions({ ...DEFAULT_USER_AVATAR_OPTIONS });
  }, []);

  return {
    options,
    savedOptions,
    svgDataUri,
    isDirty,
    getVariantsForCategory,
    getCurrentVariantId,
    setCategoryVariant,
    nextVariant,
    prevVariant,
    setColor,
    randomize,
    save,
    reset,
    resetToDefault,
    reloadFromStorage,
  };
}
