(() => {

    function hasAny<T>(): boolean {
        var self: Array<T> = this;
        return self.length > 0;
    }

    Array.prototype.hasAny = hasAny;

    function first<T>() : T {
        var self: Array<T> = this;

        if (!self.hasAny())
            return undefined;

        return self[0];
    } 

    Array.prototype.first = first;

    function last<T>(): T {
        var self: Array<T> = this;

        if (!self.hasAny())
            return undefined;

        return self[self.length-1];
    }

    Array.prototype.last = last;


    function firstMatch<T>(predicate: (item: T) => boolean): T {
        var self: Array<T> = this;

        if (!self.hasAny())
            return undefined;

        for (var i = 0; i < self.length; i++) {
            var item = self[i];
            if (predicate(item))
                return item;
        }

        return undefined;
    } 

    Array.prototype.firstMatch = firstMatch;

    function groupBy<T, TKey>(keySelector: (item: T) => TKey): Array<Array<T>> {
        var groups = new Array<Array<T>>();

        var self: Array<T> = this;

        self.forEach((arrayItem: T, index: number, array: Array<T>) => {

            var firstMatchingGroup = groups.firstMatch((keyItem: Array<T>): boolean => {
                return keySelector(keyItem.first()) === keySelector(arrayItem);
            });


            if (firstMatchingGroup == null) {
                var newGroup = new Array<T>();
                newGroup.push(arrayItem);
                groups.push(newGroup);
            } else {
                firstMatchingGroup.push(arrayItem);
            }

        });

        return groups;
    }

    Array.prototype.groupBy = groupBy;

    function orderBy<T, TKey>(keySelector: (item: T) => TKey): Array<T> {
        var self: Array<T> = this;

        var comparer: <T>(a: T, b: T) => number;

        if (!self.hasAny())
            return self;

        var firstItem = self.first();
        var keyItem = keySelector(firstItem);

        if (typeof (keyItem) == "number") {
            comparer = (a: number, b: number): number => {
                return a > b
                    ? -1 : a < b
                    ? 1 : 0;
            };
        }
        else if (typeof(keyItem) == "boolean") {
            comparer = (a: boolean, b: boolean): number => {
                return a && !b
                    ? -1 : !a && b
                    ? 1 : 0;
            }
        } else {
            comparer = (a: T, b: T): number => {
                return a != undefined && b == undefined
                    ? 1 : a == undefined && b != undefined
                    ? -1 : 0;
            }
        }

        return self.sort(comparer);
    }

    Array.prototype.orderBy = orderBy;

    function clear<T>(): void {
        var self: Array<T> = this;
        self = [];
        self.length = 0;
    }

    Array.prototype.clear = clear;

    function take<T>(count: number): Array<T> {
        var self: Array<T> = this;
        return self.slice(0, count);
    }

    Array.prototype.take = take;

    function pushRange<T>(items: Array<T>): void {
        var self: Array<T> = this;

        items.forEach((item: T) => {
            self.push(item);
        });
    }

    Array.prototype.pushRange = pushRange;
})();