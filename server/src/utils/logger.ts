export const info = (...params: string[]) => {
  console.log(...params);
};

export const error = (params: unknown) => {
  console.error(params);
};

export default {info, error};