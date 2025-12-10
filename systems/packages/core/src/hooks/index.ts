/**
 * Hooks Module - React hooks for react-antd-admin-panel
 * 
 * Provides modern React hooks alongside the builder pattern for:
 * - HTTP requests (useGet, usePost)
 * - List state management (useList)
 * - Form handling (useForm)
 * - Access control (useAccess)
 */

// HTTP hooks
export { useGet } from './useGet';
export type { UseGetOptions, UseGetResult } from './useGet';

export { usePost } from './usePost';
export type { UsePostOptions, UsePostResult, UsePostMethod } from './usePost';

// List hook
export { useList } from './useList';
export type { UseListOptions, UseListResult, UseListPagination, UseListGetConfig } from './useList';

// Form hook
export { useForm } from './useForm';
export type { UseFormOptions, UseFormResult, ValidateFunction } from './useForm';

// Access control hook
export { useAccess } from './useAccess';
export type { UseAccessResult, AccessCheck, FeatureAccess } from './useAccess';

// Re-export existing hooks from main module for convenience
export { useMain, useUser, useStore, useStoreActions } from '../main/MainContext';
