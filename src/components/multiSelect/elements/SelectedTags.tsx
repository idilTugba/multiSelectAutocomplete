import React from "react";
import { CharacterTypo } from "@api/searchCharacters";

interface SelectedTagsType {
  char: CharacterTypo;
  index: number;
  selectedIndex: number;
  handleChange: (char: CharacterTypo) => void;
}

const SelectedTags: React.FC<SelectedTagsType> = ({
  char,
  index,
  selectedIndex,
  handleChange,
}) => {
  return (
    <>
      <span
        tabIndex={-1}
        key={char.id}
        className={`multiSelected__item ${index === selectedIndex ? "selected" : ""}`}
      >
        {char.name}
        <button
          className="multiSelected__button"
          onClick={() => handleChange(char)}
        >
          x
        </button>
      </span>
    </>
  );
};

export default SelectedTags;
