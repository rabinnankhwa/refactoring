function statement (invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`; 
    const format = new Intl.NumberFormat("enUS",
        { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format;
    for (let perf of invoice.performances) {

        // add volume credits
        volumeCredits += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience/10)
        // print line for this order
        result += ` ${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience}`
        totalAmount += amountFor(perf);
    }
    result += `Amount owed is ${format(totalAmount/100)}\n`; 
    result += `You earned ${volumeCredits} credits\n`; 
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
}

module.exports = {
    statement
}