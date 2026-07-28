const test = require("node:test");
const assert = require("node:assert/strict");

const calculateFinancialMetrics = (income, expense) => {
    const netBalance = income - expense;
    const savingsRate =
        income > 0 ? Number((((income - expense) / income) * 100).toFixed(2)) : 0;
    return { netBalance, savingsRate };
};

test("calculateFinancialMetrics correctly computes balance and savings rate", () => {
    const metrics = calculateFinancialMetrics(50000, 20000);
    assert.equal(metrics.netBalance, 30000);
    assert.equal(metrics.savingsRate, 60);
});

test("calculateFinancialMetrics handles zero income gracefully", () => {
    const metrics = calculateFinancialMetrics(0, 1500);
    assert.equal(metrics.netBalance, -1500);
    assert.equal(metrics.savingsRate, 0);
});

test("calculateFinancialMetrics handles negative savings rate when expenses exceed income", () => {
    const metrics = calculateFinancialMetrics(10000, 15000);
    assert.equal(metrics.netBalance, -5000);
    assert.equal(metrics.savingsRate, -50);
});
