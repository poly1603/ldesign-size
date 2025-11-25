/**
 * Size 包优化模块导出
 */

// 从 compute.ts 导出
export {
  ComputeOptimizer as ResponsiveComputeOptimizer,
  createComputeOptimizer as createResponsiveComputeOptimizer,
  createCachedCompute,
  type ComputeConfig as ResponsiveComputeConfig,
} from './compute';

// 从 responsive.ts 导出
export {
  ResponsiveManager as EnhancedResponsiveManager,
  createResponsiveManager as createEnhancedResponsiveManager,
  responsiveManager as enhancedResponsive,
  type Breakpoint,
  type ContainerQueryConfig,
  type ResponsiveConfig,
} from './responsive';