import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('imagiGen_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedChat, setSelectedChat] = useState(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('imagiGen_theme') || 'dark';
  });

  const token = import.meta.env.VITE_HF_TOKEN;

  useEffect(() => {
    localStorage.setItem('imagiGen_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('imagiGen_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const generateImage = async () => {
    if (!prompt) return;
    if (!token) {
        setError("Hugging Face API Token not found. Please check your .env file.");
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const url = "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0";
      const response = await fetch(url, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          if (response.status === 503) {
            throw new Error(`Model loading (ETA: ${errData.estimated_time?.toFixed(0) || 'a few'}s). Try again.`);
          }
          throw new Error(errData.error || "Failed to generate image.");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      const newEntry = {
        id: Date.now(),
        prompt,
        image: imageUrl,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setHistory(prev => [newEntry, ...prev]);
      setImage(imageUrl);
      setSelectedChat(newEntry.id);
    } catch (err) {
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
          setError("Connection failed. Check your network or disable ad-blockers.");
      } else {
          setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryItem = (item) => {
    setPrompt(item.prompt);
    setImage(item.image);
    setSelectedChat(item.id);
  };

  const startNew = () => {
    setPrompt('');
    setImage(null);
    setSelectedChat(null);
    setError(null);
  };

  const deleteHistoryItem = (e, id) => {
      e.stopPropagation();
      setHistory(prev => prev.filter(item => item.id !== id));
      if (selectedChat === id) {
          startNew();
      }
  };

  return (
    <div className={`app-layout ${theme}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
           <h2>History</h2>
           <button onClick={startNew} className="new-chat-btn">
              + New Generation
           </button>
        </div>
        <div className="history-list">
          {history.length === 0 ? (
            <div className="empty-history">No generations yet</div>
          ) : (
            history.map(item => (
              <div 
                key={item.id} 
                className={`history-item ${selectedChat === item.id ? 'active' : ''}`}
                onClick={() => loadHistoryItem(item)}
              >
                <div className="item-info">
                   <span className="item-prompt">{item.prompt}</span>
                </div>
                <button 
                    className="delete-item" 
                    onClick={(e) => deleteHistoryItem(e, item.id)}
                    title="Delete"
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      <main className="main-content">
        <div className="top-bar">
          <button onClick={toggleTheme} className="theme-toggle" title="Toggle Theme">
             {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
        
        <div className="container">
          <header>
            <h1>ImagiGen <span>Pro</span></h1>
            <p className="subtitle">Translate your imagination into high-fidelity AI art using Stable Diffusion XL</p>
          </header>

          <div className="content-grid-wrap">
            <div className="control-panel">
              <div className="input-group">
                <label htmlFor="prompt-input">What's in your mind?</label>
                <div className="textarea-wrapper">
                  <textarea
                    id="prompt-input"
                    placeholder="A futuristic city, cinematic lights, neon glow..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), generateImage())}
                    disabled={loading}
                  />
                </div>
              </div>

              <button 
                className={`generate-btn ${loading ? 'loading' : ''}`}
                onClick={generateImage} 
                disabled={loading || !prompt || !token}
              >
                {loading ? <span className="btn-spinner"></span> : 'Generate Masterpiece'}
              </button>

              {error && (
                <div className="error-card">
                  <div className="error-text">⚠️ {error}</div>
                </div>
              )}
            </div>

            <div className="preview-panel">
              <div className={`canvas-frame ${loading ? 'shimmer' : ''} ${image ? 'has-image' : ''}`}>
                {loading ? (
                  <div className="generation-status">
                     <div className="loader-ring"></div>
                     <p>Synthesizing...</p>
                  </div>
                ) : image ? (
                  <div className="image-wrapper">
                    <img src={image} alt={prompt} />
                    <div className="image-actions">
                      <a href={image} download={`art-${Date.now()}.png`} className="action-btn">
                        Download
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                     <div className="placeholder-art">🎨</div>
                     <p>Your creation will manifest here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
