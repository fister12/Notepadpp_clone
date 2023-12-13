function DocumentEditor() {
    const [socket, setSocket] = useState(null);
    const [documentContent, setDocumentContent] = useState('');
  
    useEffect(() => {
      const newSocket = io(ENDPOINT);
      newSocket.on('init-document', (content) => setDocumentContent(content));
      newSocket.on('update-document', ({ content, position }) => {
        // Update the document content based on the received data
        // ...
      });
      setSocket(newSocket);
    }, []);
  
    const handleEdit = (event) => {
      // Update the document content locally
      setDocumentContent(event.target.value);
      // Send the updated content to the server
      socket.emit('edit-document', {
        content: event.target.value,
        position: event.target.selectionStart,
      });
    };
  
    return (
      <div>
        <textarea
          value={documentContent}
          onChange={handleEdit}
        />
      </div>
    );
  }
  