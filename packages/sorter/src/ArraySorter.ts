// eslint-disable-next-line max-classes-per-file
import naturalCompare from 'natural-compare';

import { isNil, getValueAtPath } from '@appbuckets/utils';
import type { Path } from '@appbuckets/utils';

import { Comparison, ComparisonOrder, ArraySorterOptions } from './ArraySorter.types';


/* --------
 * The Array Comparator Internal SubClass
 * -------- */
class ArraySorterComparator<T extends object> {

  private nextStep: ArraySorterComparator<T> | undefined = undefined;


  constructor(
    private readonly arraySorter: ArraySorter<T>,
    private readonly comparison: Comparison<T>,
    private readonly sortOrder: ComparisonOrder
  ) {
  }


  /**
   * Set a next step order by some field
   * @param comparison
   */
  thenBy(comparison: Comparison<T>): ArraySorterComparator<T> {
    /** Set the new comparison as next step */
    this.nextStep = new ArraySorterComparator<T>(this.arraySorter, comparison, 'asc');
    /** Return the next step */
    return this.nextStep;
  }


  /**
   * Set a next step order by descending by some field
   * @param comparison
   */
  thenByDescending(comparison: Comparison<T>): ArraySorterComparator<T> {
    /** Set the new comparison as next step */
    this.nextStep = new ArraySorterComparator<T>(this.arraySorter, comparison, 'desc');
    /** Return the next step */
    return this.nextStep;
  }


  private getSortOrder(firstItem: T, nextItem: T, options?: ArraySorterOptions): number {
    const placement = this.getNaturalSortOrder(firstItem, nextItem, options);
    return this.sortOrder === 'asc' ? placement : placement * -1;
  }


  private getNaturalSortOrder(firstItem: T, nextItem: T, options?: ArraySorterOptions): number {
    const {
      compareStringCase = 'insensitive',
      placeFalse = 'after',
      placeNil = 'after'
    } = options || {};

    /** Get values */
    const firstItemValue = typeof this.comparison === 'function'
      ? this.comparison(firstItem)
      : getValueAtPath(firstItem, this.comparison as Path<T>);

    const nextItemValue = typeof this.comparison === 'function'
      ? this.comparison(nextItem)
      : getValueAtPath(nextItem, this.comparison as Path<T>);

    /** Assert object type is the same */
    if (typeof firstItemValue !== typeof nextItemValue) {
      throw new Error('Sorting is valid only for item of the same type');
    }

    /** Assert type are valid */
    if (!/string|number|boolean/.test(typeof firstItemValue)) {
      throw new Error(`Only primitive type could be used to sort data. Found ${typeof firstItemValue}`);
    }

    /** If value are the same, check if a next stem exists */
    if ((isNil(firstItemValue) && isNil(nextItemValue)) || firstItemValue === nextItemValue) {
      return this.nextStep
        ? this.nextStep.getSortOrder(firstItem, nextItem, options)
        : 0;
    }

    /** If the next item value is nil, choose placement using options */
    if (isNil(nextItemValue)) {
      return placeNil === 'after' ? 1 : -1;
    }

    /** Revert logic or first item */
    if (isNil(firstItemValue)) {
      return placeNil === 'after' ? -1 : 1;
    }

    /** Check boolean value */
    if (typeof firstItemValue === 'boolean') {
      return nextItemValue === false
        ? placeFalse === 'after' ? 1 : -1
        : placeFalse === 'after' ? -1 : 1;
    }

    /** Natural string comparing */
    if (typeof firstItemValue === 'string') {
      return compareStringCase === 'insensitive'
        ? naturalCompare(firstItemValue.toLocaleLowerCase(), (nextItemValue || '').toLocaleLowerCase())
        : naturalCompare(firstItemValue, nextItemValue as string);
    }

    /** Return normal cardinal comparing */
    return firstItemValue - nextItemValue;
  }


  /**
   * Sort data
   */
  sort(options?: ArraySorterOptions): T[] {
    /** Return sorted data */
    return this.arraySorter.data.sort((firstItem, nextItem) => (
      this.getSortOrder(firstItem, nextItem, options)
    ));
  }

}


/* --------
 * The Main ArraySorter class
 * -------- */
export default class ArraySorter<T extends object> {

  constructor(public readonly data: T[]) {
  }


  /**
   * Set the first ordering clause
   * @param comparison
   */
  orderBy(comparison: Comparison<T>): ArraySorterComparator<T> {
    /** Return the comparator instance */
    return new ArraySorterComparator<T>(this, comparison, 'asc');
  }


  /**
   * Set the first ordering clause by descending
   * @param comparison
   */
  orderByDescending(comparison: Comparison<T>): ArraySorterComparator<T> {
    /** Return the comparator instance */
    return new ArraySorterComparator<T>(this, comparison, 'desc');
  }

}
