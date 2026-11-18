# Common Ground

**Common Ground - Connect citizens and cities on urban planing proposals**
<br>
A civic engagement platform with AI-enhanced workflows, powered by Next.js, React, Supabase, and Gemini
<br><br>

## About

- **Collaborative Planning**: Community members can contribute ideas and proposals to urban development projects
- **AI-Enhanced Visualization**: Generation of visual representations of community ideas
- **AI-Enhanced Submission Process**: Support for checking limitations, writing a description, and content moderation
- **User-Friendly Design**: Lower barriers to explore and write proposals
- **Powerful Participation**: Making civic participation transparent, accessible, and effective for all members

<img src="https://github.com/user-attachments/assets/7bf4707a-4c74-4638-99de-a04e7175ec43" alt="common ground" width="550" />
<br><br>

## Local Development Setup

To run the current development build locally on your machine, follow these steps:

### Prerequisites
- **Node.js** (v18.x or higher)
- **Git**
- Access to **Supabase**
- A **Gemini API Key** that is also enabled for **Google Perspectives**

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/LukPle/common_ground.git
   cd common_ground
   ```
   
2. **Install dependencies:**

   ```sh
    npm install
   ```

3. **Configure Environment Variables:**
Create a .env.local file in the root directory and add your Supabase and Gemini API keys:

   ```sh
   GEMINI_API_KEY=your_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_api_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_api_key_here
   ACCESS_CODE=abc123
   ```

`ACCESS_CODE` is a 6-character letter/digit code required before using the ideation page and its AI APIs. Leave it unset locally if you want the gate disabled during development. Set it in production to prevent random visitors from using paid APIs.

4. **Start the development server:**

   ```sh
    npm run dev
   ```

Open http://localhost:3000 with your browser to see the result.
<br>
