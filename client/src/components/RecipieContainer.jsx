// TODO: refactor this in the future
import RecipieCard from "./RecipieCard";
import TükörtojásImg from "../assets/tükörtojás.jpg";
import GofriImg from "../assets/gofri.jpg";
import KrumpliImg from "../assets/krumpli.jpg";
import KukoricaImg from "../assets/kukorica.jpg";
import CsokitortaImg from "../assets/csokitorta.jpeg";

const RecipieContainer = () => {
  const recipies = [
    { name: "Tükörtojás", cookingTime: 10, image: TükörtojásImg },
    { name: "Gofri", cookingTime: 20, image: GofriImg },
    { name: "Krumpli", cookingTime: 30, image: KrumpliImg },
    { name: "Kukorica", cookingTime: 15, image: KukoricaImg },
    { name: "Csokitorta", cookingTime: 45, image: CsokitortaImg },
    { name: "Kukorica", cookingTime: 15, image: KukoricaImg },
    { name: "Csokitorta", cookingTime: 45, image: CsokitortaImg },
    { name: "Kukorica", cookingTime: 15, image: KukoricaImg },
    { name: "Csokitorta", cookingTime: 45, image: CsokitortaImg },
    { name: "Kukorica", cookingTime: 15, image: KukoricaImg },
    { name: "Csokitorta", cookingTime: 45, image: CsokitortaImg },
    { name: "Kukorica", cookingTime: 15, image: KukoricaImg },
  ];

  return (
    <div className="m-4">
      <div className="gap-4 grid grid-cols-4 mt-4 mb-4 h-[85vh] overflow-y-auto">
        {recipies.map((recipe, index) => (
          <RecipieCard
            key={index}
            name={recipe.name}
            cookingTime={recipe.cookingTime}
            image={recipe.image}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipieContainer;
