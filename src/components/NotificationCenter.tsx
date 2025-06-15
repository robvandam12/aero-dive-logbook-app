
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Check, CheckCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, type Notification } from "@/hooks/useNotifications";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const getNotificationIcon = (type: Notification['type']) => {
  const icons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌"
  };
  return icons[type];
};

const getNotificationColor = (type: Notification['type']) => {
  const colors = {
    info: "bg-blue-100 text-blue-800 border-blue-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200"
  };
  return colors[type];
};

export const NotificationCenter = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { data: notifications = [] } = useNotifications(user?.id);
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    if (user?.id) {
      markAllAsReadMutation.mutate(user.id);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative text-ocean-300 hover:text-white">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-ocean-950 border-ocean-700" align="end">
        <div className="p-4 border-b border-ocean-700">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Notificaciones</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className="text-ocean-300 hover:text-white"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Marcar todas
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-ocean-400">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No hay notificaciones</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 mb-2 rounded-lg border transition-colors ${
                    notification.read 
                      ? "bg-ocean-900/50 text-ocean-300 border-ocean-800" 
                      : "bg-ocean-900 text-white border-ocean-600"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getNotificationColor(notification.type)}`}>
                          {notification.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="font-medium text-sm mb-1">{notification.title}</p>
                      <p className="text-sm opacity-90">{notification.message}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {format(new Date(notification.created_at), "dd/MM/yyyy HH:mm", { locale: es })}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markAsReadMutation.isPending}
                        className="ml-2 h-6 w-6 p-0 text-ocean-400 hover:text-white"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
