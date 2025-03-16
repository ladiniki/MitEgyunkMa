import { useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyRecipesModal = ({ isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    title: '',
    ingredients: [{ name: '', amount: '', unit: '' }],
    instructions: '',
    prepTime: '',
    difficulty: 'közepes',
    imageUrl: ''
  });

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index][field] = value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: '', amount: '', unit: '' }]
    });
  };

  const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwt');
      
      if (!token) {
        navigate('/login');
        return;
      }

      console.log('Küldendő recept:', recipe); // Debug log

      const response = await fetch('http://localhost:5000/api/recipes/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(recipe)
      });
      
      if (response.status === 401) {
        localStorage.removeItem('jwt');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba történt a recept mentése során');
      }

      const result = await response.json();
      console.log('Szerver válasz:', result); // Debug log

      onClose();
      setRecipe({
        title: '',
        ingredients: [{ name: '', amount: '', unit: '' }],
        instructions: '',
        prepTime: '',
        difficulty: 'közepes',
        imageUrl: ''
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Hiba történt:', error);
      alert('Nem sikerült menteni a receptet. Kérjük, próbáld újra később.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-secondary rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-dark-secondary z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Új recept hozzáadása</h2>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recept neve</label>
            <input
              type="text"
              value={recipe.title}
              onChange={(e) => setRecipe({...recipe, title: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-secondary text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hozzávalók</label>
            <div className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Név"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-secondary text-gray-900 dark:text-gray-100"
                  />
                  <input
                    type="text"
                    placeholder="Mennyiség"
                    value={ingredient.amount}
                    onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                    className="w-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-secondary text-gray-900 dark:text-gray-100"
                  />
                  <input
                    type="text"
                    placeholder="Egység"
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    className="w-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-secondary text-gray-900 dark:text-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-3 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="mt-3 px-4 py-2 text-sm bg-orange-100 dark:bg-dark-tertiary text-orange-600 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-dark-secondary transition-colors duration-300"
            >
              + Hozzávaló hozzáadása
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Elkészítés</label>
            <textarea
              value={recipe.instructions}
              onChange={(e) => setRecipe({...recipe, instructions: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-secondary text-gray-900 dark:text-gray-100 h-32"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Elkészítési idő (perc)</label>
              <input
                type="number"
                value={recipe.prepTime}
                onChange={(e) => setRecipe({...recipe, prepTime: e.target.value})}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-secondary text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nehézség</label>
              <select
                value={recipe.difficulty}
                onChange={(e) => setRecipe({...recipe, difficulty: e.target.value})}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-secondary text-gray-900 dark:text-gray-100"
              >
                <option value="könnyű">Könnyű</option>
                <option value="közepes">Közepes</option>
                <option value="nehéz">Nehéz</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kép URL (opcionális)</label>
            <input
              type="url"
              value={recipe.imageUrl}
              onChange={(e) => setRecipe({...recipe, imageUrl: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-secondary text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Mégse
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
            >
              Recept mentése
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyRecipesModal; 