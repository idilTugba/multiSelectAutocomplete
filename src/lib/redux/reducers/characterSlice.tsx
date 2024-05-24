import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { searchCharacters, CharacterTypo } from "@api/searchCharacters";

interface CharacterState {
  searchedCharacters: CharacterTypo[];
  selectedCharacters: CharacterTypo[];
  loading: boolean;
  query: string;
  error: string | null;
}

const initialState: CharacterState = {
  searchedCharacters: [],
  selectedCharacters: [],
  query: "",
  loading: false,
  error: null,
};

//fake delay for show loading :)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchCharacters = createAsyncThunk(
  "characters/fetchCharacters",
  async (name: string, { rejectWithValue }) => {
    try {
      await delay(300);
      const characters = await searchCharacters(name);
      return characters;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const characterSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    toggleCharacterSelection: (state, action: PayloadAction<CharacterTypo>) => {
      const isSelected = state.selectedCharacters.some(
        (char) => char.id === action.payload.id
      );
      if (isSelected) {
        state.selectedCharacters = state.selectedCharacters.filter(
          (char) => char.id !== action.payload.id
        );
      } else {
        state.selectedCharacters.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false;
        state.searchedCharacters = action.payload;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { toggleCharacterSelection, setQuery } = characterSlice.actions;
export default characterSlice.reducer;
