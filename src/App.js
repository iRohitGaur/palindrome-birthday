import "./styles.css";
import { useState } from "react";
import DatePicker from "react-date-picker";
import moment from "moment";

export default function App() {
  const [dob, setDob] = useState(new Date());
  const [result, setResult] = useState("");

  const getAllDateFormats = ({ day, month, year }) => {
    const ddmmyyyy = day + month + year;
    const mmddyyyy = month + day + year;

    return [ddmmyyyy, mmddyyyy];
  };

  const checkPalindrome = (e) => {
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(dob);

    const arr = formattedDate // 04/12/2021
      .split("/"); // ["04", "12", "2021"]

    const dateObj = { day: arr[0], month: arr[1], year: arr[2] };

    const allDates = getAllDateFormats(dateObj);

    var found = false;
    for (let dt of allDates) {
      if (isPalindrome(dt)) {
        found = true;
        setResult("Your birthday is palindrome");
        break;
      }
    }

    if (!found) {
      checkNearestPalindrome(allDates);
    }
  };

  const isPalindrome = (str) => {
    const revStr = str.split("").reverse().join("");
    return revStr === str;
  };

  const checkNearestPalindrome = (allDts) => {
    var nearPals = [];
    for (let dt of allDts) {
      const half = dt.substring(Math.floor(dt.length / 2), dt.length);
      const rev = half.split("").reverse().join("");
      nearPals.push(rev + half);
    }
    isDate(nearPals);
  };

  const isDate = (nps) => {
    var validDates = [];
    for (let np of nps) {
      const datesToCheck = strToDateFormat(np);
      for (let dtc of datesToCheck) {
        if (moment(dtc.date, dtc.format, true).isValid()) {
          validDates.push(dtc);
        }
      }
    }
    calcDifferenceBetweenDates(validDates);
  };

  const calcDifferenceBetweenDates = (validDates) => {
    var differences = [];

    const dt1 = new Date(dob);
    for (let vd of validDates) {
      var dateMomentObject = moment(vd.date, vd.format);
      const dt2 = dateMomentObject.toDate();
      const diffInTime = dt2.getTime() - dt1.getTime();
      if (!isNaN(diffInTime)) {
        const diffInDays = diffInTime / (1000 * 3600 * 24);
        differences.push({
          validDate: vd,
          difference: Math.ceil(Math.abs(diffInDays))
        });
      }
    }
    const palDate = differences.sort((a, b) => a.difference - b.difference)[0];
    setResult(
      `Nearest palindrome date is ${
        palDate.validDate.date
      } (${palDate.validDate.format.toLowerCase()}).${"\n"}You missed it by ${
        palDate.difference
      } days`
    );
  };

  const strToDateFormat = (dateString) => {
    const dt = dateString.split("");
    var dateFormats = [];
    if (dt.length === 8) {
      const dt1 = `${dt.slice(0, 2).join("")}/${dt
        .slice(2, 4)
        .join("")}/${dt.slice(4, 8).join("")}`;
      dateFormats.push({ date: dt1, format: "DD/MM/YYYY" });
      dateFormats.push({ date: dt1, format: "MM/DD/YYYY" });
    }

    return dateFormats;
  };

  return (
    <div className="App">
      <div className="app__title">Palindrome Birthday!</div>
      <div className="app__subtitle">Date of Birth:</div>
      <DatePicker
        allowClear={false}
        className="pal__inputname pal__input"
        locale="en-IN"
        showLeadingZeros={true}
        clearIcon={false}
        onChange={setDob}
        value={dob}
        minDate={new Date("01/01/2001")}
        maxDate={new Date()}
      />
      <input
        type="submit"
        className="pal__inputname pal__submit"
        value="Check"
        onClick={checkPalindrome}
      />
      <div className="app__resultlabel">{result}</div>
      <div className="footer">
        Made by <a href="https://rohit.xyz">Rohit Gaur</a> with{" "}
        <i className="fab fa-react"></i> and <i className="fa fa-heart"></i>
      </div>
    </div>
  );
}
