function statement (invoice, plays) {
    return renderPlainText(createStatementData(invoice,plays));
}

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
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance) {
        let amount = 0;

        switch (aPerformance.play.type) {
            case "tragedy":
                amount = 40000;
                if (aPerformance.audience > 30) {
                    amount += 1000 * (aPerformance.audience - 30);
                }
                break;
            case "comedy":
                amount = 30000;
                if (aPerformance.audience > 20) {
                    amount += 10000 + 500 * (aPerformance.audience - 20);
                }
                amount += 300 * aPerformance.audience;
                break;
            default:
                throw new Error(`unknown type: ${aPerformance.play.type}`);
        }
        return amount;
    }

    function volumeCreditsFor(aPerformance) {
        let credits = 0;
        credits += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === aPerformance.play.type) credits += Math.floor(aPerformance.audience/10);
        return credits;
    }
}

function renderPlainText (data) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data.performances) {
        result += ` ${perf.play.name}: ${usd(perf.amount/100)} (${perf.audience}`;
    }

    result += `Amount owed is ${usd(data.totalAmount/100)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;
    return result;

    function usd(aNumber) {
        return new Intl.NumberFormat("enUS", 
            { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber);
    }
}

module.exports = {
    statement
}