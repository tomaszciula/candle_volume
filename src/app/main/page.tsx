"use client";
import { Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Xapi from "xoh-xapi";
import emailjs from 'emailjs-com';


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


const sendEmail = async (formData: any) => {
  try {
    await emailjs.send(
'service_9dqsl66', 'service_9dqsl66', formData, '3GlLrmqPpg6L0aMgH'
    );
    return "Email sent successfully!";
  } catch (error) {
    return "Failed to send email. Please try again.";
  }
};

const MainView = () => {
  const [subject, setSubject] = useState('Trafienia Candle Volume:');
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const templateParams = {
    subject,
    text,
    to_email: 'cetex.tc@gmail.com', // Adres docelowy
  };
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
    const t = JSON.stringify(hits, null, 2); // Konwersja na czytelny string
    // sendEmail(templateParams);
    if (typeof window !== "undefined") {

    emailjs.send(
      'service_9dqsl66', 'template_eyb0e4m', {
        to_name: "Tomcio",
        from_name: "Forex",
        message: {t},
      }, '3GlLrmqPpg6L0aMgH'
          )
          .then((response) => {
            console.log("SUCCESS!", response.status, response.text);
          })
          .catch((err) => console.error("FAILED...", err));
        }
    console.log('hits to text =', t)

    
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
