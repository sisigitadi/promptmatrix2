import { useState, useMemo, useEffect, useCallback } from "react";
import {
  PROMPT_FRAMEWORKS,
  Framework,
  PromptFrameworksType,
  FrameworkComponent,
} from "../data/frameworks";
import { FormData } from "../types";

export function useFrameworkNavigation(
  dispatch: (action: { type: string; payload?: any }) => void,
) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(
    null,
  );
  const [openSubcategories, setOpenSubcategories] = useState<{
    [key: string]: boolean;
  }>({});
  const [manualOpenSubcategories, setManualOpenSubcategories] = useState<{
    [key: string]: boolean;
  }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [toolTypeFilter, setToolTypeFilter] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const allFrameworksFlattened = useMemo(() => {
    const flattened: (Framework & {
      category: string;
      subcategory: string;
      name: string;
    })[] = [];
    Object.entries(PROMPT_FRAMEWORKS).forEach(
      ([categoryName, subcategories]) => {
        if (subcategories) {
          Object.entries(subcategories).forEach(
            ([subcategoryName, frameworks]) => {
              if (frameworks) {
                Object.entries(frameworks).forEach(
                  ([frameworkName, framework]) => {
                    flattened.push({
                      ...framework,
                      category: categoryName,
                      subcategory: subcategoryName,
                      name: frameworkName,
                    });
                  },
                );
              }
            },
          );
        }
      },
    );
    return flattened;
  }, []);

  const findFrameworkInAllCategories = useCallback(
    (
      frameworkName: string,
    ): {
      framework: Framework;
      category: string;
      subcategory: string;
    } | null => {
      const found = allFrameworksFlattened.find(
        (f) => f.name === frameworkName,
      );
      if (found) {
        const { category, subcategory, ...framework } = found;
        return { framework: framework as Framework, category, subcategory };
      }
      return null;
    },
    [allFrameworksFlattened],
  );

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
    setSelectedFramework(null);
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setToolTypeFilter("");
    setOpenSubcategories({}); // Collapse all subcategories
    setManualOpenSubcategories({}); // Clear manual toggles
  }, []);

  const handleFrameworkSelect = useCallback(
    (
      frameworkName: string,
      categoryNameFromSearch?: string,
      subcategoryNameFromSearch?: string,
    ) => {
      let frameworkDetails: {
        framework: Framework;
        category: string;
        subcategory: string;
      } | null = null;

      if (categoryNameFromSearch && subcategoryNameFromSearch) {
        frameworkDetails = {
          framework:
            PROMPT_FRAMEWORKS[categoryNameFromSearch][
              subcategoryNameFromSearch
            ][frameworkName],
          category: categoryNameFromSearch,
          subcategory: subcategoryNameFromSearch,
        };
      } else {
        frameworkDetails = findFrameworkInAllCategories(frameworkName);
      }

      if (!frameworkDetails) return;

      setSelectedCategory(frameworkDetails.category);
      setSelectedFramework(frameworkName);

      // Reset search and filters to ensure a clean state
      setSearchQuery("");
      setDebouncedSearchQuery("");
      setToolTypeFilter("");

      // Explicitly open only the selected subcategory
      setManualOpenSubcategories({
        [frameworkDetails.subcategory]: true,
      });

      const initialFormData: FormData = {};
      const inputs: [string, FrameworkComponent][] =
        frameworkDetails.framework.components?.map((c) => [c.name, c]) || []; // Add null check for components

      for (const [name, details] of inputs) {
        const compDetails = details as any;
        if (compDetails.default !== undefined && compDetails.default !== null) {
          initialFormData[name] = compDetails.default;
        } else if (compDetails.type === "select") {
          // MODIFIKASI: Jangan otomatis pilih opsi pertama. Biarkan kosong agar user memilih sendiri.
          // Kecuali ada default value yang spesifik di definisinya.
          initialFormData[name] = "";
        } else {
          initialFormData[name] = "";
        }
      }

      dispatch({
        type: "SET_FORM_DATA",
        payload: { formData: initialFormData },
      });
    },
    [dispatch, findFrameworkInAllCategories],
  );

  // Effect to read from URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    const frameworkParam = params.get("framework");

    if (frameworkParam) {
      handleFrameworkSelect(frameworkParam);
    } else if (categoryParam) {
      handleCategorySelect(categoryParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on initial mount

  // Effect to update URL when selection changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedFramework) {
      params.set("framework", selectedFramework);
    } else if (selectedCategory) {
      params.set("category", selectedCategory);
    }

    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    if (window.location.search !== (queryString ? `?${queryString}` : "")) {
      history.pushState({}, "", newUrl);
    }
  }, [selectedCategory, selectedFramework]);

  const filteredFrameworks = useMemo(() => {
    setIsLoading(true);
    const result: PromptFrameworksType = {};
    const searchTerm = debouncedSearchQuery.toLowerCase();
    const hasActiveFilter = debouncedSearchQuery || toolTypeFilter;

    if (!selectedCategory && !hasActiveFilter) {
      setIsLoading(false);
      return {};
    }

    if (selectedCategory && !hasActiveFilter) {
      if (PROMPT_FRAMEWORKS[selectedCategory]) {
        result[selectedCategory] = JSON.parse(
          JSON.stringify(PROMPT_FRAMEWORKS[selectedCategory]),
        );
      }
    } else {
      allFrameworksFlattened.forEach((framework) => {
        const categoryName = framework.category;
        const subcategoryName = framework.subcategory;
        const frameworkName = framework.name;
        const isCategorySelectedMatch =
          !selectedCategory || categoryName === selectedCategory;
        const searchMatch =
          frameworkName.toLowerCase().includes(searchTerm) ||
          (framework.id_kerangka &&
            framework.id_kerangka.toLowerCase().includes(searchTerm)) ||
          (framework.nama_kerangka &&
            framework.nama_kerangka.toLowerCase().includes(searchTerm)) ||
          framework.description.toLowerCase().includes(searchTerm);
        const toolTypeMatch =
          !toolTypeFilter || framework.toolType === toolTypeFilter;

        if (isCategorySelectedMatch && searchMatch && toolTypeMatch) {
          if (!result[categoryName]) result[categoryName] = {};
          if (!result[categoryName][subcategoryName])
            result[categoryName][subcategoryName] = {};
          result[categoryName][subcategoryName][frameworkName] = framework;
        }
      });

      Object.keys(result).forEach((categoryName) => {
        if (result[categoryName]) {
          Object.keys(result[categoryName]).forEach((subcategoryName) => {
            if (
              Object.keys(result[categoryName][subcategoryName]).length === 0
            ) {
              delete result[categoryName][subcategoryName];
            }
          });
          if (Object.keys(result[categoryName]).length === 0) {
            delete result[categoryName];
          }
        }
      });
    }

    setIsLoading(false);
    return result;
  }, [
    debouncedSearchQuery,
    toolTypeFilter,
    selectedCategory,
    allFrameworksFlattened,
  ]);

  useEffect(() => {
    const subcategoriesToOpen: { [key: string]: boolean } = {};
    const hasActiveFilter = debouncedSearchQuery || toolTypeFilter;

    if (hasActiveFilter) {
      Object.values(filteredFrameworks).forEach((categoryObj) => {
        Object.keys(categoryObj).forEach((subcategoryName) => {
          subcategoriesToOpen[subcategoryName] = true;
        });
      });
    }
    setOpenSubcategories(subcategoriesToOpen);
  }, [
    filteredFrameworks,
    debouncedSearchQuery,
    toolTypeFilter,
    selectedCategory,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedCategory(null);
    setManualOpenSubcategories({});
  };

  const handleToolTypeFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setToolTypeFilter(e.target.value);
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedCategory(null);
    setManualOpenSubcategories({});
  };

  const handleSubcategoryToggle = (subcategoryName: string) => {
    setManualOpenSubcategories((prev) => ({
      ...prev,
      [subcategoryName]: !prev[subcategoryName],
    }));
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedFramework(null);
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setToolTypeFilter("");
  };

  const currentFrameworkDetails = useMemo(() => {
    return selectedFramework
      ? findFrameworkInAllCategories(selectedFramework)
      : null;
  }, [selectedFramework, findFrameworkInAllCategories]);

  return {
    selectedCategory,
    setSelectedCategory,
    selectedFramework,
    setSelectedFramework,
    openSubcategories,
    manualOpenSubcategories,
    searchQuery,
    debouncedSearchQuery,
    toolTypeFilter,
    handleToolTypeFilterChange,
    filteredFrameworks,
    currentFrameworkDetails,
    handleCategorySelect,
    handleFrameworkSelect,
    handleSearchChange,
    handleSubcategoryToggle,
    handleBackToCategories,
    findFrameworkInAllCategories,
    isLoading,
  };
}
