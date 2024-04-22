export const yesterday = () => {
  let currentDate = new Date();
  let yesterdayDate = new Date(currentDate);
  yesterdayDate.setDate(currentDate.getDate() - 1);
  return Math.floor(yesterdayDate.getTime() / 1000);
};

export const getDataFromYesterday = async (yesterday: Function, xapi: any) => {
  const x: any = yesterday();
  
  xapi
    .getChartLastRequest({
      period: 1440,
      start: { x },
      symbol: "USDCAD",
    })
    .then((symbols: any) => {
      console.log("symbols data...");
      console.log(symbols);
    })
    .catch((err: any) => {
      console.log("error... ", err);
    });
};
