class SchedulingService {
    solve(tasks, capacity) {
        const n = tasks.length;
        const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

        for (let i = 1; i <= n; i++) {
            const { duration, impact } = tasks[i - 1];
            for (let w = 0; w <= capacity; w++) {
                if (duration <= w) {
                    dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - duration] + impact);
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }

        let res = dp[n][capacity];
        let w = capacity;
        const selected = [];

        for (let i = n; i > 0 && res > 0; i--) {
            if (res !== dp[i - 1][w]) {
                selected.push(tasks[i - 1]);
                res -= tasks[i - 1].impact;
                w -= tasks[i - 1].duration;
            }
        }

        return {
            selected,
            totalImpact: dp[n][capacity],
            used: capacity - w,
            remaining: w
        };
    }
}

module.exports = new SchedulingService();
