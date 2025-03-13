import { format, parseISO } from "date-fns";
const formatToBangladeshDate = (date) => {
  if (!date) return "";
  const convertedDate = parseISO(date);
  const formattedDate = format(
    new Date(convertedDate),
    "dd MMMM yyyy, hh.mm a"
  );
  return formattedDate;
};

export { formatToBangladeshDate };
