const plays = require('./plays.json')
const invoices = require('./invoices.json')
const statement = require('./statement')

console.log(JSON.stringify(plays))
console.log(JSON.stringify(invoices))
for (let invoice of invoices) {
    console.log(statement.statement(invoice,plays))
}
