# 🐘 Elephant — English Learning Application

**A web application for Japanese learners to practice English through lessons and quizzes.**

**Status: In Development**

Elephant is a personal project designed to help Japanese learners improve their English through structured courses, interactive quizzes, and progress tracking.

This project focuses on backend API development using PHP, Laravel, and relational databases.

## 🇯🇵 プロジェクト概要

Elephantは、日本語話者向けに開発している英語学習Webアプリケーションです。

コース・レッスン・クイズを通じて英語を学習し、学習履歴やスコア、獲得XPを管理することを目指しています。

現在はLaravelによるバックエンドAPIを中心に開発しており、フロントエンドについても今後実装する予定です。

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Backend | PHP 8.3+, Laravel 13 |
| Authentication | Laravel Sanctum |
| Database | PostgreSQL (target database), SQLite (local configuration) |
| API | REST-style JSON API |
| Testing | PHPUnit |
| Version Control | Git, GitHub |
| Frontend (Planned) | Next.js, TypeScript, Tailwind CSS |

## ✅ Implemented Backend Functionality

The repository currently contains implementations of the following backend features:

- Course listing and course details
- Unit and lesson retrieval
- Question and answer retrieval
- Quiz start, answer submission, and completion endpoints
- Quiz score calculation
- XP calculation and awarding logic
- Learning progress summary
- Authentication middleware for protected endpoints
- Request validation and quiz ownership checks
- Database transactions and row locking during quiz completion

*These features have been implemented in the codebase. End-to-end functionality and deployment are still under development.*

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | List courses |
| GET | `/api/courses/{course}` | Get course details |
| GET | `/api/courses/{course}/units` | List course units |
| GET | `/api/units/{unit}/lessons` | List lessons |
| GET | `/api/lessons/{lesson}/questions` | List questions |
| POST | `/api/lessons/{lesson}/quiz/start` | Start a quiz |
| POST | `/api/quiz-results/{quizResult}/answers` | Submit a quiz answer |
| POST | `/api/quiz-results/{quizResult}/finish` | Finish a quiz |
| GET | `/api/progress` | Retrieve learning progress |

Quiz and progress endpoints require authentication through Laravel Sanctum.

## 🧠 Backend Design Highlights

### Quiz Validation

Quiz answer submission checks:

- Whether the authenticated user owns the quiz
- Whether the quiz is still in progress
- Whether the question belongs to the selected lesson
- Whether the answer belongs to the specified question
- Whether the question has already been answered

### Transactions and XP Management

The quiz completion process uses a database transaction to handle related updates.

Row locking is used to coordinate quiz completion and user XP updates.

The implementation also checks previous quiz results to avoid awarding XP repeatedly for the same lesson.

### Learning Progress

The progress API retrieves:

- Total XP
- User level
- Number of completed lessons
- Average quiz score

## 📁 Project Structure

```text
elephant/
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   └── Models/
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   │   └── api.php
│   └── tests/
└── README.md
```

## 🚀 Local Setup (Backend)

Requirements:

- PHP 8.3 or later
- Composer
- SQLite for the default local configuration

```bash
git clone https://github.com/yamamoto-666/elephant.git
cd elephant/backend

composer install
cp .env.example .env
php artisan key:generate
```

Create the SQLite database file if it does not exist:

```bash
touch database/database.sqlite
```

Then run:

```bash
php artisan migrate
php artisan serve
```

The Laravel development server runs at:

`http://127.0.0.1:8000`

To run the available automated tests:

```bash
php artisan test
```

*PostgreSQL requires separate database creation and configuration in `.env`.*

## 🚧 Planned Improvements

- Complete the Next.js and TypeScript frontend
- Implement and integrate user authentication flows
- Expand automated API testing
- Improve quiz and learning progress functionality
- Add review and vocabulary learning features
- Prepare deployment and CI/CD workflows

## 🎯 Project Goals

Through Elephant, I aim to improve my skills in:

- REST API design and implementation
- Laravel and Eloquent ORM
- Relational database design
- Authentication and authorization
- Data integrity and transaction management
- Automated testing
- Backend architecture and maintainability

---

**Developer:** [yamamoto-666](https://github.com/yamamoto-666)

**Project Status:** Active Development
