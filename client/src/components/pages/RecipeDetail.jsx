import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, ChefHat, Utensils, Trophy, Home, Check, MessageCircle, Star, ChevronDown, ChevronUp } from "lucide-react";

const RecipeDetail = () => {
  const { recipeName } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Görgetés letiltása az oldal betöltésekor
  useEffect(() => {
    // Mentjük az eredeti overflow értéket
    const originalStyle = document.body.style.overflow;
    // Letiltjuk a görgetést
    document.body.style.overflow = 'hidden';
    
    // Cleanup: visszaállítjuk az eredeti állapotot, amikor a komponens unmountol
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        // URL-kódolt receptnév használata a lekérdezésben
        const encodedName = encodeURIComponent(recipeName);
        const response = await fetch(`http://localhost:5000/recipe/${encodedName}`);
        
        if (!response.ok) {
          throw new Error(`HTTP hiba! Státusz: ${response.status}`);
        }
        
        const data = await response.json();
        setRecipe(data);
        setLoading(false);
      } catch (error) {
        console.error("Hiba a recept lekérdezésekor:", error);
        setError("Nem sikerült betölteni a receptet. Kérjük, próbáld újra később.");
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipeName]);

  // Vélemények betöltése
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/recipe/${encodeURIComponent(recipeName)}/reviews`);
        if (!response.ok) throw new Error('Nem sikerült betölteni a véleményeket');
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Hiba a vélemények betöltésekor:', error);
        setReviewError('Nem sikerült betölteni a véleményeket');
      }
    };

    if (recipeName) {
      fetchReviews();
    }
  }, [recipeName]);

  // Jelenlegi felhasználó lekérése
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          console.error("Nincs bejelentkezési token");
          return;
        }

        const response = await fetch("http://localhost:5000/user", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP hiba: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setCurrentUser(data.username);
      } catch (error) {
        console.error("Hiba a felhasználó lekérdezésekor:", error.message);
      }
    };

    fetchCurrentUser();
  }, []);

  // Új vélemény beküldése
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    setIsSubmitting(true);
    setReviewError(null);

    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('A véleményezéshez be kell jelentkezni!');
      }

      const response = await fetch(`http://localhost:5000/recipe/${encodeURIComponent(recipeName)}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba történt a vélemény mentése közben');
      }

      const savedReview = await response.json();
      setReviews(prevReviews => [savedReview, ...prevReviews]);
      setNewReview({ rating: 5, comment: "" });
    } catch (error) {
      console.error('Hiba:', error);
      setReviewError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Csillagok renderelése
  const renderStars = (rating, isInteractive = false) => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        type={isInteractive ? "button" : undefined}
        onClick={isInteractive ? () => setNewReview(prev => ({ ...prev, rating: index + 1 })) : undefined}
        className={`${isInteractive ? 'cursor-pointer focus:outline-none' : ''}`}
        disabled={!isInteractive}
      >
        <Star
          size={isInteractive ? 24 : 16}
          className={`${
            index < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          } ${isInteractive ? 'transition-colors hover:fill-yellow-400 hover:text-yellow-400' : ''}`}
        />
      </button>
    ));
  };

  // Lépés befejezettként megjelölése
  const toggleStepCompletion = (index) => {
    setCompletedSteps(prev => {
      // Ha már be van pipálva, akkor mindig ki lehet venni a pipát
      if (prev.includes(index)) {
        // Eltávolítjuk a jelenlegi lépést
        const newCompletedSteps = prev.filter(stepIndex => stepIndex !== index);
        
        // Ha ez a lépés nem az utolsó befejezett lépés, akkor az utána következő befejezett lépéseket is el kell távolítani
        return newCompletedSteps.filter(stepIndex => stepIndex < index);
      } else {
        // Csak akkor lehet bejelölni, ha az előző lépés már kész, vagy ez az első lépés
        const isPreviousStepCompleted = index === 0 || prev.includes(index - 1);
        
        if (isPreviousStepCompleted) {
          return [...prev, index];
        }
        
        // Ha nem teljesül a feltétel, visszaadjuk az eredeti állapotot
        return prev;
      }
    });
  };

  // Ellenőrzi, hogy egy lépés bejelölhető-e
  const isStepCheckable = (index) => {
    return index === 0 || completedSteps.includes(index - 1);
  };

  // Nehézségi szint megjelenítése
  const renderDifficulty = (difficulty) => {
    if (!difficulty) return null;

    let color, icon, label;
    
    switch(difficulty) {
      case "könnyű":
        color = "bg-green-100 text-green-700";
        icon = <ChefHat size={16} className="mr-1" />;
        label = "Könnyű";
        break;
      case "közepes":
        color = "bg-yellow-100 text-yellow-700";
        icon = <Utensils size={16} className="mr-1" />;
        label = "Közepes";
        break;
      case "haladó":
        color = "bg-red-100 text-red-700";
        icon = <Trophy size={16} className="mr-1" />;
        label = "Haladó";
        break;
      default:
        return null;
    }
    
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {icon}
        {label}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-4 h-full flex justify-center items-center overflow-hidden">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 py-4 h-full flex flex-col items-center justify-center overflow-hidden">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button 
          onClick={() => navigate("/recipies")} 
          className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Vissza a receptekhez
        </button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="px-4 sm:px-6 py-4 h-full flex flex-col items-center justify-center overflow-hidden">
        <p className="text-gray-500 text-lg mb-4">A recept nem található.</p>
        <button 
          onClick={() => navigate("/recipies")} 
          className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Vissza a receptekhez
        </button>
      </div>
    );
  }

  // Korlátozzuk a megjelenített elemek számát
  const maxIngredients = 8;
  const maxSteps = 6;
  const displayedIngredients = recipe.ingredients.slice(0, maxIngredients);
  const displayedSteps = recipe.steps.slice(0, maxSteps);

  return (
    <div className="px-4 sm:px-6 py-4 h-[calc(100vh-64px)] flex flex-col overflow-y-auto">
      {/* Navigációs "breadcrumb" stílusú visszalépés */}
      <nav className="mb-4">
        <div className="flex items-center text-sm">
          <button 
            onClick={() => navigate("/recipies")} 
            className="flex items-center text-orange-500 hover:text-orange-600 transition-colors"
            aria-label="Vissza a receptekhez"
          >
            <Home size={16} className="mr-1" />
            <span>Receptek</span>
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600 truncate max-w-[250px]">{recipe.name}</span>
        </div>
      </nav>

      {/* Fő tartalom konténer */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 h-[calc(100%-3rem)]">
        {/* Bal oldal: Kép és alapadatok */}
        <div className="lg:w-1/3 flex flex-col h-full">
          {/* Kép konténer */}
          <div className="relative rounded-xl overflow-hidden shadow-md h-40 sm:h-48 md:h-56 lg:h-64 flex-shrink-0">
            <img 
              src={recipe.image} 
              alt={recipe.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-3 text-white">
                <h1 className="text-xl sm:text-2xl font-bold line-clamp-2">{recipe.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs">
                    <Clock size={12} className="mr-1" />
                    <span>{recipe.cookingTime} perc</span>
                  </div>
                  {renderDifficulty(recipe.difficulty)}
                  <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs">
                    {recipe.mealType}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leírás */}
          <div className="mt-3 bg-white p-3 rounded-xl shadow-md flex-1">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Leírás</h2>
            <p className="text-gray-600 text-sm line-clamp-6">{recipe.description}</p>
          </div>
        </div>

        {/* Jobb oldal: Hozzávalók és elkészítés lépései */}
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
          {/* Hozzávalók */}
          <div className="bg-white p-3 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Hozzávalók</h2>
            <div>
              <ul className="space-y-1.5">
                {displayedIngredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center bg-orange-50 p-1.5 rounded-lg text-sm">
                    <span className="w-5 h-5 flex items-center justify-center bg-orange-100 rounded-full mr-2 text-orange-600 text-xs font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 truncate">
                      {ingredient.name}: {ingredient.amount} {ingredient.unit}
                    </span>
                  </li>
                ))}
                {recipe.ingredients.length > maxIngredients && (
                  <li className="text-center text-xs text-gray-500 mt-1">
                    +{recipe.ingredients.length - maxIngredients} további hozzávaló
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Elkészítés lépései */}
          <div className="bg-white p-3 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Elkészítés</h2>
            <div>
              <ol className="space-y-1.5">
                {displayedSteps.map((step, index) => (
                  <li key={index} className="flex text-sm">
                    <button 
                      onClick={() => toggleStepCompletion(index)}
                      className={`flex-shrink-0 w-5 h-5 flex items-center justify-center ${
                        completedSteps.includes(index) 
                          ? 'bg-green-500' 
                          : isStepCheckable(index)
                            ? 'bg-orange-500'
                            : 'bg-gray-400'
                      } text-white rounded-full mr-2 text-xs font-medium transition-colors`}
                      disabled={!isStepCheckable(index) && !completedSteps.includes(index)}
                      aria-label={`${completedSteps.includes(index) ? 'Lépés visszaállítása' : 'Lépés befejezése'}`}
                      title={!isStepCheckable(index) && !completedSteps.includes(index) ? 'Előbb az előző lépést fejezd be' : ''}
                    >
                      {completedSteps.includes(index) ? <Check size={12} /> : index + 1}
                    </button>
                    <div 
                      className={`bg-gray-50 p-2 rounded-lg flex-grow ${
                        completedSteps.includes(index) ? 'bg-green-50' : ''
                      }`}
                    >
                      <p className={`text-gray-700 line-clamp-2 ${
                        completedSteps.includes(index) ? 'line-through text-gray-500' : ''
                      }`}>
                        {step}
                      </p>
                    </div>
                  </li>
                ))}
                {recipe.steps.length > maxSteps && (
                  <li className="text-center text-xs text-gray-500 mt-1">
                    +{recipe.steps.length - maxSteps} további lépés
                  </li>
                )}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Vélemények szekció */}
      <div className="mt-4 mb-6">
        <button
          onClick={() => setShowReviews(!showReviews)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center">
            <MessageCircle size={20} className="text-orange-500 mr-2" />
            <span className="font-semibold text-gray-800">Vélemények</span>
            {reviews.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-sm">
                {reviews.length}
              </span>
            )}
          </div>
          {showReviews ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </button>

        {showReviews && (
          <div className="mt-3 bg-white p-4 rounded-xl shadow-md">
            {/* Új vélemény form */}
            <form onSubmit={handleSubmitReview} className="mb-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-3">Értékelés:</span>
                  <div className="flex space-x-1">
                    {renderStars(newReview.rating, true)}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Írd le a véleményed..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px] resize-none"
                  />
                  {reviewError && (
                    <p className="text-red-500 text-sm">{reviewError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting || !newReview.comment.trim()}
                    className={`self-end px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors ${
                      (isSubmitting || !newReview.comment.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Küldés...' : 'Vélemény küldése'}
                  </button>
                </div>
              </div>
            </form>

            {/* Vélemények listája */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  Még nincsenek vélemények. Légy te az első!
                </p>
              ) : (
                reviews.map((review, index) => (
                  <div
                    key={review._id || index}
                    className={`p-4 rounded-lg transition-colors ${
                      review.username === currentUser 
                        ? 'bg-orange-50 hover:bg-orange-100 border-2 border-orange-200' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-800 mr-2">
                            {review.username}
                          </span>
                          {review.username === currentUser && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                              Te
                            </span>
                          )}
                        </div>
                        <div className="flex ml-3">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.date ? new Date(review.date).toLocaleString('hu-HU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: 'Europe/Budapest'
                        }) : 'Ismeretlen dátum'}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail; 