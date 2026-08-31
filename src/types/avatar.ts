export type VoxelCategory =
  | 'top'
  | 'outfit'
  | 'eyes'
  | 'mouth'
  | 'eyebrows'
  | 'nose'
  | 'beard'
  | 'glasses'
  | 'cheeks';

export type VoxelColorGroup =
  | 'skinColor'
  | 'hairColor'
  | 'shirtColor'
  | 'jacketColor'
  | 'hatColor'
  | 'pantsColor'
  | 'shoesColor'
  | 'backgroundColor';

export interface VoxelAvatarOptions {
  topVariant?: string;
  topProbability?: number;
  outfitVariant?: string;
  eyesVariant?: string;
  mouthVariant?: string;
  eyebrowsVariant?: string;
  eyebrowsProbability?: number;
  noseVariant?: string;
  beardVariant?: string;
  beardProbability?: number;
  glassesVariant?: string;
  glassesProbability?: number;
  cheeksVariant?: string;
  cheeksProbability?: number;
  animationVariant?: 'none' | 'fast' | 'fastest' | 'medium' | 'slow' | 'slowest';

  // Colors (hex string without # or with #)
  skinColor?: string;
  hairColor?: string;
  shirtColor?: string;
  jacketColor?: string;
  hatColor?: string;
  pantsColor?: string;
  shoesColor?: string;
  backgroundColor?: string[];
}

export interface CategoryDefinition {
  id: VoxelCategory;
  label: string;
  description?: string;
  allowNone: boolean;
  variants: {
    id: string;
    label: string;
  }[];
}

export interface ColorGroupDefinition {
  id: VoxelColorGroup;
  label: string;
  colors: {
    hex: string;
    label?: string;
  }[];
}
