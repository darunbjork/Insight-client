# Insight-client

## Project Overview

Insight-client is a modern, responsive web application designed to provide users with a platform to share their thoughts, ideas, and experiences. It features a dynamic feed of user-generated posts, robust authentication, and intuitive user profiles. Built with cutting-edge frontend technologies, Insight-client offers a seamless and engaging user experience.

## Features

*   **User Authentication:** Secure registration, login, and session management with automatic token refresh.
*   **Post Management:** Create, view, and interact with posts, including text content and image uploads.
*   **Global Feed:** Explore a dynamic feed of posts from all users.
*   **User Profiles:** View and manage personal profiles, including avatar uploads.
*   **Interactive UI:** A responsive and user-friendly interface for seamless navigation and interaction.
*   **Robust Error Handling:** Centralized and user-friendly error reporting for API interactions.

## Technologies Used

*   **Frontend Framework:** React (with Vite for fast development)
*   **State Management:** React Query (for data fetching, caching, and synchronization)
*   **Routing:** React Router DOM
*   **Form Management:** React Hook Form with Zod for schema validation
*   **Styling:** SCSS (Sass) for maintainable and modular stylesheets
*   **API Communication:** Axios
*   **Notifications:** React Hot Toast
*   **Type Checking:** TypeScript

## Getting Started

Follow these instructions to set up and run the Insight-client locally.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/darunbjork/Insight-client.git
    cd Insight-client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in the root of the project based on `.env.example` (if available) and configure your API endpoint:
    ```
    VITE_API_URL=https://insight-api-production.onrender.com/api/v1 # Replace with your backend API URL
    ```
    *(Note: The backend API is required to run this client application.)*

### Running the Application

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

To create a production-ready build:

```bash
npm run build
# or
yarn build
```

The optimized static files will be generated in the `dist/` directory.

## Project Structure

```
insight-client/
├── public/                 # Static assets
├── src/                    # Application source code
│   ├── api/                # API service integrations
│   ├── assets/             # Static assets (images, icons)
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Authentication-related components
│   │   ├── comments/       # Comment-related components
│   │   ├── layout/         # Layout components (Header, Footer)
│   │   ├── likes/          # Like-related components
│   │   ├── posts/          # Post-related components
│   │   └── ui/             # Generic UI elements (Button, Input, Spinner)
│   ├── contexts/           # React Contexts for global state
│   ├── hooks/              # Custom React Hooks
│   ├── pages/              # Top-level page components
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── .env                    # Environment variables
├── .gitignore              # Git ignore rules
├── package.json            # Project dependencies and scripts
├── README.md               # Project README
├── tailwind.config.js      # Tailwind CSS configuration (if applicable)
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build tool configuration
```

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or inquiries, please contact:
*   Darun
*   darunbjork@gmail.com
*   [Project Website/Link] No Link yet