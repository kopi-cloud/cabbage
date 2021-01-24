const shorTimeformatOptions: Intl.DateTimeFormatOptions = {
  hour12: false, hour: "2-digit", minute: "2-digit"
};

export function parseServerDate(date: string): Date{
  return new Date(date);
}

export function formatShortIsoDateTime(date?: Date){
  if( !date ){
    return ""
  }

  return formatIsoDate(date) + " " + formatShortTime(date);
}

export function formatShortTime(
  date?:Date,
  locale:string|undefined = undefined
):string{
  if( !date ){
    return ""
  }
  return date.toLocaleTimeString(locale, shorTimeformatOptions);
}

export function formatIsoDate(date?: Date){
  if( !date ){
    return "";
  }
  return extractDateFromIsoFormat(date.toISOString());
}

export function extractDateFromIsoFormat(date: string): string{
  if( !date ){
    return ""
  }
  if( date.length < 10 ){
    return ""
  }
  return date.substr(0, 10);
}
