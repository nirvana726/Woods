import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FaCheck, 
  FaTrash, 
  FaEnvelope, 
  FaEnvelopeOpen,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaTimes
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'read', 'unread'
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const messagesPerPage = 10;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/contact`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // Filter and search logic
  const filteredMessages = messages.filter(msg => {
    // Status filter
    if (filter !== 'all' && msg.status !== filter) return false;
    
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        msg.firstName.toLowerCase().includes(searchLower) ||
        msg.lastName.toLowerCase().includes(searchLower) ||
        msg.email.toLowerCase().includes(searchLower) ||
        msg.subject.toLowerCase().includes(searchLower) ||
        msg.message.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Pagination logic
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/api/contact/${id}`, { status: 'read' });
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, status: 'read' } : msg
      ));
      toast.success('Message marked as read');
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Failed to update message status');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/contact/${id}`);
      setMessages(messages.filter(msg => msg._id !== id));
      toast.success('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const openMessageModal = (message) => {
    setSelectedMessage(message);
    // Automatically mark as read when opened
    if (message.status === 'unread') {
      markAsRead(message._id);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Contact Messages</h1>
        
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setFilter('all');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
            >
              All ({messages.length})
            </button>
            <button 
              onClick={() => {
                setFilter('unread');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded ${filter === 'unread' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
            >
              Unread ({messages.filter(m => m.status === 'unread').length})
            </button>
            <button 
              onClick={() => {
                setFilter('read');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded ${filter === 'read' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
            >
              Read ({messages.filter(m => m.status === 'read').length})
            </button>
          </div>
          
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
            />
          </div>
        </div>

        {/* Messages Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentMessages.length > 0 ? (
                    currentMessages.map((message) => (
                      <tr 
                        key={message._id} 
                        className={`hover:bg-gray-50 ${message.status === 'unread' ? 'bg-teal-50' : ''}`}
                      >
                        <td 
                          className="px-6 py-4 whitespace-nowrap cursor-pointer"
                          onClick={() => openMessageModal(message)}
                        >
                          <div className="font-medium">{message.firstName} {message.lastName}</div>
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap cursor-pointer"
                          onClick={() => openMessageModal(message)}
                        >
                          <div className="text-gray-600">{message.email}</div>
                          {message.phone && (
                            <div className="text-gray-500 text-sm">{message.phone}</div>
                          )}
                        </td>
                        <td 
                          className="px-6 py-4 cursor-pointer"
                          onClick={() => openMessageModal(message)}
                        >
                          <div className="font-medium">{message.subject}</div>
                          <div className="text-gray-500 text-sm line-clamp-1">{message.message}</div>
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap cursor-pointer"
                          onClick={() => openMessageModal(message)}
                        >
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${message.status === 'unread' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {message.status}
                          </span>
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                          onClick={() => openMessageModal(message)}
                        >
                          {new Date(message.createdAt).toLocaleDateString()}
                          <div className="text-xs text-gray-400">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => markAsRead(message._id)}
                              className={`p-2 rounded ${message.status === 'unread' ? 'text-yellow-600 hover:bg-yellow-50' : 'text-gray-400 hover:bg-gray-50'}`}
                              title={message.status === 'unread' ? 'Mark as read' : 'Marked as read'}
                            >
                              {message.status === 'unread' ? <FaEnvelope /> : <FaEnvelopeOpen />}
                            </button>
                            <button
                              onClick={() => deleteMessage(message._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              title="Delete message"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No messages found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredMessages.length > messagesPerPage && (
              <div className="flex justify-between items-center mt-4 px-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1 rounded disabled:opacity-50"
                >
                  <FaChevronLeft /> Previous
                </button>
                
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1 rounded disabled:opacity-50"
                >
                  Next <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedMessage.subject}
                  </h2>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-teal-100 text-teal-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                      {selectedMessage.firstName.charAt(0)}{selectedMessage.lastName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">
                        {selectedMessage.firstName} {selectedMessage.lastName}
                      </h3>
                      <p className="text-gray-600">{selectedMessage.email}</p>
                      {selectedMessage.phone && (
                        <p className="text-gray-500 text-sm">{selectedMessage.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-line text-gray-700">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedMessage.status === 'unread' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedMessage.status}
                  </span>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      deleteMessage(selectedMessage._id);
                      setSelectedMessage(null);
                    }}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <FaTrash className="inline mr-2" />
                    Delete
                  </button>
                  {selectedMessage.status === 'unread' && (
                    <button
                      onClick={() => {
                        markAsRead(selectedMessage._id);
                        setSelectedMessage({...selectedMessage, status: 'read'});
                      }}
                      className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
                    >
                      <FaCheck className="inline mr-2" />
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}