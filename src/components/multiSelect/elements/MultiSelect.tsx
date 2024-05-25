import React, { useEffect, useState, KeyboardEvent, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@lib/redux/Hooks";

import {
  fetchCharacters,
  setQuery,
  toggleCharacterSelection,
} from "@lib/redux/reducers/characterSlice";
import { CharacterTypo } from "@api/searchCharacters";
import LoadingSpinner from "@components/loading";
import DropdownItem from "./dropdownItem";
import SelectedTags from "./SelectedTags";

const MultiSelect = () => {
  //Data from Redux State
  const dispatch = useAppDispatch();
  const { searchedCharacters, error, loading, selectedCharacters, query } =
    useAppSelector((state) => state.characters);

  const handleCheckbox = (char: CharacterTypo) => {
    dispatch(toggleCharacterSelection(char));
  };

  useEffect(() => {
    dispatch(fetchCharacters(query));
  }, [dispatch, query]);

  //Open & Close Position For Dropdown
  const [dropdownPosition, setDropdownPosition] = useState<boolean>(false);

  useEffect(() => {
    // setDropdownPosition(true);
  }, [searchedCharacters]);

  // Handle keyword elements
  // we use the lenght of selected Tags to find current tag & Search Input
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [dropdownIndex, setDropdownIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // console.log(event.key);
    // Navigate over with left right to multi select and search area
    // if on the input
    if (event.target === inputRef.current) {
      // go to first selected tag if we push the right from input
      if (event.key === "ArrowRight" && selectedCharacters.length > 0) {
        setSelectedIndex(0);
        // go to last selected tag if we push the left from input
      } else if (event.key === "ArrowLeft" && selectedCharacters.length > 0) {
        setSelectedIndex(selectedCharacters.length - 1);
      }
    } else {
      // if on the selected tags
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
    }

    if (event.target === dropdownRef.current) {
      console.log("dropdown area");
      const dropdownItems = dropdownRef.current.querySelectorAll("li");
      switch (event.key) {
        // navigation with top & bottom arrow to dropdown area
        case "ArrowDown":
          if (dropdownIndex < dropdownItems.length - 1) {
            console.log(dropdownIndex);
            console.log(dropdownRef.current.children[dropdownIndex]);
            setDropdownIndex((prevIndex) => prevIndex + 1);
          }
          break;
        case "ArrowUp":
          if (dropdownIndex > 0) {
            setDropdownIndex((prevIndex) => prevIndex - 1);
          }
          break;
        case "Enter":
          console.log("Enter");
          if (dropdownIndex < dropdownItems.length) {
            const charId = dropdownItems[dropdownIndex].getAttribute("data-id");
            console.log(charId);
            console.log(searchedCharacters);
            const char = searchedCharacters.find((item) => item.id === charId);
            console.log(char);
            if (char) {
              handleCheckbox(char);
            }
          }
          break;
      }
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0) {
      const chipElement = document.querySelectorAll(".multiSelected__item")[
        selectedIndex
      ] as HTMLElement;
      chipElement?.focus();
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (dropdownRef.current && dropdownIndex >= 0) {
      const selectedItem = dropdownRef.current.children[
        dropdownIndex
      ] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [dropdownIndex]);

  return (
    <div className="search-section" onKeyDown={handleKeyDown}>
      <div tabIndex={1} className="multiSelected">
        {selectedCharacters.map((char, index) => (
          <SelectedTags
            index={index}
            selectedIndex={selectedIndex}
            key={char.id}
            char={char}
            handleChange={handleCheckbox}
          />
        ))}
        <input
          type="text"
          placeholder="Search Character..."
          value={query}
          ref={inputRef}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          onFocus={() => setDropdownPosition(true)}
        />
        <span
          className={`toggleDropdown ${dropdownPosition ? "close" : ""}`}
          onClick={() => setDropdownPosition(!dropdownPosition)}
        >
          +
        </span>
      </div>
      {error && <div className="error">{error}</div>}
      {dropdownPosition && !error && (
        <ul tabIndex={2} className="dropdown" ref={dropdownRef}>
          {loading && <LoadingSpinner />}
          {searchedCharacters.map((char, index) => {
            return (
              <DropdownItem
                key={char.id}
                index={index}
                dropdownIndex={dropdownIndex}
                char={char}
                handleChange={handleCheckbox}
                isSelected={selectedCharacters.some(
                  (item) => item.id === char.id
                )}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;
