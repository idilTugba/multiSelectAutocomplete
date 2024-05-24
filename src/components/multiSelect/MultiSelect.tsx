import React, { useEffect, useState, KeyboardEvent, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@lib/redux/Hooks";
import {
  fetchCharacters,
  toggleCharacterSelection,
} from "@lib/redux/reducers/characterSlice";
import { CharacterTypo } from "@api/searchCharacters";

const MultiSelect = () => {
  const [dropdownPosition, setDropdownPosition] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const dispatch = useAppDispatch();
  const { searchedCharacters, error, loading, selectedCharacters } =
    useAppSelector((state) => state.characters);

  const handleCheckboxChange = (char: CharacterTypo) => {
    dispatch(toggleCharacterSelection(char));
  };

  useEffect(() => {
    dispatch(fetchCharacters(query));
  }, [dispatch, query]);

  useEffect(() => {
    setDropdownPosition(true);
  }, [searchedCharacters]);

  return (
    <div className="search-section">
      <div className="multiSelected">
        {selectedCharacters.map((char) => (
          <span key={char.id} className="multiSelected__item">
            {char.name}
            <button
              className="multiSelected__button"
              onClick={() => handleCheckboxChange(char)}
            >
              x
            </button>
          </span>
        ))}
        <input
          type="text"
          placeholder="Select Character..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setDropdownPosition(true)}
        />
        <span
          className={`toggleDropdown ${dropdownPosition ? "close" : ""}`}
          onClick={() => setDropdownPosition(!dropdownPosition)}
        >
          +
        </span>
      </div>
      {loading && (
        <div className="loading-container">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif"
            alt="Loading..."
            className="loading-spinner"
          />
        </div>
      )}
      {error && <div className="error">{error}</div>}
      {dropdownPosition && !loading && !error && (
        <ul className="dropdown">
          {searchedCharacters.map((char) => {
            const matches = char.name
              .toLowerCase()
              .includes(query.toLowerCase());
            const highlightedName = char.name.replace(
              new RegExp(query, "gi"),
              (match) => `<strong>${match}</strong>`
            );
            return (
              <li key={char.id}>
                <input
                  type="checkbox"
                  checked={selectedCharacters.some(
                    (option) => option.id === char.id
                  )}
                  onChange={() => handleCheckboxChange(char)}
                />
                <div className="dropdown__item">
                  <img
                    className="dropdown__item__img"
                    src={char.image}
                    alt={char.name}
                  />
                  <div className="dropdown__item__info">
                    <span
                      dangerouslySetInnerHTML={{ __html: highlightedName }}
                    />
                    <div>{char.episode.length} Episodes</div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;
