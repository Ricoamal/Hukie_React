import { useEffect } from 'react';
import { X, Info, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNotification, NotificationType } from '../contexts/NotificationContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function ToastContainer() {
  const { toasts, dismissToast } = useNotification();

  // Get icon based on toast type
  const getToastIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <Info size={20} className="text-white" />;
      case 'success':
        return <CheckCircle size={20} className="text-white" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-white" />;
      case 'error':
        return <AlertCircle size={20} className="text-white" />;
      default:
        return <Info size={20} className="text-white" />;
    }
  };

  // Get background color based on toast type
  const getToastBgColor = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return 'bg-blue-500';
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-amber-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col items-end space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className={`${getToastBgColor(toast.type)} text-white px-4 py-3 rounded-lg shadow-lg flex items-center max-w-md pointer-events-auto`}
            style={{ minWidth: '300px' }}
          >
            <div className="mr-3">
              {getToastIcon(toast.type)}
            </div>
            <div className="flex-1">
              <p className="font-medium">{toast.message}</p>
            </div>
            <button
              className="ml-4 text-white opacity-70 hover:opacity-100 transition-opacity"
              onClick={() => dismissToast(toast.id)}
            >
              <X size={18} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
