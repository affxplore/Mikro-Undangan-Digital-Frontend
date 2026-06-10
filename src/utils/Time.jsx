import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export function formatTimeAgo(dateString) {
  if (!dateString) return "";
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: id,
  });
}
