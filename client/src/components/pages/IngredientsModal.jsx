import { useState } from "react";
import { X, Search } from "lucide-react";
import PropTypes from "prop-types";

const ingredientsList = [
  { name: "Bors", unit: "csomag", image: "fekete-bors-egesz.webp" },
  { name: "Krumpli", unit: "db", image: "krumpli.jpg" },
  { name: "Kukorica", unit: "db", image: "kukorica.jpg" },
  { name: "Káposzta", unit: "db", image: "tukortojás.jpg" },
  { name: "Liszt", unit: "dkg", image: "csokitorta.jpeg" },
  { name: "Tej", unit: "ml", image: "tej.jpg" },
  { name: "Tojás", unit: "db", image: "tojas.jpg" },
  { name: "Vaj", unit: "g", image: "vaj.jpg" },
  { name: "Cukor", unit: "g", image: "cukor.jpg" },
  { name: "Sütőpor", unit: "tk", image: "sutopor.jpg" },
  { name: "Paradicsom", unit: "db", image: "paradicsom.jpg" },
  { name: "Hagyma", unit: "db", image: "hagyma.jpg" },
  { name: "Fokhagyma", unit: "gerezd", image: "fokhagyma.jpg" },
  { name: "Olívaolaj", unit: "ek", image: "olivaolaj.jpg" },
  { name: "Bazsalikom", unit: "csokor", image: "bazsalikom.jpg" },
  { name: "Tejszín", unit: "ml", image: "tejszin.jpg" },
  { name: "Garnélarák", unit: "g", image: "garnelarak.jpg" },
  { name: "Bulgur", unit: "g", image: "bulgur.jpg" },
  { name: "Citromlé", unit: "ek", image: "citromle.jpg" },
  { name: "Petrezselyem", unit: "csokor", image: "petrezselyem.jpg" },
  { name: "Só", unit: "tk", image: "so.jpg" },
  { name: "Fahéj", unit: "tk", image: "fahej.jpg" },
  { name: "Kenyér", unit: "szelet", image: "kenyer.jpg" },
  { name: "Müzli", unit: "g", image: "muzli.jpg" },
  { name: "Joghurt", unit: "g", image: "joghurt.jpg" },
  { name: "Méz", unit: "ek", image: "mez.jpg" },
  { name: "Banán", unit: "db", image: "banan.jpg" },
  { name: "Cukkini", unit: "db", image: "cukkini.jpg" },
  { name: "Olaj", unit: "ek", image: "olaj.jpg" },
  { name: "Mozzarella", unit: "g", image: "mozzarella.jpg" },
  { name: "Balzsamecet", unit: "tk", image: "balzsamecet.jpg" },
  { name: "Szárazbab", unit: "g", image: "szarazbab.jpg" },
  { name: "Füstölt hús", unit: "g", image: "fustolthus.jpg" },
  { name: "Vöröshagyma", unit: "db", image: "voroshagyma.jpg" },
  { name: "Sárgarépa", unit: "g", image: "sargarepa.jpg" },
  { name: "Sonka", unit: "g", image: "sonka.jpg" },
  { name: "Tonhalkonzerv", unit: "db", image: "tonhalkonzerv.jpg" },
  { name: "Uborka", unit: "db", image: "uborka.jpg" },
  { name: "Salátalevél", unit: "g", image: "salatalevél.jpg" },
  { name: "Zöldborsó", unit: "g", image: "zoldborso.jpg" },
  { name: "Padlizsán", unit: "db", image: "padlizsan.jpg" },
  { name: "Parmezán", unit: "g", image: "parmezan.jpg" },
  { name: "Zabpehely", unit: "g", image: "zabpehely.jpg" },
  { name: "Alma", unit: "db", image: "alma.jpg" },
];

const IngredientsModal = ({ isOpen, onClose, onAdd }) => {
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const handleQuantityChange = (ingredientName, value) => {
    // Ha a mező üres volt és most kap először értéket, vagy
    // ha az érték kisebb mint 1, akkor 1-et állítunk be
    if ((!quantities[ingredientName] && value) || Number(value) < 1) {
      setQuantities((prev) => ({
        ...prev,
        [ingredientName]: "1",
      }));
    } else {
      setQuantities((prev) => ({
        ...prev,
        [ingredientName]: value,
      }));
    }
  };

  const handleSubmit = () => {
    const ingredients = ingredientsList
      .filter((ing) => quantities[ing.name])
      .map((ing) => ({
        name: ing.name,
        quantity: quantities[ing.name],
        unit: ing.unit,
        image: ing.image,
      }));

    onAdd(ingredients);
  };

  // Szűrjük a hozzávalókat a keresési kifejezés alapján
  const filteredIngredients = ingredientsList.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-[500px] h-[600px] shadow-xl relative flex flex-col overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="flex-shrink-0 p-6 flex flex-col items-center border-b border-orange-100">
          <img
            src="/mit-egyunk-ma2.png"
            alt="Mit együnk ma?"
            className="w-28 sm:w-40 mb-4"
          />

          <h2 className="text-base sm:text-lg mb-5 text-center px-2">
            Adja meg a rendelkezésre álló hozzávalóit!
          </h2>

          <div className="w-full relative mb-2">
            <input
              type="text"
              placeholder="Hozzávaló keresése..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-orange-200 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-orange-200 
                       focus:border-orange-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredIngredients.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredIngredients.map((ingredient) => (
                <div
                  key={ingredient.name}
                  className="flex items-center justify-between gap-3 px-6 py-2.5"
                >
                  <span className="text-gray-700 text-sm sm:text-base">
                    {ingredient.name} ({ingredient.unit})
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={quantities[ingredient.name] || ""}
                    onChange={(e) =>
                      handleQuantityChange(ingredient.name, e.target.value)
                    }
                    className="w-16 sm:w-20 px-2 py-1.5 
                             border border-orange-200 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-orange-200 
                             focus:border-orange-500"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">
                Nincs találat a keresési feltételeknek megfelelően.
              </p>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 p-6 border-t border-orange-100">
          <button
            className="w-full bg-orange-500 text-white py-3 rounded-lg
                     hover:bg-orange-600 hover:scale-105 transition-all duration-200
                     text-sm sm:text-base font-medium"
            onClick={handleSubmit}
          >
            Hozzáadás
          </button>
        </div>
      </div>
    </div>
  );
};

IngredientsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default IngredientsModal;
