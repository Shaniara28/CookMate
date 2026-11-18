// import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BaseLayout from "./pages/BaseLayout"
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import DetailRecipe from "./pages/DetailRecipe";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import ExploreRecipes from "./pages/ExploreRecipes";
import ExternalRecipeDetail from "./pages/ExternalRecipeDetail";
import AIRecommendation from "./pages/AIRecommendation";
import ProtectedRoute from "./pages/ProtectedRoute";
import PublicRoute from "./pages/PublicRoute";
import UpdateProfile from "./pages/UpdateProfile";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<BaseLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/detail-recipe/:id" element={<DetailRecipe />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/edit-recipe/:id" element={<EditRecipe />} />
            <Route path="/explore-recipes" element={<ExploreRecipes />} />
            <Route path="/explore-recipe/:id" element={<ExternalRecipeDetail />} />
            <Route path="/ai-recommendation" element={<AIRecommendation />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
