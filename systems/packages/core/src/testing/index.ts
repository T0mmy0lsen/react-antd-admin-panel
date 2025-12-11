/**
 * Testing Module - Test utilities and mock helpers
 * 
 * Provides utilities for testing applications built with react-antd-admin-panel:
 * - createMockMain: Creates a mock MainProvider for testing
 * - createMockList: Creates a mock List with test data
 * - createMockHttp: Mocks HTTP requests (Get/Post)
 */

export { createMockMain, type MockMainOptions, type MockMainResult } from './createMockMain';
export { createMockList, type MockListOptions } from './createMockList';
export { createMockHttp, MockHttp, type MockResponse, type MockHttpConfig } from './createMockHttp';
