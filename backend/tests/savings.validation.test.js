const test = require("node:test");
const assert = require("node:assert/strict");

const calculateGoalProgress = (targetAmount, savedAmount) => {
    const percentageCompleted = targetAmount > 0
        ? Math.min((savedAmount / targetAmount) * 100, 100)
        : 0;
    const remainingAmount = Math.max(targetAmount - savedAmount, 0);
    const status = savedAmount >= targetAmount ? "Completed" : "In Progress";
    return {
        percentageCompleted: Number(percentageCompleted.toFixed(2)),
        remainingAmount: Number(remainingAmount.toFixed(2)),
        status,
    };
};

test("calculateGoalProgress correctly computes remaining amount, percentage and status", () => {
    const metrics = calculateGoalProgress(10000, 4000);
    assert.equal(metrics.remainingAmount, 6000);
    assert.equal(metrics.percentageCompleted, 40);
    assert.equal(metrics.status, "In Progress");
});

test("calculateGoalProgress handles completed goals with excess savings", () => {
    const metrics = calculateGoalProgress(5000, 6000);
    assert.equal(metrics.remainingAmount, 0);
    assert.equal(metrics.percentageCompleted, 100);
    assert.equal(metrics.status, "Completed");
});

test("calculateGoalProgress handles zero target amount", () => {
    const metrics = calculateGoalProgress(0, 500);
    assert.equal(metrics.remainingAmount, 0);
    assert.equal(metrics.percentageCompleted, 0);
    assert.equal(metrics.status, "Completed"); // because saved (500) >= target (0)
});
