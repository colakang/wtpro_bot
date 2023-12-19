# WT Pro with Google Gemini API Node.js Server

This Node.js server is designed to consume Google's Gemini API, a powerful generative AI tool. It includes two primary functionalities:

## Prerequisites

Before running the project, make sure you have the following:

- Docker installed.
- Gemini API keys generated from [Google AI Studio](https://makersuite.google.com/).

## Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/colakang/wtpro_bot.git
   cd wtpro_bot
   ```

2. **Configure Settings:**

   - Create a `.env` file in the project root with the following environment variables:

   ```env
   PORT=8888
   GEMINI_API_KEY=your_api_key
   ```

   - Adjust other settings in the `server/config` folder if needed.

3. **Run the Server:**
   ```bash
   npm install
   npm run start
   ```
   
   **Or:**
   ```bash 
   sudo docker-compose up -d --build
   ```

## Usage and Making API Calls

- The server will be running at `http://localhost:8888` by default.
- Access the API endpoints by making a POST request at `http://localhost:8888/chat-with-gemini`

Request body example of `"text_only"` model

```json
{
  "spoken": "蟹肉棒X2，台湾云吞面X2，",
  "rawSpoken": "@me 蟹肉棒X2，台湾云吞面X2",
  "receivedName": "CK",
  "groupName": "下单测试-01",
  "groupRemark": "下单测试-01",
  "roomType": 1,
  "atMe": true,
  "textType": 1
}
```


## Integration with Frontend

To implement the views, you can integrate any frontend library of your choice, such as ReactJs, Swelte, etc.

Feel free to enhance and customize the project to meet your specific needs. If you encounter any issues or have suggestions for improvements, please refer to the [GitHub repository](https://github.com/colakang/wtpro_bot.git) and open an issue.
