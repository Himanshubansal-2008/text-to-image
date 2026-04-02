# ImagiGen Pro 🎨

ImagiGen Pro is a high-fidelity AI-powered text-to-image generator that translates your imagination into stunning digital art. Built with React and Vite, it leverages the powerful Stable Diffusion XL 1.0 model via the Hugging Face Inference API.

## ✨ Features

- **High-Fidelity Generation**: Create detailed artworks using the Stable Diffusion XL 1.0 model.
- **Persistent History**: Your generations are automatically saved locally, allowing you to revisit previous prompts and results.
- **Dynamic Themes**: Seamlessly switch between elegant **Dark** and **Light** modes.
- **Responsive Layout**: A modern sidebar-based interface that works beautifully across devices.
- **Instant Downloads**: Save your generated masterpieces directly to your device.
- **Smart Interactions**: Keyboard shortcuts (Enter to generate) and real-time loading states.

## 🚀 Tech Stack

- **Frontend**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS (Custom properties for theming)
- **AI Model**: [Stable Diffusion XL 1.0](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0)
- **API**: Hugging Face Inference API

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Hugging Face API Token (Free)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd text-to-image
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Hugging Face token:
   ```env
   VITE_HF_TOKEN=your_huggingface_token_here
   ```
   *Note: You can obtain a token from [Hugging Face Settings](https://huggingface.co/settings/tokens).*

### Development

Run the development server:
```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## 🎨 How it Works

1. **Input**: Enter a descriptive prompt in the text area (e.g., "A cyberpunk city in the style of Blade Runner").
2. **Process**: The app sends a request to the Hugging Face Inference API.
3. **Synthesis**: The Stable Diffusion XL model generates the image based on your prompt.
4. **Result**: The image is displayed on the canvas and automatically added to your generation history.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ using React and Stable Diffusion.
