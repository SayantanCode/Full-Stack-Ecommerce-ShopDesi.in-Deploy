import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Button,
  Slider,
  Rating,
  Radio,
  RadioGroup,
  Skeleton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import { getBrands, getCategories, getProducts } from "../../Redux/Slice/viewSlice";
import { useLocation, useNavigate } from "react-router-dom";

const FiltersDesktop = ({page, limit, filters, setFilters, setPage}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { categories, brands, loading, productsData } = useSelector((state) => state.View);
  const [expanded, setExpanded] = useState("panel-0");
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 100000]);
  const [defaultPriceRange] = useState([0, 100000]);
  const [priceChanged, setPriceChanged] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState({});
  const [sortPrice, setSortPrice] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);
  const buildQueryString = () => {
    let query = {};
  
    let selectedCategories = [];
    let selectedSubCategories = [];
    let selectedBrands = []; // To store selected brands. this needs to be done or else every "brand" will be treated as a value of category
    
    // Add selected categories, subcategories, and brands to the query
    Object.keys(selectedFilters).forEach((filterKey) => {
      const subCategories = Object.keys(selectedFilters[filterKey]).filter(
        (subCategory) => selectedFilters[filterKey][subCategory]
      );
      
      if (subCategories.length > 0) {
        if (filterKey === "Brand") {
          // If the filterKey is "Brand", treat them as brands
          selectedBrands.push(...subCategories);
        } else {
          // Otherwise, treat as categories and subcategories
          selectedCategories.push(filterKey);
          selectedSubCategories.push(...subCategories);
        }
      }
    });
  
    if (selectedCategories.length > 0) {
      query.category = selectedCategories.join(","); // Add categories like 'Fashion, Electronics'
    }
  
    if (selectedSubCategories.length > 0) {
      query.subCategory = selectedSubCategories.join(","); // Add subcategories like 'Mens, Womens, Microwaves'
    }
  
    if (selectedBrands.length > 0) {
      query.brand = selectedBrands.join(","); // Add brands to the query
    }
  
    // Add selected rating to the query
    if (selectedRating) {
      query.rating = selectedRating;
    }
  
    // Add price range to the query
    if (priceChanged) {
      query.range = selectedPriceRange[0] + "-" + selectedPriceRange[1];
    }
  
    // Add sort by price to the query
    if (sortPrice) {
      query.sort = "sellingPrice";
      query.order = sortPrice === "low-to-high" ? "asc" : "desc";
    }
  
    return query;
  };
  useEffect(() => {
    setPage(1);
  },[location.search, selectedFilters, selectedRating, selectedPriceRange, sortPrice]);

  useEffect(() => {
    const query = buildQueryString();
    // console.log(query);
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category");
    const search = queryParams.get("search");
    if(search) {
      query.search = search;
      navigate(`/products?search=${encodeURIComponent(search)}`);
    }
    if(Object.keys(selectedFilters).length===0) {
      
    if(category) {
      if(!query.category) {
        query.category = category;
      }
    }
   
  }
  console.log(selectedFilters,"selectedFilters")
  console.log(query, "query");
    dispatch(getProducts({ ...query, page: page, limit: limit }));
    setFilters(true)
  }, [selectedFilters, selectedRating, selectedPriceRange, sortPrice, page, limit, location.search]);
  

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getBrands());
  }, []);

  
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleFilterChange = (category, subCategory) => (event) => {
    setSelectedFilters((prevState) => {
      const newState = { ...prevState };
      if (!newState[category]) {
        newState[category] = {};
      }
      newState[category][subCategory] = event.target.checked;
      return newState;
    });
  };

  const handleSelectAllToggle = (category) => {
    setIsSelectAll((prevState) => {
      const newState = { ...prevState, [category]: !prevState[category] };
      const allSelected = newState[category];

      setSelectedFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters };
        updatedFilters[category] = {};
        categories
          .find((cat) => cat.name === category)
          .subCategories.forEach((subCategory) => {
            updatedFilters[category][subCategory.name] = allSelected;
          });
        return updatedFilters;
      });

      return newState;
    });
  };

  const handleRatingChange = (event) => {
    setSelectedRating(event.target.value);
  };

  const handlePriceChange = (event, newValue) => {
    setSelectedPriceRange(newValue);
    setPriceChanged(
      newValue[0] !== defaultPriceRange[0] || newValue[1] !== defaultPriceRange[1]
    );
  };

  const handleSortPriceChange = (event) => {
    setSortPrice(event.target.value);
  };

  const handleClearFilter = () => {
    console.log("Filters cleared!");
    setSelectedFilters({});
    setSelectedPriceRange(defaultPriceRange);
    setIsSelectAll({});
    setPriceChanged(false);
    setSelectedRating("");
    setSortPrice("");
    navigate("/products");
    // console.log("Filters cleared!");
  };
  useEffect(() => {
    if(filters===false){
      handleClearFilter();
    }
  },[filters])
  const isFilterChanged = () => {
    return (
      priceChanged ||
      sortPrice ||
      selectedRating ||
      Object.values(selectedFilters).some((subFilters) =>
        Object.values(subFilters).some((isSelected) => isSelected)
      )
    );
  };
  const toggleShowAllBrands = () => {
    setShowAllBrands(!showAllBrands);
  };
  return (
    <Box sx={{ pl: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, mt: 1 }}>
        Filter By Categories:
      </Typography>
      {loading ? (
        <Skeleton variant="rectangular" height={200} />
      ) : (
        categories.map((category, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel-${index}`}
            onChange={handleAccordionChange(`panel-${index}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${index}a-content`}
              id={`panel-${index}a-header`}
            >
              <Typography variant="body">{category.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Button
                onClick={() => handleSelectAllToggle(category.name)}
                sx={{ display: "block", mb: 1, color: "secondary.main" }}
                disabled={new URLSearchParams(location.search).get("search")?true:false}
              >
                {isSelectAll[category.name] ? "Deselect All" : "Select All"}
              </Button>
              {category.subCategories.map((subCategory) => (
                <FormControlLabel
                  key={subCategory._id}
                  control={
                    <Checkbox
                      color="secondary"
                      checked={
                        selectedFilters[category.name]?.[subCategory.name] || false
                      }
                      onChange={handleFilterChange(category.name, subCategory.name)}
                      disabled={new URLSearchParams(location.search).get("search")?true:false}
                    />
                  }
                  label={subCategory.name}
                  sx={{ display: "block", mt: 1 }}
                />
              ))}
            </AccordionDetails>
          </Accordion>
        ))
      )}

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Filter By Brand:
      </Typography>
      {loading ? (
        <Skeleton variant="rectangular" height={100} />
      ) : (
        <>
        {brands
            .slice(0, showAllBrands ? brands.length : 5) // Limit to 5 brands unless "Show All" is active
            .map((brand) => (
              <FormControlLabel
                key={brand._id}
                control={
                  <Checkbox
                    color="secondary"
                    checked={selectedFilters["Brand"]?.[brand.name] || false}
                    onChange={handleFilterChange("Brand", brand.name)}
                    disabled={new URLSearchParams(location.search).get("search")?true:false}
                  />
                }
                label={brand.name}
                sx={{ display: "block", mt: 1 }}
              />
            ))}
          <Button
            onClick={toggleShowAllBrands}
            sx={{ display: "block", mt: 1, color: "secondary.main" }}
          >
            {showAllBrands ? "Show Less" : "Show All"}
          </Button>
        </>
      )}

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Filter By Rating:
      </Typography>
      {loading ? (
        <Skeleton variant="rectangular" height={100} />
      ) : (
        <RadioGroup value={selectedRating} onChange={handleRatingChange}>
          {[4, 3, 2, 1].map((rating) => (
            <FormControlLabel
              key={rating}
              value={rating}
              control={<Radio color="secondary" />}
              label={
                <Box display="flex" alignItems="center">
                  <Rating value={rating} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    & Up
                  </Typography>
                </Box>
              }
              disabled={new URLSearchParams(location.search).get("search")?true:false}
            />
          ))}
        </RadioGroup>
      )}

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Sort By Price:
      </Typography>
      {loading ? (
        <Skeleton variant="rectangular" height={100} />
      ) : (
        <RadioGroup
          aria-label="sort-price"
          name="sort-price"
          value={sortPrice}
          onChange={handleSortPriceChange}
        >
          <FormControlLabel
            value="low-to-high"
            control={<Radio color="secondary" />}
            label="Low to High"
            disabled={new URLSearchParams(location.search).get("search")?true:false}
          />
          <FormControlLabel
            value="high-to-low"
            control={<Radio color="secondary" />}
            label="High to Low"
            disabled={new URLSearchParams(location.search).get("search")?true:false}
          />
        </RadioGroup>
      )}

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Filter By Price:
      </Typography>
      {loading ? (
        <Skeleton variant="rectangular" height={50} />
      ) : (
        <Box p={1.5}>
          <Slider
            value={selectedPriceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            max={100000}
            sx={{ width: "100%", mb: 2, color: "secondary.main" }}
            disabled={new URLSearchParams(location.search).get("search")?true:false}
          />
          <Typography variant="body2">
            ₹{selectedPriceRange[0]} - ₹{selectedPriceRange[1]}
          </Typography>
        </Box>
      )}

      <Box
        display="flex"
        justifyContent="center"
        sx={{ backgroundColor: "background.paper", p: 2, mt: 3 }}
      >
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClearFilter}
          disabled={!isFilterChanged()}
        >
          Clear Filter
        </Button>
      </Box>
    </Box>
  );
};

export default FiltersDesktop;
