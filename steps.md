# Hospital Management System - Local Setup Guide

Follow these steps to set up and run the **Hospitality** project on your local machine.

## 1. Prerequisites
Before you begin, ensure you have the following installed on your laptop:

*   **Git**: [Download Git](https://git-scm.com/downloads) (To clone the project).
*   **Node.js (v18 or higher)**: [Download Node.js](https://nodejs.org/) (Required for the Frontend. This includes `npm`, which will automatically install React for you).
*   **Python (v3.10 or higher)**: [Download Python](https://www.python.org/) (Required for the Backend).
*   **VS Code**: [Download VS Code](https://code.visualstudio.com/) (Recommended IDE).

> [!NOTE]
> You **do not** need to install React separately. It is a package that gets installed automatically when you run the `npm install` command inside the frontend folder.


---

## 2. Clone the Project
Open your terminal or command prompt and run:

```bash
git clone https://github.com/hereisVaibhav/Hospitality.git
cd Hospitality
```

---

## 3. Backend Setup (FastAPI)
The backend is built using Python and FastAPI.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a Virtual Environment (Highly Recommended):**
    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    # Mac/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up Environment Variables:**
    *   Create a file named `.env` in the `backend` folder.
    *   Copy the content from `.env.example` into `.env`.
    *   *(Default values are usually fine for local development)*.

5.  **Run the Backend Server:**
    ```bash
    uvicorn app.main:app --reload
    ```
    The backend will start at `http://localhost:8000`.

---

## 4. Frontend Setup (React + Vite)
The frontend is built using React and Vite.

1.  **Open a new terminal window** (keep the backend terminal running).
2.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

3.  **Install Dependencies (This installs React and other libraries):**
    ```bash
    npm install
    ```

4.  **Set up Environment Variables:**
    *   Create a file named `.env` in the `frontend` folder.
    *   Copy the content from `.env.example` into `.env`.
    *   Ensure `VITE_API_URL` points to your backend (default is `http://localhost:8000/api/v1`).

5.  **Run the Frontend Development Server:**
    ```bash
    npm run dev
    ```
    The frontend will start (usually at `http://localhost:5173`). Open this URL in your browser.

---

## 5. Troubleshooting
*   **Node Version**: If `npm install` fails, ensure you are using a modern Node.js version.
*   **Port Conflicts**: If port `8000` or `5173` is already in use, you can change them in the `.env` files.
*   **Python Path**: On some systems, you might need to use `python3` or `pip3` instead of `python` or `pip`.

---

## 6. Summary of Commands (Quick Start)

| Part | Command |
| :--- | :--- |
| **Clone** | `git clone https://github.com/hereisVaibhav/Hospitality.git` |
| **Backend** | `cd backend && python -m venv venv && .\venv\Scripts\activate && pip install -r requirements.txt && uvicorn app.main:app --reload` |
| **Frontend** | `cd frontend && npm install && npm run dev` |

Happy Coding! 🚀
