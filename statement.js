function statement (invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances;
    return renderPlainText(statementData, plays)
}

function renderPlainText (data, plays) {
    let result = `Statement for ${data.customer}\n`; 
    for (let perf of data.performances) {
        result += ` ${playFor(perf).name}: ${usd(amountFor(perf)/100)} (${perf.audience}`
    }

    result += `Amount owed is ${usd(totalAmount()/100)}\n`; 
    result += `You earned ${totalVolumeCredits()} credits\n`; 
    return result;

    function amountFor(aPerformance) {
        let amount = 0;

        switch (playFor(aPerformance).type) {
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
                throw new Error(`unknown type: ${playFor(aPerformance).type}`);
        }
        return amount;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function volumeCreditsFor(aPerformance) {
        let credits = 0;
        credits += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === playFor(aPerformance).type) credits += Math.floor(aPerformance.audience/10);
        return credits;
    }

    function usd(aNumber) {
        return new Intl.NumberFormat("enUS", 
            { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber);
    }

    function totalVolumeCredits() {
        let volumeCredits = 0;
        for (let perf of data.performances) {
            volumeCredits += volumeCreditsFor(perf)
        }
        return volumeCredits;
    }

    function totalAmount() {
        let total = 0;
        for (let perf of data.performances) {
            total += amountFor(perf);
        }
        return total;
    }
}

module.exports = {
    statement
}