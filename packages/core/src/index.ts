import { generateId, sum } from '@ts-monorepo/utils';

/** 创建用户 API */
export const createUser = (name: string) => {
  return {
    id: generateId(),       // 使用 utils 的函数
    name,
    score: sum(80, 20),     // 使用 utils 的函数
    createTime: new Date().toLocaleString()
  };
};