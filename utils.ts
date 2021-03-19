
/**
 * Returns a promise for waiting an amount of milliseconds.
 * @param ms The amount of time in milliseconds.
*/
export function sleep (ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

/**
 * Returns a random element of the specified array.
 * @param array The array to return from.
 */
export function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Returns a random element of the specified array that isn't in the other specified.
 * @param array The array to return from.
 * @param excludes The excludes.
*/
export function getRandomElementExcludes<T>(array: T[], excludes: T[]): T {
    let e: T;
    do
        e = getRandomElement(array);
    while (excludes.includes(e));
    return e;
}