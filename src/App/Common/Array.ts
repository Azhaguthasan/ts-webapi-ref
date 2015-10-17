interface Array<T> {
    hasAny: () => boolean;
    first: () => T;
    firstMatch: (predicate: (item: T) => boolean) => T;
    groupBy: <TKey>(keySelector: (item: T) => TKey) => Array<Array<T>>;
    orderBy: <TKey>(keySelector: (item: T) => TKey) => Array<T>;
    last: () => T;
    clear: () => void;
    take: (count: number) => Array<T>;    
    pushRange: (items: Array<T>) => void;
}