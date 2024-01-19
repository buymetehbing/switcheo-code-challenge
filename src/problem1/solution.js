/**
 * Task 1
 * 
 * Provide 3 unique implementations of the following function in JavaScript.
 * Input: `n` - any integer
 * Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`
 * Output: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.
 */

// First Approach: Using mathematical formula
var sum_to_n_a = function(n) {
    return (n*(n+1)) / 2;
};

// Second Approach: Using for loop
var sum_to_n_b = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Third Approach: Using recursion
var sum_to_n_c = function(n) {
    if (n <= 0) {
        return 0;
    }
    return n + sum_to_n_c(n-1);
};