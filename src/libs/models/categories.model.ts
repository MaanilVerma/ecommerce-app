export interface CategoryName {
  name: string;
  id: string;
  isSaved: boolean;
  handleSavedCategories: (e: any) => void;
}

export interface Pagination {
  totalPages: number;
  currentPage: number;
  onPageChange: (selected: number) => void;
}

export interface CategoryDetails {
  id: string;
  name: string;
}

export interface UserSavedInterests {
  id: string;
}

export interface Categories {
  categories: CategoryDetails[];
  userLikedCategories: UserSavedInterests[];
  pageCount: number;
}
