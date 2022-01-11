import isNil from './isNil';


export default function isObject(value: any): value is object {
  return typeof value === 'object' && !isNil(value) && !Array.isArray(value);
}
