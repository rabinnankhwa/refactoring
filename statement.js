const { createStatementData } = require('./createStatementData')

function statement (invoice, plays) {
    return renderPlainText(createStatementData(invoice,plays));
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