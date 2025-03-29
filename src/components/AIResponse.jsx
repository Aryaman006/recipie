const AIResponse = ({ response }) => {
    if (!response) return null;
  
    console.log(response);
  
    // ✅ Parse and map raw AI response into structured format
    const parseResponse = (content) => {
      return content.map((item) => {
        if (item.startsWith('### ')) {
          return { type: 'heading', text: item.replace('### ', '') };
        } else if (item.startsWith('#### ')) {
          return { type: 'subheading', text: item.replace('#### ', '') };
        } else if (item.startsWith('- ')) {
          return { type: 'listItem', text: item.replace('- ', '') };
        } else if (item.match(/^\d+\.\s\*\*(.*?)\*\*$/)) {
          return { type: 'heading', text: item.replace(/^\d+\.\s\*\*(.*?)\*\*$/, '$1') };
        } else if (item.match(/^\d+\.\s/)) {
          return { type: 'orderedListItem', text: item.replace(/^\d+\.\s/, '') };
        } else if (item.startsWith('**')) {
          return { type: 'subheading', text: item.replace(/\*\*/g, '') };
        } else if (item.startsWith('* ')) {
          return { type: 'heading', text: item.replace('* ', '') };
        }else if (item.startsWith('- **') && item.endsWith('**')) {
            // Make list items with ** subheadings
            return { type: 'subheading', text: item.replace(/^- \*\*(.*?)\*\*$/, ' ') };
          }  
        else {
          return { type: 'text', text: item };
        }
      });
    };
  
    const structuredResponse = parseResponse(response);
  
    // ✅ Group list items into a single list object
    const organizeContent = (parsed) => {
      const result = [];
      let currentList = [];
      let currentOrderedList = [];
  
      parsed.forEach((item) => {
        if (item.type === 'listItem') {
          currentList.push(item.text);
        } else if (item.type === 'orderedListItem') {
          currentOrderedList.push(item.text);
        } else {
          if (currentList.length) {
            result.push({ type: 'list', items: currentList });
            currentList = [];
          }
          if (currentOrderedList.length) {
            result.push({ type: 'orderedList', items: currentOrderedList });
            currentOrderedList = [];
          }
          result.push(item);
        }
      });
  
      if (currentList.length) {
        result.push({ type: 'list', items: currentList });
      }
      if (currentOrderedList.length) {
        result.push({ type: 'orderedList', items: currentOrderedList });
      }
  
      return result;
    };
  
    const formattedContent = organizeContent(structuredResponse);
  
    // ✅ Render parsed and structured content
    const renderContent = (content) => {
      return content.map((item, index) => {
        switch (item.type) {
          case 'heading':
            return (
              <h3 key={index} className="text-2xl font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">
                {item.text}
              </h3>
            );
          case 'subheading':
            return (
              <h4 key={index} className="text-xl font-medium mt-2 mb-1 text-gray-700 dark:text-gray-300">
                {item.text}
              </h4>
            );
          case 'list':
            return (
              <ul key={index} className="list-disc list-inside space-y-1 text-gray-800 dark:text-gray-300">
                {item.items.map((listItem, i) => (
                  <li key={i}>{listItem}</li>
                ))}
              </ul>
            );
          case 'orderedList':
            return (
              <ol key={index} className="list-decimal list-inside space-y-1 text-gray-800 dark:text-gray-300">
                {item.items.map((listItem, i) => (
                  <li key={i}>{listItem}</li>
                ))}
              </ol>
            );
          case 'heading2':
            return (
              <h2 key={index} className="text-3xl font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100">
                {item.text}
              </h2>
            );
          case 'text':
            return (
              <p key={index} className="text-gray-700 dark:text-gray-300">
                {item.text}
              </p>
            );
          default:
            return null;
        }
      });
    };
  
    return (
      <div className="mt-6 p-6 bg-green-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">
          AI Response
        </h2>
        <div className="space-y-4">{renderContent(formattedContent)}</div>
      </div>
    );
  };
  
  export default AIResponse;
  