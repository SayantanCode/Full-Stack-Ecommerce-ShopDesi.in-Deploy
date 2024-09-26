import React, { useState, useEffect, useMemo } from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { getProducts, getSuggestions } from "../../Redux/Slice/viewSlice"; 
import Fuse from "fuse.js";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.50),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.60),
  },
  color: "black",
  margin: "auto",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "30ch",
    },
  },
}));

const Highlight = styled("span")(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: "bold",
}));

const CustomSearchBar = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { searchSuggestion, loading } = useSelector((state) => state.View);

  // Load product suggestions initially
  useEffect(() => {
    dispatch(getSuggestions());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && searchSuggestion && searchSuggestion !== suggestions) {
      setSuggestions(searchSuggestion);
    }
  }, [searchSuggestion, loading, suggestions]);

  // Memoize Fuse.js instance to avoid unnecessary re-renders
  const fuse = useMemo(() => {
    return new Fuse(suggestions, {
      keys: ["name"],
      threshold: 0.4,
    });
  }, [suggestions]);

  useEffect(() => {
    if (inputValue) {
      const result = fuse.search(inputValue).slice(0, 6);
      setFilteredSuggestions(result.map(({ item }) => item));
    } else {
      setFilteredSuggestions([]);
    }
  }, [inputValue, fuse]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleClearInput = () => {
    setInputValue("");
    setFilteredSuggestions([]);
  };

  const handleSuggestionClick = (name) => {
    setInputValue(name);
    // dispatch(getProducts({ search: name }));
    navigate(`/products?search=${encodeURIComponent(name)}`);
    setFilteredSuggestions([]);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // dispatch(getProducts({ search: inputValue }));
      navigate(`/products?search=${encodeURIComponent(inputValue)}`);
      setFilteredSuggestions([]);
    }
  };

  const getHighlightedText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <Highlight key={index}>{part}</Highlight>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      {inputValue && (
        <ClearIcon
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            right: theme.spacing(1),
            cursor: "pointer",
          }}
          onClick={handleClearInput}
        />
      )}

      {/* Fuzzy Search Suggestions */}
      {inputValue && filteredSuggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: theme.palette.background.paper,
            border: "1px solid #ccc",
            color: theme.palette.text.primary,
            zIndex: 1,
          }}
        >
          {filteredSuggestions.map((name, index) => (
            <Typography
              key={index}
              style={{ padding: theme.spacing(1), cursor: "pointer" }}
              onClick={() => handleSuggestionClick(name.name)}
            >
              {getHighlightedText(name.name, inputValue)}
            </Typography>
          ))}
        </div>
      )}
    </Search>
  );
};

export default CustomSearchBar;
