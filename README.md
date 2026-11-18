# CookMate — API Documentation

CookMate is a recipe web application where users can discover recipes, create and manage their own recipes, save favorite recipes, and receive AI-powered recommendations based on ingredients they have.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [Application Features](#application-features)
- [Project Setup](#project-setup)
- [Environment Variables](#environment-variables)
- [API Conventions](#api-conventions)
- [Authentication](#authentication)
- [Authentication Endpoints](#authentication-endpoints)
- [User Endpoints](#user-endpoints)
- [Recipe Endpoints](#recipe-endpoints)
- [Saved Recipe Endpoints](#saved-recipe-endpoints)
- [External Recipe Endpoints](#external-recipe-endpoints)
- [AI Recommendation Endpoint](#ai-recommendation-endpoint)
- [Error Responses](#error-responses)
- [Third-Party APIs](#third-party-apis)

## Technology Stack

- **Frontend:** React, Vite, Redux Toolkit, React Router, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT, Google Login
- **Password Hashing:** bcrypt/bcryptjs
- **AI:** Google Gemini API
- **External Recipe Data:** TheMealDB API

## Database Schema

CookMate uses PostgreSQL with Sequelize. The database contains three tables: `Users`, `Recipes`, and `SavedRecipes`.

### Tables and fields

#### `Users`

Stores user account and profile information.

| Column | Type / constraint | Description |
|---|---|---|
| `id` | Integer, primary key | Auto-incrementing user ID. |
| `name` | String | User's display name. |
| `email` | String, unique | User's email address. |
| `password` | String, nullable for Google users | Hashed password for email/password accounts. Google-authenticated accounts may not have a password. |
| `imageProfile` | String | Profile image URL or path. |
| `createdAt` | Timestamp | Record creation time, managed by Sequelize. |
| `updatedAt` | Timestamp | Last update time, managed by Sequelize. |

#### `Recipes`

Stores recipes created by users.

| Column | Type / constraint | Description |
|---|---|---|
| `id` | Integer, primary key | Auto-incrementing recipe ID. |
| `name` | String | Recipe name. |
| `description` | Text | Short recipe description. |
| `ingredients` | Text | Ingredients for the recipe. |
| `instructions` | Text | Cooking instructions. |
| `image` | String | Recipe image URL or path. |
| `category` | String | Recipe category, such as Chicken, Beef, or Pasta. |
| `UserId` | Integer, foreign key → `Users.id` | User who created the recipe. |
| `createdAt` | Timestamp | Record creation time, managed by Sequelize. |
| `updatedAt` | Timestamp | Last update time, managed by Sequelize. |

#### `SavedRecipes`

Stores the relationship between a user and a recipe they have saved.

| Column | Type / constraint | Description |
|---|---|---|
| `id` | Integer, primary key | Auto-incrementing saved-recipe record ID. |
| `UserId` | Integer, foreign key → `Users.id` | User who saved the recipe. |
| `RecipeId` | Integer, foreign key → `Recipes.id` | Recipe that was saved. |
| `createdAt` | Timestamp | When the recipe was saved, managed by Sequelize. |
| `updatedAt` | Timestamp | Last update time, managed by Sequelize. |

### Relationships

- One user can create many recipes; each recipe belongs to one user through `Recipes.UserId`.
- One user can save many recipes through `SavedRecipes.UserId`.
- One recipe can be saved by many users through `SavedRecipes.RecipeId`.
- `SavedRecipes` is the join table connecting `Users` and `Recipes` for saved recipes.
- `TheMealDB` recipes are external API data and are not part of these three local database tables unless explicitly copied into `Recipes`.

> **Implementation note:** This schema documents the fields shown in the current database diagram. Confirm whether `Users.password` is nullable in the actual migration/model, and whether a unique composite constraint exists for (`UserId`, `RecipeId`) in `SavedRecipes`, before treating those constraints as enforced by the database.

## Application Features

- Register and log in using email and password
- Log in using Google
- View the current user's profile
- Browse, create, view, update, and delete recipes
- View recipes created by the current user
- Save and unsave recipes
- Explore recipes provided by TheMealDB
- Get recipe recommendations from available ingredients using AI

## Project Setup

### Prerequisites

- Node.js and npm
- PostgreSQL
- API credentials for Google Login and Google Gemini

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

Configure the backend environment variables as described below, then run the backend using the script defined in `backend/package.json`, for example:

```bash
npm start
```

If the project uses a development script, use `npm run dev` instead.

### 3. Install frontend dependencies

Open another terminal:

```bash
cd cookmate_FE
npm install
npm run dev
```

Vite usually serves the frontend at `http://localhost:5173`.

## Environment Variables

Create a `.env` file in the backend directory. Use the variable names required by the backend configuration; the following are the variables used by the application integrations:

```env
PORT=3000

# PostgreSQL / Sequelize configuration
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_HOST=localhost
DB_PORT=5432

# Authentication
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id

# External recipe service
THEMEALDB_API_KEY=your_themealdb_api_key
THEMEALDB_BASE_URL=https://www.themealdb.com/api/json/v1

# AI recipe recommendation
GEMINI_API_KEY=your_gemini_api_key
```

The exact database and Google environment variable names must match the configuration files in the backend. Never commit real credentials or `.env` files to GitHub.

## API Conventions

**Local API base URL (development):** `http://localhost:3000`

Unless stated otherwise:

- Request bodies use JSON.
- Protected endpoints require a JWT access token.
- The access token is returned as `access_token` after successful login.
- Send the token in the `Authorization` header as `Bearer <access_token>`.
- IDs in path parameters refer to local database records unless the endpoint explicitly describes an external TheMealDB recipe.

Example protected request header:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Authentication

### Register

`POST /register`

Creates a new user account.

**Request body**

```json
{
  "name": "Shania",
  "email": "shania@example.com",
  "password": "your-password",
  "imageProfile": "https://example.com/profile.jpg"
}
```

`imageProfile` is optional if the backend supports a default profile image.

**Successful response — example**

```json
{
  "message": "Register success"
}
```

### Login with email and password

`POST /login`

**Request body**

```json
{
  "email": "shania@example.com",
  "password": "your-password"
}
```

**Successful response**

```json
{
  "access_token": "<jwt-token>"
}
```

### Google Login

`POST /google-login`

The frontend obtains a Google credential and sends it in the `token` request header.

**Request headers**

```http
token: <google-credential>
```

**Successful response**

```json
{
  "access_token": "<jwt-token>"
}
```

### Logout

The frontend logs out by removing `access_token` from local storage. If the backend does not implement token revocation, the JWT remains valid until it expires.

## User Endpoints

### Get current user

`GET /user/me`

Returns the profile belonging to the authenticated user.

**Headers:** `Authorization: Bearer <access_token>`

**Response example**

```json
{
  "id": 1,
  "name": "Shania Risky Agustin",
  "email": "shania@example.com",
  "imageProfile": "https://example.com/profile.jpg"
}
```

The actual response fields depend on the user model and controller. Password hashes should never be included in the response.

## Recipe Endpoints

All local recipe endpoints below require authentication unless the backend route configuration explicitly makes a route public.

### Get all recipes

`GET /recipes`

Returns recipes available through the local recipe API.

### Get my recipes

Use the backend route connected to `RecipeController.getMyRecipe`. This endpoint returns recipes created by the authenticated user, including fields such as `id`, `name`, `description`, `ingredients`, `instructions`, `image`, `category`, `UserId`, `createdAt`, and `updatedAt`.

**Example response**

```json
[
  {
    "id": 1,
    "name": "Creamy Garlic Chicken",
    "description": "A creamy chicken dish with garlic and parmesan.",
    "ingredients": "Chicken, garlic, butter, cream, parmesan cheese",
    "instructions": "Season the chicken. Cook until golden. Add the sauce and simmer.",
    "image": "https://example.com/recipe.jpg",
    "category": "Chicken",
    "UserId": 1,
    "createdAt": "2026-10-06T10:09:09.908Z",
    "updatedAt": "2026-10-06T10:09:09.908Z"
  }
]
```

### Get recipe detail

`GET /recipes/:id`

Returns the local recipe with the specified ID.

### Create a recipe

`POST /recipes`

**Request body**

```json
{
  "name": "Creamy Garlic Chicken",
  "description": "A creamy and flavorful chicken dish.",
  "ingredients": "Chicken, garlic, butter, heavy cream, parmesan cheese, salt, pepper",
  "instructions": "Season the chicken. Cook until golden. Add cream and parmesan, then simmer.",
  "image": "https://example.com/creamy-garlic-chicken.jpg",
  "category": "Chicken"
}
```

The authenticated user should be assigned as the recipe owner by the backend rather than trusting a user ID supplied by the client.

### Update a recipe

`PUT /recipes/:id`

Updates the recipe identified by `id`. Send the fields to update in a JSON request body. Only the recipe owner should be allowed to update it.

**Request body example**

```json
{
  "name": "Creamy Garlic Chicken Special",
  "description": "Updated recipe description.",
  "ingredients": "Chicken, garlic, butter, cream, parmesan cheese",
  "instructions": "Cook the chicken, prepare the sauce, and simmer together.",
  "image": "https://example.com/updated-recipe.jpg",
  "category": "Chicken"
}
```

### Delete a recipe

`DELETE /recipes/:id`

Deletes the specified recipe. Only the recipe owner should be allowed to delete it.

## Saved Recipe Endpoints

Saved recipes associate an authenticated user with an existing local recipe. The response may contain the saved record and a nested `Recipe` object.

### Get saved recipes

Use the route connected to the saved-recipes controller that returns the current user's saved recipes.

**Response example**

```json
[
  {
    "id": 1,
    "UserId": 1,
    "RecipeId": 3,
    "createdAt": "2026-10-06T10:09:09.912Z",
    "updatedAt": "2026-10-06T10:09:09.912Z",
    "Recipe": {
      "id": 3,
      "name": "Beef Rendang",
      "description": "A rich Indonesian beef dish.",
      "ingredients": "Beef, coconut milk, lemongrass, galangal, garlic, chili",
      "instructions": "Cook the spices and beef slowly with coconut milk.",
      "image": "https://example.com/beef-rendang.jpg",
      "category": "Beef",
      "UserId": 3
    }
  }
]
```

### Save a recipe

Use the saved-recipes creation route configured in the backend. The request must identify the local recipe to save.

**Typical request body**

```json
{
  "RecipeId": 3
}
```

The backend should take the user ID from the authenticated token.

### Unsave a recipe

Use the saved-recipes deletion route configured in the backend. It should remove the saved association for the current user and the specified saved record or recipe ID, according to the backend route implementation.

> **Note:** Confirm the exact URL and whether the delete parameter represents a saved-record ID or a recipe ID against the route definitions in the backend before publishing this documentation. Those route details are intentionally not guessed here.

## External Recipe Endpoints

These endpoints retrieve data from TheMealDB and do not create or modify local recipe records.

### Search recipes

`GET /external-recipes/search?query=chicken`

Searches TheMealDB for recipes by name.

### Get categories

`GET /external-recipes/categories`

Returns recipe categories from TheMealDB.

### Filter recipes

`GET /external-recipes/filter?type=category&value=Chicken`

Filters external recipes. Depending on the backend implementation, supported filter types can include `category`, `area`, or `ingredient`.

### Get external recipe detail

`GET /external-recipes/:id`

Returns detailed recipe information from TheMealDB for the specified **TheMealDB meal ID**.

## AI Recommendation Endpoint

### Recommend recipes from available ingredients

`POST /ai/recommend`

Uses TheMealDB to find candidate recipes and Google Gemini to rank/explain suitable matches based on ingredients supplied by the user.

**Request body**

```json
{
  "ingredients": "chicken, egg, garlic, soy sauce",
  "preferences": "spicy"
}
```

`preferences` is optional.

**Successful response — example**

```json
{
  "recommendations": [
    {
      "meal_id": "52774",
      "recipe_name": "Pad See Ew",
      "image": "https://www.themealdb.com/images/media/meals/uuuspp1468263334.jpg",
      "category": "Chicken",
      "area": "Thai",
      "match_percentage": 58,
      "reason": "This recipe uses several of the ingredients you have.",
      "available_ingredients": [
        "chicken",
        "egg",
        "garlic",
        "soy sauce"
      ],
      "additional_ingredients": [
        "rice stick noodles",
        "dark soy sauce",
        "oyster sauce"
      ]
    }
  ]
}
```

The exact number of recommendations and response fields depend on the backend implementation. `meal_id` is a TheMealDB ID and should be used with the external recipe detail endpoint, not the local `/recipes/:id` endpoint.

## Error Responses

Error responses generally contain a message describing the failure. Example:

```json
{
  "message": "Failed to fetch recipes"
}
```

Common HTTP status codes include:

| Status | Meaning |
|---|---|
| `200 OK` | Request completed successfully. |
| `201 Created` | A resource was created successfully, if returned by the route. |
| `400 Bad Request` | Request body or parameters are invalid. |
| `401 Unauthorized` | Authentication is missing or the token is invalid/expired. |
| `403 Forbidden` | The authenticated user is not permitted to perform the action. |
| `404 Not Found` | The requested resource or matching recipe was not found. |
| `500 Internal Server Error` | An unexpected server error occurred. |
| `502/503` | An upstream service such as an AI provider may be unavailable. |

Actual status codes and error messages are determined by each backend controller and middleware.

## Third-Party APIs

### TheMealDB

Used to search, filter, and retrieve details for external recipes.

- API documentation: <https://www.themealdb.com/api.php>
- TheMealDB recipe IDs are separate from local PostgreSQL recipe IDs.

### Google Gemini

Used to recommend suitable recipes based on the ingredients supplied by the user. The API key must remain on the backend and must never be exposed in frontend code.

- API documentation: <https://ai.google.dev/gemini-api/docs>

### Google Login

Google Login provides a credential to the backend, which validates it and returns the application's JWT access token. Configure the Google OAuth client ID for the frontend and backend as required by the project.

---

## Important Before Publishing

Review the backend route definitions and replace any descriptive placeholders in the **Get my recipes** and **Saved Recipe Endpoints** sections with the exact HTTP method and URL used by the current project. Also verify the database environment variable names and response status codes against the backend configuration.
