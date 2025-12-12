type Freq = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
type Day = "SU" | "MO" | "TU" | "WE" | "TH" | "FR" | "SA";

export interface RRule {
  freq?: Freq;
  bymonth?: number;
  bymonthday?: number;
  byday?: Day;
  byhour?: number;
  byminute?: number;
  byseocnd?: number;
}

export function parse(rrule: string): RRule {
  const result: RRule = {};

  const entries = rrule.split(";");
  for (const entry of entries) {
    const [key, value] = entry.split("=");
    switch (key) {
      case "FREQ":
        result.freq = value as Freq;
        break;
      case "BYMONTH":
        result.bymonth = Number(value);
        break;
      case "BYMONTHDAY":
        result.bymonthday = Number(value);
        break;
      case "BYDAY":
        result.byday = value as Day;
        break;
      case "BYHOUR":
        result.byhour = Number(value);
        break;
      case "BYMINUTE":
        result.byminute = Number(value);
        break;
      case "BYSECOND":
        result.byseocnd = Number(value);
        break;
      default:
        break;
    }
  }

  return result;
}

export function toLocaleString(rrule: RRule, _locale = "ja") {
  let localeString = "";

  switch (rrule.freq) {
    case "DAILY":
      localeString += "毎日";
      break;
    case "WEEKLY":
      localeString += "毎週";
      break;
    case "MONTHLY":
      localeString += "毎月";
      break;
    case "YEARLY":
      localeString += "毎年";
      break;
    default:
      break;
  }

  if (rrule.bymonth) {
    localeString += `${rrule.bymonth}月`;
  }

  if (rrule.bymonth) {
    localeString += `${rrule.bymonth}日`;
  }

  switch (rrule.byday) {
    case "SU":
      localeString += "日曜日";
      break;
    case "MO":
      localeString += "月曜日";
      break;
    case "TU":
      localeString += "火曜日";
      break;
    case "WE":
      localeString += "水曜日";
      break;
    case "TH":
      localeString += "木曜日";
      break;
    case "FR":
      localeString += "金曜日";
      break;
    case "SA":
      localeString += "土曜日";
      break;
    default:
      break;
  }

  if (rrule.byhour) {
    localeString += `${rrule.byhour}時`;
  }

  if (rrule.byminute) {
    localeString += `${rrule.byminute}分`;
  }

  return localeString;
}
