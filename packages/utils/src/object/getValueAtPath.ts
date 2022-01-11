import get from 'get-value';

import isObject from './isObject';

import type { AnyObject, ObjectPath, ValueAtPath } from '../types';


export default function getValueAtPath<Values extends AnyObject, Path extends ObjectPath<Values> = ObjectPath<Values>>(
  object: Values, path: Path
): ValueAtPath<Values, Path> | null {
  /** Assert is valid object */
  if (!isObject(object)) {
    return null;
  }

  /** Use the module function */
  return get(object, path);
}
