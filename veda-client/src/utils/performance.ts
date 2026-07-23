// Performance Optimization Utilities

/**
 * Debounce function - delays execution of a function until after X ms of inactivity
 * Useful for search inputs, resize handlers, etc.
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

/**
 * Throttle function - ensures function executes at most once every X ms
 * Useful for scroll handlers, window resize, etc.
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limitMs: number = 300
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return function throttled(...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCall >= limitMs) {
      lastCall = now;
      fn(...args);
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
      }, limitMs - (now - lastCall));
    }
  };
}

/**
 * Lazy load images using Intersection Observer API
 * Improves initial page load performance
 */
export function setupLazyImages() {
  const images = document.querySelectorAll("img[data-lazy]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute("data-lazy");
          if (src) {
            img.src = src;
            img.removeAttribute("data-lazy");
            imageObserver.unobserve(img);
          }
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    images.forEach((img) => {
      const src = (img as HTMLImageElement).getAttribute("data-lazy");
      if (src) {
        (img as HTMLImageElement).src = src;
      }
    });
  }
}

/**
 * Memoization hook for expensive computations
 * Caches results based on dependencies
 */
export function useMemo<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  // This is a placeholder - use React.useMemo instead
  return factory();
}

/**
 * Request Animation Frame wrapper for smooth animations
 * Better performance than setTimeout for animations
 */
export function onNextFrame(callback: () => void) {
  if (typeof window !== "undefined") {
    window.requestAnimationFrame(callback);
  }
}

/**
 * Batch DOM updates to minimize reflows/repaints
 * Executes multiple DOM operations in a single batch
 */
export function batchDOMUpdates(updates: () => void) {
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(updates);
  } else {
    setTimeout(updates, 0);
  }
}

/**
 * Virtual scrolling helper - renders only visible items
 * Critical for large lists
 */
export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  itemCount: number;
}

export function getVisibleRange(
  scrollTop: number,
  config: VirtualScrollConfig
): { start: number; end: number } {
  const visibleItemCount = Math.ceil(config.containerHeight / config.itemHeight);
  const start = Math.floor(scrollTop / config.itemHeight);
  const end = Math.min(start + visibleItemCount + 1, config.itemCount);

  return { start, end };
}

/**
 * Memory leak prevention - cleanup utilities
 * Helps prevent memory leaks in React components
 */
export class MemoryManager {
  private listeners: Array<{ target: any; event: string; handler: Function }> = [];
  private timers: Set<NodeJS.Timeout> = new Set();
  private observers: Set<IntersectionObserver | ResizeObserver> = new Set();

  addListener(
    target: any,
    event: string,
    handler: (...args: any[]) => void
  ) {
    target.addEventListener(event, handler);
    this.listeners.push({ target, event, handler });
  }

  addTimer(timer: NodeJS.Timeout) {
    this.timers.add(timer);
  }

  addObserver(
    observer: IntersectionObserver | ResizeObserver
  ) {
    this.observers.add(observer);
  }

  cleanup() {
    // Remove all listeners
    this.listeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });
    this.listeners = [];

    // Clear all timers
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();

    // Disconnect all observers
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
  }
}

/**
 * Bundle size optimization - Code splitting helper
 * Dynamically import components for better initial load
 */
export async function dynamicImport<T>(
  importFn: () => Promise<T>,
  timeout: number = 5000
): Promise<T> {
  return Promise.race([
    importFn(),
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error("Dynamic import timeout")),
        timeout
      )
    ),
  ]);
}

/**
 * Cache management utility
 * Simple in-memory cache for API responses
 */
export class CacheManager {
  private cache = new Map<string, { data: any; expiry: number }>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.defaultTTL) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  delete(key: string) {
    this.cache.delete(key);
  }
}

/**
 * Performance monitoring utility
 * Tracks component render times and performance metrics
 */
export class PerformanceMonitor {
  private marks = new Map<string, number>();

  start(label: string) {
    this.marks.set(label, performance.now());
  }

  end(label: string): number {
    const startTime = this.marks.get(label);
    if (!startTime) {
      console.warn(`No start mark for ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(label);

    if (duration > 16) {
      // More than 1 frame (60fps = 16ms per frame)
      console.warn(`Performance issue: ${label} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  clear() {
    this.marks.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();
export const cacheManager = new CacheManager();
