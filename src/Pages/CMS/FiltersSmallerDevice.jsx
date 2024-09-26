import React, { useState, useEffect } from 'react';
import {
  SwipeableDrawer,
  Box,
  Typography,
  IconButton,
  Slider,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Rating,
  Radio,
  RadioGroup,
} from '@mui/material';
import CloseSharp from '@mui/icons-material/CloseSharp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { getBrands, getCategories, getProducts } from "../../Redux/Slice/viewSlice";
import { useNavigate, useLocation } from 'react-router-dom';

const FilterDrawer = ({ filterDrawerOpen, handleFilterDrawerClose, handleFilterDrawerToggle, page, setPage, filters, setFilters, limit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { categories, brands, loading } = useSelector((state) => state.View);

  // Local state for managing filter selections
  const [expanded, setExpanded] = useState('panel1');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 100000]);
  const [defaultPriceRange] = useState([0, 100000]);
  const [priceChanged, setPriceChanged] = useState(false);
  const [sortPrice, setSortPrice] = useState("");
  const [isSelectAll, setIsSelectAll] = useState({});
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Query Builder - Similar to FiltersDesktop
  const buildQueryString = () => {
    let query = {};
    let selectedCategories = [];
    let selectedSubCategories = [];
    let selectedBrands = [];

    Object.keys(selectedFilters).forEach((filterKey) => {
      const subCategories = Object.keys(selectedFilters[filterKey]).filter(
        (subCategory) => selectedFilters[filterKey][subCategory]
      );
      
      if (subCategories.length > 0) {
        if (filterKey === "Brand") {
          selectedBrands.push(...subCategories);
        } else {
          selectedCategories.push(filterKey);
          selectedSubCategories.push(...subCategories);
        }
      }
    });

    if (selectedCategories.length > 0) {
      query.category = selectedCategories.join(",");
    }

    if (selectedSubCategories.length > 0) {
      query.subCategory = selectedSubCategories.join(",");
    }

    if (selectedBrands.length > 0) {
      query.brand = selectedBrands.join(",");
    }

    if (selectedRating) {
      query.rating = selectedRating;
    }

    if (priceChanged) {
      query.range = selectedPriceRange[0] + "-" + selectedPriceRange[1];
    }

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
    console.log(query);
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
      // query.category = [query.category, category].join(",");
    }
   
  }
    // navigate(`/products?${new URLSearchParams(query).toString()}`);
    
    dispatch(getProducts({ ...query, page: page, limit: limit }));
    setFilters(true)
    // navigate(`/products?${new URLSearchParams(query).toString()}`);
  }, [selectedFilters, selectedRating, selectedPriceRange, sortPrice, page, limit, location.search]);

  // Fetch categories and brands
  useEffect(() => {
    dispatch(getCategories());
    dispatch(getBrands());
  }, [dispatch]);

  // Handle accordion changes
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Handle filter selections
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

  // Handle "Select All" toggle for a category
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
    setSelectedFilters({});
    setSelectedPriceRange(defaultPriceRange);
    setIsSelectAll({});
    setPriceChanged(false);
    setSelectedRating(null);
    setSortPrice("");
    navigate("/products");
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
    <SwipeableDrawer
      anchor="bottom"
      open={filterDrawerOpen}
      onClose={handleFilterDrawerClose}
      onOpen={handleFilterDrawerToggle}
    >
      <Box sx={{ width: "100%", p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={handleFilterDrawerClose}>
            <CloseSharp />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Filter by Categories */}
        <Typography variant="h6" sx={{ mb: 2 }}>Filter By Categories:</Typography>
        {loading ? (
          <Typography>Loading...</Typography>
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
                <Typography>{category.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Button
                  onClick={() => handleSelectAllToggle(category.name)}
                  sx={{ display: 'block', mb: 1, color: 'secondary.main' }}
                >
                  {isSelectAll[category.name] ? 'Deselect All' : 'Select All'}
                </Button>
                {category.subCategories.map((subCategory) => (
                  <FormControlLabel
                    key={subCategory._id}
                    control={
                      <Checkbox
                        color="secondary"
                        checked={selectedFilters[category.name]?.[subCategory.name] || false}
                        onChange={handleFilterChange(category.name, subCategory.name)}
                      />
                    }
                    label={subCategory.name}
                    sx={{ display: 'block', mt: 1 }}
                  />
                ))}
              </AccordionDetails>
            </Accordion>
          ))
        )}

        {/* Filter by Brands */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Filter By Brand:</Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            {brands
              .slice(0, showAllBrands ? brands.length : 5)
              .map((brand) => (
                <FormControlLabel
                  key={brand._id}
                  control={
                    <Checkbox
                      color="secondary"
                      checked={selectedFilters["Brand"]?.[brand.name] || false}
                      onChange={handleFilterChange("Brand", brand.name)}
                    />
                  }
                  label={brand.name}
                  sx={{ display: 'block', mt: 1 }}
                />
              ))}
            <Button
              onClick={toggleShowAllBrands}
              sx={{ display: 'block', mt: 1, color: 'secondary.main' }}
            >
              {showAllBrands ? 'Show Less' : 'Show All'}
            </Button>
          </>
        )}

        {/* Filter by Rating */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Filter By Rating:</Typography>
        <RadioGroup value={selectedRating} onChange={handleRatingChange}>
          {[4, 3, 2, 1].map((rating) => (
            <FormControlLabel
              key={rating}
              value={rating}
              control={<Radio color="secondary" />}
              label={
                <Box display="flex" alignItems="center">
                  <Rating value={rating} readOnly />
                  <Typography sx={{ ml: 1 }}>& Up</Typography>
                </Box>
              }
            />
          ))}
        </RadioGroup>

        {/* Filter by Price */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Price:</Typography>
        <Slider
          value={selectedPriceRange}
          onChange={handlePriceChange}
          min={defaultPriceRange[0]}
          max={defaultPriceRange[1]}
          valueLabelDisplay="auto"
          color="secondary"
        />

        {/* Sort by Price */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Sort By Price:</Typography>
        <RadioGroup value={sortPrice} onChange={handleSortPriceChange}>
          <FormControlLabel
            value="low-to-high"
            control={<Radio color="secondary" />}
            label="Low to High"
          />
          <FormControlLabel
            value="high-to-low"
            control={<Radio color="secondary" />}
            label="High to Low"
          />
        </RadioGroup>

        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleClearFilter}
            disabled={!isFilterChanged()}
          >
            Clear Filters
          </Button>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default FilterDrawer;
