function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance)
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;

    function totalVolumeCredits(data) {
        return data.performances
            .reduce((total, p) => total + p.volumeCredits, 0);
    }

    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount, 0);
    }

    function enrichPerformance(aPerformance) {
        const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
        const result = Object.assign({}, aPerformance);
        result.play = calculator.play;
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }
}

class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay;
    }


    get amount() {
        let amount = 0;

        switch (this.play.type) {
            case "tragedy":
                amount = 40000;
                if (this.performance.audience > 30) {
                    amount += 1000 * (this.performance.audience - 30);
                }
                break;
            case "comedy":
                amount = 30000;
                if (this.performance.audience > 20) {
                    amount += 10000 + 500 * (this.performance.audience - 20);
                }
                amount += 300 * this.performance.audience;
                break;
            default:
                throw new Error(`unknown type: ${this.play.type}`);
        }
        return amount;
    }

    get volumeCredits() {
        let credits = 0;
        credits += Math.max(this.performance.audience - 30, 0);
        if ("comedy" === this.play.type) credits += Math.floor(this.performance.audience/10);
        return credits;
    }
}

module.exports = {
    createStatementData
}