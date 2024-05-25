import React, { memo } from "react";
import { CharacterTypo } from "@api/searchCharacters";
import { useAppSelector } from "@lib/redux/Hooks";

interface DropdownItemType {
  char: CharacterTypo;
  index: number;
  dropdownIndex: number;
  handleChange: (char: CharacterTypo) => void;
  isSelected: boolean;
}

const DropdownItem: React.FC<DropdownItemType> = ({
  char,
  index,
  dropdownIndex,
  handleChange,
  isSelected,
}) => {
  const { query } = useAppSelector((state) => state.characters);
  const highlightedName = char.name.replace(
    new RegExp(query, "gi"),
    (match) => `<strong>${match}</strong>`
  );
  return (
    <li
      className={`${dropdownIndex === index ? "selected" : ""}`}
      tabIndex={-1}
      data-id={char.id}
      key={char.id}
    >
      <input
        tabIndex={-1}
        type="checkbox"
        checked={isSelected}
        onChange={() => handleChange(char)}
      />
      <div className="dropdown__item">
        <img className="dropdown__item__img" src={char.image} alt={char.name} />
        <div className="dropdown__item__info">
          <span dangerouslySetInnerHTML={{ __html: highlightedName }} />
          <div>{char.episode.length} Episodes</div>
        </div>
      </div>
    </li>
  );
};

export default memo(DropdownItem);
