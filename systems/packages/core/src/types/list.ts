/**
 * List/Table component types
 * Note: The main List types (ListColumnConfig, ListActionConfig, ListConfig) 
 * are defined in the list module (src/list/index.ts) with more complete implementations.
 * This file contains only supplementary types.
 */

export interface ListPaginationConfig {
  current?: number;
  pageSize?: number;
  total?: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  pageSizeOptions?: number[];
}
