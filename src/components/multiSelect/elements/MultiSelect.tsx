import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  KeyboardEvent,
} from "react";
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
import { HandleKeyDown } from "./handleKeyDown";
import useDebounce from "@hooks/Debounce";

const MultiSelect = () => {
  const dispatch = useAppDispatch();
  const { searchedCharacters, error, loading, selectedCharacters, query } =
    useAppSelector((state) => state.characters);

  const handleCheckbox = useCallback(
    (char: CharacterTypo) => {
      dispatch(toggleCharacterSelection(char));
    },
    [dispatch]
  );

  const debouncedFetchCharacters = useDebounce((query) => {
    dispatch(fetchCharacters(query));
  }, 300); // 300 ms delay

  useEffect(() => {
    debouncedFetchCharacters(query);
  }, [dispatch, query]);

  //Elements to navigation with keyboard
  const [dropdownPosition, setDropdownPosition] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [dropdownIndex, setDropdownIndex] = useState<number>(-1);
  const selectedTagsRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLUListElement | null>(null);

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

  // function t navigation with keyboard
  const memoizedHandleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      HandleKeyDown({
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
      });
    },
    [
      inputRef,
      dropdownRef,
      searchedCharacters,
      selectedCharacters,
      selectedIndex,
      dropdownIndex,
      handleCheckbox,
    ]
  );

  return (
    <div className="search-section" onKeyDown={memoizedHandleKeyDown}>
      <div tabIndex={1} className="multiSelected" ref={selectedTagsRef}>
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
          tabIndex={-1}
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
        <ul tabIndex={0} className="dropdown" ref={dropdownRef}>
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
