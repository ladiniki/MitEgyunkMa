/* eslint-disable react/prop-types */
const RecipieCard = ({ name, cookingTime, image }) => {
  return (
    <div className="rounded-3xl bg-light-secondary h-72 flex flex-col justify-between">
      <div className="relative w-full h-40 overflow-hidden rounded-tl-2xl rounded-tr-2xl">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="mt-2 flex flex-col justify-between h-28">
        <span className="font-bold block">{name}</span>
        <span className="text-sm text-light-accent">{cookingTime} perc</span>
      </div>
    </div>
  );
};

export default RecipieCard;
