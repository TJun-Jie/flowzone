export enum ColumnType {
  checkbox = "checkbox",
  actions = "actions",
  dateSort = "dateSort",
}

export type ColumnConfig<K> = {
  key: keyof K | null | ColumnType;
  title: string;
  isVisible: boolean;
  width?: string;
  currentIndex?: number;
  type?: ColumnType;
};
