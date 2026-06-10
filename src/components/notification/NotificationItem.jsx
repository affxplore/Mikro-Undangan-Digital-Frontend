import React from "react";
import { formatTimeAgo } from ".././../utils/Time";

export default function NotificationItem({ notif, onClick, typeColors }) {
  return (
    <div
      onClick={() => onClick(notif)}
      className="cursor-pointer text-sm bg-slate-50 p-2 rounded flex justify-between hover:bg-slate-100 transition"
    >
      <div className="flex-1">
        <div className="font-medium">{notif.title}</div>
        <p className="text-sm text-slate-600 line-clamp-2">{notif.content}</p>
        <div className="text-xs text-slate-400">
          {formatTimeAgo(notif.createdAt)}
        </div>
      </div>
      {notif.type && (
        <div
          className={`ml-2 text-xs px-2 py-0.5 rounded h-fit text-white ${
            typeColors[notif.type] || "bg-gray-500"
          }`}
        >
          {notif.type}
        </div>
      )}
    </div>
  );
}
