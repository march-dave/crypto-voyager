// // 1.	Create a data structure that holds a PORTFOLIO Entity with the following Elements:
// // a.	Portfolio Name
// // b.	Portfolio Code
// // c.	Portfolio Market Value


// class PORTFOLIO {
//     string Portfolio_Name;
//     string Portfolio_Code;
//     decimal Portfolio_MarketValue
// }

// class PORTFOLIO_SHARE_CLASS {
//     string PortfolioShare_ClassName;
// 	string PortfolioShare_ClassCode;
// 	decimal PortfolioShare_ClassBaseFee;
// }

// class PORTFOLIO {
//     PORTFOLIO_SHARE_CLASS share_class; 
//     string Portfolio_Name;
//     string Portfolio_Code;
//     decimal Portfolio_MarketValue
// }




// 1.	Create a data structure that holds a PORTFOLIO SHARE CLASS Entity, which is a child of the Portfolio Entity.  A PORTFOLIO Entity has many PORTFOLIO SHARE CLASS children.  The PORTFOLIO SHARE CLASS Entity has the following Elements:
// a.	(A Reference to the Parent PORTFOLIO)
// b.	Portfolio Share Class Name
// c.	Portfolio Share Class Code
// d.	Portfolio Share Class Base Fee

// Note: The PORTFOLIO ‘has a’ collection of a PORTFOLIO SHARE CLASS entities. A PORTFOLIO SHARE CLASS entity does not inherit from the PORTFOLIO Entity.