// Shared translations - extracted to avoid circular dependency
export const translations = {
  en: {
    home: "Home", people: "People", items: "Items", stats: "Numbers",
    newBuy: "New Sale", newPay: "New Payment", store: "Dashboard", recent: "Recent",
    totalDeposit: "Deposit Lacag", totalCredit: "Credit Lacag", net: "Net Lacag",
    addPerson: "Add Person", search: "Search...", name: "Name", phone: "Phone",
    money: "Money", save: "Save", cancel: "Cancel", history: "History", profile: "Profile",
    qty: "Qty", price: "Price", total: "Total", notes: "Notes", confirm: "Confirm",
    buy: "Sale", pay: "Payment", sold: "Sold", empty: "Nothing here yet",
    choosePerson: "Choose Person", typeItem: "Type item name...", noMatch: "No match",
    payable: "Total to Pay", receivable: "Total to Get", active: "Active People",
addProduct: "Add Product",
    cashTransactions: "Cash Transactions", cashIn: "Cash In", cashOut: "Cash Out", cashPurchase: "Cash Purchase",
    totalCashIn: "Total Cash In", totalCashOut: "Total Cash Out", totalCashPurchases: "Total Cash Purchases", netCashFlow: "Net Cash Flow",
    selectCustomer: "Select Customer", addFailed: "Failed to add", adminSignup: "Admin Signup",
    // Currency settings
    currency: "Currency", currencySettings: "Currency Settings", switchCurrency: "Switch Currency",
    usd: "USD (Dollar)", sos: "SOS (Shilling)", exchangeRate: "Exchange Rate",
    usdEquals: "1 USD equals how many SOS?", saveRate: "Save Exchange Rate",
    currentRate: "Current Rate", currencySymbol: "Currency Symbol"
  },
  so: {
    home: "Hoy", people: "Dadka", items: "Alaabta", stats: "Tirooyinka",
    newBuy: "Gadasho Cusub", newPay: "Bixin Cusub", store: "Dashboardka", recent: "Dhawaan",
    totalDeposit: "Lacag Dhigaal", totalCredit: "Lacag Amaah", net: "Lacagta Harta",
    addPerson: "Ku dar Qof", search: "Raadi...", name: "Magac", phone: "Taleefon",
    money: "Lacag", save: "Keydi", cancel: "Jooji", history: "Taariikhda", profile: "Macmiilka",
    qty: "Cadadka", price: "Qiimaha", total: "Isu-geyn", notes: "Faahfaahin", confirm: "Hubi",
    buy: "Iib", pay: "Bixin", sold: "La iibiyay", empty: "Waxba kuma jiraan",
    choosePerson: "Dooro Qof", typeItem: "Qor magaca alaabta...", noMatch: "Lama helin",
    payable: "Lacagta la bixinayo", receivable: "Lacagta laga rabo", active: "Dadka Shaqaynaya",
addProduct: "Ku dar Alaab",
    cashTransactions: "Hawlgallada Lacagta", cashIn: "Lacag Gali", cashOut: "Lacag Bixi", cashPurchase: "Iib Lacag ah",
    totalCashIn: "Wadarta Lacagta Gali", totalCashOut: "Wadarta Lacagta Bixi", totalCashPurchases: "Wadarta Iibka Lacagta", netCashFlow: "Wadarta Net Lacagta",
    selectCustomer: "Dooro Macmiil", addFailed: "Ku darayay fashilay", adminSignup: "Diiwaan Sii Ugal",
    // Currency settings
    currency: "Lacagta", currencySettings: "Dejinta Lacagta", switchCurrency: "Badal Lacagta",
    usd: "USD (Doolar)", sos: "SOS (Shilin)", exchangeRate: "Qiimaha isbedelka",
    usdEquals: "1 USD waa imisa SOS?", saveRate: "Keydi Qiimaha",
    currentRate: "Qiimaha hadda", currencySymbol: "Calanka Lacagta"
  }
};

export type Language = 'en' | 'so';