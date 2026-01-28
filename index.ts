export interface Comic {
  id: string;
  title: string;
  issueNumber: string;
  volume: string;
  publisher: string;
  publishDate: string;
  writers: string[];
  artists: string[];
  colorists: string[];
  letterers: string[];
  coverArtists: string[];
  editors: string[];
  description: string;
  pageCount: number;
  firstAppearances: string[];
  keyEvents: string[];
  variants: string[];
  coverImage?: string;
}

export interface CollectionItem extends Comic {
  id: string;
  conditionGrade: string;
  purchasePrice: number;
  currentValue: number;
  addedDate: string;
  location?: string;
  notes?: string;
}

export interface DealerInventoryItem extends CollectionItem {
  sku?: string;
  cost: number;
  listingPrice: number;
  sold: boolean;
  soldDate?: string;
  soldPrice?: number;
  consignmentPercentage?: number;
}

export interface PricingInfo {
  title: string;
  issueNumber: string;
  prices: {
    grade: string;
    price: number;
    currency: string;
  }[];
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
  lastUpdated: string;
  source: string;
}

export interface ConditionAnalysis {
  grade: string;
  score: number;
  details: {
    coverGloss: string;
    spineCondition: string;
    cornerCondition: string;
    pageQuality: string;
    bindingCondition: string;
    overallAppearance: string;
  };
  recommendations: string[];
}

export interface WantListItem {
  id: string;
  title: string;
  addedDate: string;
  found: boolean;
  targetPrice?: number;
  notes?: string;
}

export interface PriceAlert {
  id: string;
  comicId: string;
  title: string;
  targetPrice: number;
  currentPrice: number;
  active: boolean;
  createdDate: string;
}
