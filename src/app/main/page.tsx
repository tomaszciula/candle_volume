"use client";
import { Button, Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Xapi from "xoh-xapi";

let currentDate = new Date();
let yesterdayDate = new Date(currentDate);
yesterdayDate.setDate(currentDate.getDate() - 1);
let y = Math.floor(yesterdayDate.getTime());
const eur = [
  "EURGBP",
  "EURJPY",
  "EURUSD",
  "EURCHF",
  "EURAUD",
  "EURCAD",
  "GBPUSD",
  "GBPJPY",
  "GBPCHF",
  "GBPAUD",
  "GBPCAD",
  "GBPNZD",
  "USDJPY",
  "USDCHF",
  "USDCAD",
  "AUDUSD",
  "AUDJPY",
  "AUDCHF",
  "AUDCAD",
  "AUDNZD",
  "NZDUSD",
  "NZDJPY",
  "NZDCHF",
  "NZDCAD",
  "CHFJPY",
  "CADJPY",
  "CADCHF",
];
let fetched: any[] = [];
let hits: any[] = [];
const TABLE_HEAD = ["Date", "Open", "Close", "High", "Low", "Pair"];

let x: any = new Xapi({
  accountId: "15826298",
  password: "L20s10r76",
  type: "demo", // or demo
  broker: "xtb",
});

const MainView = () => {
  const [fetch, setFetch] = useState([{}]);
  useEffect(() => {
    console.log("fetching eur...");
  }, [fetch]);

  x.onReady(async () => {
    for (let pair of eur) {
      await x
        .getChartLastRequest({
          period: 1440,
          start: y,
          symbol: pair,
        })
        .then((symbols: any) => {
          const symbol = symbols[0];
          symbol.pair = pair;
          fetched.push(symbol);
          console.log(symbol);
        })
        .catch((error: any) => {
          console.log("error: ", error.message);
        });
      await new Promise((r) => setTimeout(r, 500));
    }
    setFetch(fetched);
    console.log("fetched... ", fetched.length);

    fetched.map((element: any) => {
      //sprawdzamy czy cała świeca jest przynajmniej 10 razy większa od korpusu
      if (
        10 * Math.abs(element.close) <
        Math.abs(element.high) + Math.abs(element.low)
      ) {
        //jeśli świeca jest dodatnia obydwa knoty są wieksze od 399 punktów to dodajemy trafienie do tablicy hits
        if (element.close >= 0) {
          if (element.high - element.close > 399 && element.low < -399) {
            hits.push(element);
          }
          //jeśli świeca jest ujemna obydwa knoty są wieksze od 399 punktów to dodajemy trafienie do tablicy hits
        } else if (element.close < 0) {
          if (element.high > 399 && element.low + element.close < -399) {
            hits.push(element);
          }
        }
      }
    });
    setFetch(fetched);
    console.log("hits... ", hits);
  });

  return (
    <div>
      <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fetched.map(
              ({ ctmString, open, close, high, low, pair }, index) => (
                <tr key={pair} className="even:bg-blue-gray-50/50">
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {ctmString}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {open}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {close}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {high}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {low}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {pair}
                    </Typography>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default MainView;
