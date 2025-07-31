import "./App.css";
import { useState } from "react";
import { 
  CopilotSidebar, 
  CopilotPopup
} from "@copilotkit/react-ui";

import { 
  useCopilotAction, 
  useCopilotReadable,
  useCopilotChat
} from "@copilotkit/react-core";

// Demo Data
interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

interface User {
  name: string;
  email: string;
  role: string;
}

const App = () => {
  // State for various demos
  const [activeDemo, setActiveDemo] = useState("getting-started");
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: "Learn CopilotKit", completed: false },
    { id: 2, text: "Build awesome AI features", completed: false },
  ]);
  const [user, setUser] = useState<User>({
    name: "John Doe",
    email: "john@example.com",
    role: "Developer"
  });
  const [notes, setNotes] = useState("Start writing your AI-powered notes here...");
  const [showPopup, setShowPopup] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Make app state readable to Copilot
  useCopilotReadable({
    description: "Current todo items in the app",
    value: todos,
  });

  useCopilotReadable({
    description: "Current user information",
    value: user,
  });

  useCopilotReadable({
    description: "Current notes content",
    value: notes,
  });

  // Copilot Actions
  useCopilotAction({
    name: "addTodo",
    description: "Add a new todo item",
    parameters: [
      {
        name: "text",
        type: "string",
        description: "The todo text",
      },
    ],
    handler: ({ text }) => {
      const newTodo: TodoItem = {
        id: Date.now(),
        text,
        completed: false,
      };
      setTodos([...todos, newTodo]);
    },
  });

  useCopilotAction({
    name: "toggleTodo",
    description: "Toggle completion status of a todo",
    parameters: [
      {
        name: "id",
        type: "number",
        description: "The todo ID",
      },
    ],
    handler: ({ id }) => {
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    },
  });

  useCopilotAction({
    name: "deleteTodo",
    description: "Delete a todo item",
    parameters: [
      {
        name: "id",
        type: "number",
        description: "The todo ID to delete",
      },
    ],
    handler: ({ id }) => {
      setTodos(todos.filter(todo => todo.id !== id));
    },
  });

  useCopilotAction({
    name: "updateUser",
    description: "Update user information",
    parameters: [
      {
        name: "name",
        type: "string",
        description: "User's name",
        required: false,
      },
      {
        name: "email",
        type: "string",
        description: "User's email",
        required: false,
      },
      {
        name: "role",
        type: "string",
        description: "User's role",
        required: false,
      },
    ],
    handler: ({ name, email, role }) => {
      setUser(prev => ({
        ...prev,
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
      }));
    },
  });

  useCopilotAction({
    name: "toggleTheme",
    description: "Toggle between light and dark mode",
    parameters: [],
    handler: () => {
      setDarkMode(!darkMode);
    },
  });

  useCopilotAction({
    name: "clearAllTodos",
    description: "Clear all todo items",
    parameters: [],
    handler: () => {
      setTodos([]);
    },
  });

  useCopilotAction({
    name: "updateNotes",
    description: "Update or replace the notes content",
    parameters: [
      {
        name: "content",
        type: "string",
        description: "The new notes content",
      },
      {
        name: "append",
        type: "boolean",
        description: "Whether to append to existing notes or replace them",
        required: false,
      },
    ],
    handler: ({ content, append = false }) => {
      if (append) {
        setNotes(prev => prev + "\n\n" + content);
      } else {
        setNotes(content);
      }
    },
  });

  const demoOptions = [
    { id: "getting-started", name: "Getting Started", icon: "🚀" },
    { id: "sidebar", name: "Sidebar Chat", icon: "💬" },
    { id: "textarea", name: "Notes & Chat", icon: "📝" },
    { id: "popup", name: "Contextual Popup", icon: "💡" },
    { id: "actions", name: "Custom Actions", icon: "⚡" },
    { id: "state", name: "State Management", icon: "🔄" },
  ];

  const renderDemo = () => {
    switch (activeDemo) {
      case "getting-started":
        return (
          <div className="demo-content">
            <h2>🚀 Welcome to CopilotKit Demo</h2>
            <p>This interactive demo showcases the powerful UI components and capabilities of CopilotKit. Explore each section to see what's possible with AI-powered interfaces!</p>
            
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">💬</div>
                <h3>Intelligent Chat Interface</h3>
                <p>Persistent AI sidebar that understands your app context and can perform actions through natural language.</p>
                <ul>
                  <li>Context-aware responses</li>
                  <li>Action execution via chat</li>
                  <li>Customizable instructions</li>
                </ul>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Custom AI Actions</h3>
                <p>Define custom functions that the AI can call to interact with your application state and perform complex operations.</p>
                <ul>
                  <li>Type-safe parameter handling</li>
                  <li>Real-time state updates</li>
                  <li>Natural language triggers</li>
                </ul>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔄</div>
                <h3>State Management</h3>
                <p>Make your application state readable to the AI, enabling contextual assistance and intelligent suggestions.</p>
                <ul>
                  <li>Readable state hooks</li>
                  <li>Real-time context updates</li>
                  <li>Smart state analysis</li>
                </ul>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">💡</div>
                <h3>Contextual Popups</h3>
                <p>Show AI assistance exactly when and where users need it with contextual popup interfaces.</p>
                <ul>
                  <li>Context-specific instructions</li>
                  <li>Flexible positioning</li>
                  <li>Keyboard shortcuts</li>
                </ul>
              </div>
            </div>

            <div className="getting-started-actions">
              <h3>🎯 Quick Start Guide</h3>
              <div className="quick-actions">
                <div className="quick-action">
                  <strong>1. Open AI Chat</strong>
                  <p>Press <kbd>Ctrl+;</kbd> or click the chat icon to open the AI sidebar</p>
                </div>
                <div className="quick-action">
                  <strong>2. Try Natural Commands</strong>
                  <p>Say "Add a todo to learn React" or "Change my name to Alice"</p>
                </div>
                <div className="quick-action">
                  <strong>3. Explore Demos</strong>
                  <p>Navigate through each demo section using the sidebar menu</p>
                </div>
                <div className="quick-action">
                  <strong>4. Test Features</strong>
                  <p>Try the popup demo, state management, and custom actions</p>
                </div>
              </div>
            </div>

            <div className="demo-stats">
              <h3>📊 Current Demo State</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">{todos.length}</span>
                  <span className="stat-label">Todo Items</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{todos.filter(t => !t.completed).length}</span>
                  <span className="stat-label">Pending</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{user.name.split(' ').length}</span>
                  <span className="stat-label">Name Parts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{darkMode ? 'Dark' : 'Light'}</span>
                  <span className="stat-label">Theme</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "sidebar":
        return (
          <div className="demo-content">
            <h2>🤖 Sidebar Chat Demo</h2>
            <p>The sidebar provides persistent AI assistance. Try asking:</p>
            <ul>
              <li>"Add a todo to learn React"</li>
              <li>"Show me my current todos"</li>
              <li>"Toggle the first todo"</li>
              <li>"Update my user profile"</li>
            </ul>
            <div className="todo-list">
              <h3>Todo List</h3>
              {todos.map(todo => (
                <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <span>{todo.text}</span>
                  <button onClick={() => setTodos(todos.map(t => 
                    t.id === todo.id ? { ...t, completed: !t.completed } : t
                  ))}>
                    {todo.completed ? '✅' : '⭕'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "textarea":
        return (
          <div className="demo-content">
            <h2>📝 Notes & Chat Demo</h2>
            <p>Use the sidebar chat to interact with your notes. Ask the AI to help you write, edit, or organize your content.</p>
            <textarea
              className="notes-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Start writing your notes... Use the AI chat to get assistance!"
              rows={10}
            />
            <div className="notes-actions">
              <p><strong>Try asking the AI:</strong></p>
              <ul>
                <li>"Help me improve this text"</li>
                <li>"Summarize my notes"</li>
                <li>"Add bullet points to organize this content"</li>
                <li>"Make this more professional"</li>
              </ul>
            </div>
          </div>
        );

      case "popup":
        return (
          <div className="demo-content">
            <h2>💡 Contextual Popup Demo</h2>
            <p>Click the button below to show a contextual AI popup:</p>
            <button 
              className="demo-button"
              onClick={() => setShowPopup(true)}
            >
              Show AI Popup
            </button>
            <div className="user-info">
              <h3>User Profile</h3>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
            {showPopup && (
              <CopilotPopup
                instructions="Help the user with their profile information. You can update their name, email, or role."
                onSetOpen={setShowPopup}
                clickOutsideToClose={true}
                shortcut="Ctrl+J"
              />
            )}
          </div>
        );

      case "actions":
        return (
          <div className="demo-content">
            <h2>⚡ Custom Actions Demo</h2>
            <p>Available AI actions you can trigger via chat:</p>
            <div className="actions-grid">
              <div className="action-card">
                <h4>📋 Todo Management</h4>
                <ul>
                  <li>Add new todos</li>
                  <li>Toggle completion</li>
                  <li>Delete todos</li>
                  <li>Clear all todos</li>
                </ul>
              </div>
              <div className="action-card">
                <h4>👤 User Management</h4>
                <ul>
                  <li>Update user name</li>
                  <li>Change email</li>
                  <li>Modify role</li>
                </ul>
              </div>
              <div className="action-card">
                <h4>🎨 UI Controls</h4>
                <ul>
                  <li>Toggle theme</li>
                  <li>Switch demos</li>
                </ul>
              </div>
            </div>
            <p>Try saying: "Add a todo to buy groceries" or "Change my name to Alice"</p>
          </div>
        );

      case "state":
        return (
          <div className="demo-content">
            <h2>🔄 State Management Demo</h2>
            <p>The AI can read and modify application state in real-time:</p>
            <div className="state-overview">
              <div className="state-section">
                <h4>📊 Current State</h4>
                <pre>{JSON.stringify({ todos: todos.length, user, darkMode }, null, 2)}</pre>
              </div>
              <div className="state-section">
                <h4>🤖 AI Capabilities</h4>
                <ul>
                  <li>Read current todos and user data</li>
                  <li>Modify state through actions</li>
                  <li>Respond to state changes</li>
                  <li>Provide contextual assistance</li>
                </ul>
              </div>
            </div>
            <p>Ask the AI: "What's my current state?" or "Summarize my todos"</p>
          </div>
        );

      default:
        return <div>Select a demo from the sidebar</div>;
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      {/* Sidebar Chat - Always Available */}
      <CopilotSidebar
        instructions={`You are an AI assistant in a CopilotKit demo app. 

Current context:
- User: ${user.name} (${user.email}) - ${user.role}
- Todos: ${todos.length} items (${todos.filter(t => !t.completed).length} pending)
- Current demo: ${activeDemo}
- Theme: ${darkMode ? 'dark' : 'light'}

Available actions:
- Add, toggle, or delete todos
- Update user information  
- Toggle dark/light theme
- Clear all todos

Be helpful and demonstrate the various CopilotKit capabilities. Guide users through the different demo sections.`}
        defaultOpen={false}
        clickOutsideToClose={false}
        shortcut="Ctrl+;"
      />

      {/* Main Content */}
      <div className="main-content">
        <header className="app-header">
          <h1>🚀 CopilotKit UI Demo Showcase</h1>
          <div className="theme-toggle">
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <div className="demo-container">
          <nav className="demo-nav">
            <h3>Demo Examples</h3>
            {demoOptions.map(demo => (
              <button
                key={demo.id}
                className={`nav-item ${activeDemo === demo.id ? 'active' : ''}`}
                onClick={() => setActiveDemo(demo.id)}
              >
                <span className="icon">{demo.icon}</span>
                <span className="name">{demo.name}</span>
              </button>
            ))}
          </nav>

          <main className="demo-main">
            {renderDemo()}
          </main>
        </div>

        <footer className="app-footer">
          <p>💡 Press <kbd>Ctrl+;</kbd> to open AI chat | Current demo: <strong>{demoOptions.find(d => d.id === activeDemo)?.name}</strong></p>
        </footer>
      </div>
    </div>
  );
};

export default App;
