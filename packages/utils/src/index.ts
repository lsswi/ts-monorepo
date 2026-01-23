export const generateId = (): string => {
  return Math.random().toString(36).slice(2, 10);
};

/** 求和工具函数 */
export const sum = (a: number, b: number): number => {
  return a + b;
};

// 新增代码
export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

// add comments

// fix sth

// add some features

// add ddd

// add ccc
