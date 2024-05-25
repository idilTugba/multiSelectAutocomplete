import { CharacterTypo } from "@api/searchCharacters";
import { KeyboardEvent, MutableRefObject } from "react";

interface HandleKeyDownTypo {
  event: KeyboardEvent<HTMLDivElement | null>;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  dropdownRef: MutableRefObject<HTMLUListElement | null>;
  selectedCharacters: CharacterTypo[];
  searchedCharacters: CharacterTypo[];
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  dropdownIndex: number;
  setDropdownIndex: React.Dispatch<React.SetStateAction<number>>;
  handleCheckbox: (char: CharacterTypo) => void;
}

export const HandleKeyDown = ({
  event,
  inputRef,
  dropdownRef,
  searchedCharacters,
  selectedCharacters,
  selectedIndex,
  setSelectedIndex,
  dropdownIndex,
  setDropdownIndex,
  handleCheckbox,
}: HandleKeyDownTypo) => {
  if (event.target === inputRef.current) {
    HandleInputKeyDown(selectedCharacters, event, setSelectedIndex);
  } else if (event.target !== dropdownRef.current) {
    HandleSelectedTagsKeyDown(
      event,
      inputRef,
      selectedCharacters,
      selectedIndex,
      setSelectedIndex,
      handleCheckbox
    );
  }
  if (
    event.target === dropdownRef.current &&
    dropdownRef.current.contains(event.target as Node)
  ) {
    HandleDropdownKeyDown(
      event,
      dropdownRef,
      searchedCharacters,
      dropdownIndex,
      setDropdownIndex,
      handleCheckbox
    );
  }
};

const HandleInputKeyDown = (
  selectedCharacters: CharacterTypo[],
  event: KeyboardEvent<HTMLDivElement | null>,
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  if (event.key === "ArrowRight" && selectedCharacters.length > 0) {
    setSelectedIndex(0);
  } else if (event.key === "ArrowLeft" && selectedCharacters.length > 0) {
    setSelectedIndex(selectedCharacters.length - 1);
  }
};

const HandleSelectedTagsKeyDown = (
  event: KeyboardEvent<HTMLDivElement | null>,
  inputRef: MutableRefObject<HTMLInputElement | null>,
  selectedCharacters: CharacterTypo[],
  selectedIndex: number,
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>,
  handleCheckbox: (char: CharacterTypo) => void
) => {
  switch (event.key) {
    case "ArrowRight":
      if (selectedIndex < selectedCharacters.length - 1) {
        setSelectedIndex((prevIndex) => prevIndex + 1);
      } else if (selectedIndex === selectedCharacters.length - 1) {
        setSelectedIndex(-1);
        inputRef.current?.focus();
      }
      break;
    case "ArrowLeft":
      if (selectedIndex >= 0) {
        if (selectedIndex === 0) {
          setSelectedIndex(-1);
          inputRef.current?.focus();
        } else {
          setSelectedIndex((prevIndex) => prevIndex - 1);
        }
      }
      break;
    case "Backspace":
      if (selectedIndex >= 0 && selectedIndex < selectedCharacters.length) {
        handleCheckbox(selectedCharacters[selectedIndex]);
        setSelectedIndex((prevIndex) =>
          prevIndex === selectedCharacters.length - 1
            ? prevIndex - 1
            : prevIndex
        );
      }
      break;
  }
};

const HandleDropdownKeyDown = (
  event: KeyboardEvent<HTMLDivElement | null>,
  dropdownRef: MutableRefObject<HTMLUListElement | null>,
  searchedCharacters: CharacterTypo[],
  dropdownIndex: number,
  setDropdownIndex: React.Dispatch<React.SetStateAction<number>>,
  handleCheckbox: (char: CharacterTypo) => void
) => {
  if (dropdownRef.current) {
    const dropdownItems = dropdownRef.current.querySelectorAll("li");
    switch (event.key) {
      case "ArrowDown":
        if (dropdownIndex < dropdownItems.length - 1) {
          setDropdownIndex((prevIndex) => prevIndex + 1);
        }
        break;
      case "ArrowUp":
        if (dropdownIndex > 0) {
          setDropdownIndex((prevIndex) => prevIndex - 1);
        }
        break;
      case "Enter":
        if (dropdownIndex < dropdownItems.length) {
          const charId = dropdownItems[dropdownIndex].getAttribute("data-id");
          if (charId) {
            const char = searchedCharacters.find(
              (item) => item.id.toString() === charId
            );
            if (char) {
              handleCheckbox(char);
            }
          }
        }
        break;
    }
  }
};
