import React from "react";
import { FaChevronDown, FaTachometerAlt } from "react-icons/fa";
import { Card, Button, Collapse, Row, Col } from "react-bootstrap";
import { PromptFrameworksType, CATEGORY_ORDER } from "../data/frameworks";
import SearchBar from "./SearchBar";

interface NavigationPaneProps {
  selectedCategory: string | null;
  searchQuery: string;
  debouncedSearchQuery: string;
  filteredFrameworks: PromptFrameworksType;
  openSubcategories: { [key: string]: boolean };
  manualOpenSubcategories: { [key: string]: boolean };
  handleCategorySelect: (category: string) => void;
  handleBackToCategories: () => void;
  handleFrameworkSelect: (
    frameworkName: string,
    categoryName?: string,
    subcategoryName?: string,
  ) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubcategoryToggle: (subcategoryName: string) => void;
  toolTypeFilter: string;
  handleToolTypeFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isLoading: boolean; // Added isLoading prop
  showInitialMessage: boolean; // Added showInitialMessage prop
  onNavigate: (view: string) => void; // Added onNavigate prop
}

import { categoryCssNameMap } from "../utils/categoryUtils";

const NavigationPane: React.FC<NavigationPaneProps> = ({
  selectedCategory,
  searchQuery,
  debouncedSearchQuery,
  filteredFrameworks,
  openSubcategories,
  manualOpenSubcategories,
  handleCategorySelect,
  // handleBackToCategories,
  handleFrameworkSelect,
  handleSearchChange,
  handleSubcategoryToggle,
  toolTypeFilter,
  handleToolTypeFilterChange,

  isLoading,
  showInitialMessage,
  onNavigate,
}) => {
  const HighlightText = ({
    text,
    highlight,
  }: {
    text: string;
    highlight: string;
  }) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(
      `(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    );
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="search-highlight">
              {part}
            </mark>
          ) : (
            part
          ),
        )}
      </span>
    );
  };
  const frameworkListContent = Object.entries(filteredFrameworks || {})
    .sort((a, b) => a[0].localeCompare(b[0])) // Sort categories alphabetically
    .map(([categoryName, subcategories]) => (
      <div key={categoryName}>
        {(selectedCategory || debouncedSearchQuery || toolTypeFilter) && (
          <h6
            className="h6 py-2 px-3 mt-3 mb-2 rounded category-level-2-header text-white"
            style={{
              background: `var(--${categoryCssNameMap[categoryName]}-static)`,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {categoryName}
          </h6>
        )}
        {Object.entries(subcategories || {})
          .sort((a, b) => a[0].localeCompare(b[0])) // Sort subcategories alphabetically
          .map(([subcategoryName, frameworks]) => {
            console.log(
              `Subcategory: ${subcategoryName}, openSubcategories: ${
                openSubcategories[subcategoryName]
              }, manualOpenSubcategories: ${
                manualOpenSubcategories[subcategoryName]
              }, frameworks count: ${Object.keys(frameworks || {}).length}`,
            );
            return (
              <div key={subcategoryName}>
                <Button
                  className={`subcategory-header w-100 text-start d-flex justify-content-between align-items-center category-button-dynamic category-level-2 ${categoryCssNameMap[categoryName]}`}
                  onClick={() => handleSubcategoryToggle(subcategoryName)}
                  aria-expanded={
                    openSubcategories[subcategoryName] ||
                    manualOpenSubcategories[subcategoryName]
                  }
                  style={{
                    background: `var(--${categoryCssNameMap[categoryName]}-glow)`,
                    borderColor: `var(--${categoryCssNameMap[categoryName]}-static)`,
                    color: "white", // For dark theme default
                  }}
                >
                  <HighlightText
                    text={subcategoryName}
                    highlight={debouncedSearchQuery}
                  />{" "}
                  <span
                    className={`subcategory-icon ${
                      openSubcategories[subcategoryName] ||
                      manualOpenSubcategories[subcategoryName]
                        ? "open"
                        : ""
                    }`}
                  >
                    <FaChevronDown />
                  </span>
                </Button>
                <Collapse
                  in={
                    openSubcategories[subcategoryName] ||
                    manualOpenSubcategories[subcategoryName]
                  }
                >
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-2">
                    {Object.keys(frameworks || {}).length > 0 ? (
                      Object.entries(frameworks || {})
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([name, _details]) => (
                          <Button
                            key={name}
                            className={`category-card w-100 text-center p-3 category-button-dynamic framework-text-single-line category-level-3 ${categoryCssNameMap[categoryName]}`}
                            onClick={() =>
                              handleFrameworkSelect(
                                name,
                                categoryName,
                                subcategoryName,
                              )
                            }
                            style={{
                              background: `var(--${categoryCssNameMap[categoryName]}-glow)`,
                              borderColor: `var(--${categoryCssNameMap[categoryName]}-static)`,
                              color: "white", // For dark theme default
                            }}
                          >
                            <strong>
                              📄{" "}
                              <HighlightText
                                text={name}
                                highlight={debouncedSearchQuery}
                              />
                            </strong>
                          </Button>
                        ))
                    ) : (
                      <p className="text-center text-muted mt-3">
                        Tidak ada kerangka kerja di subkategori ini.
                      </p>
                    )}
                  </div>
                </Collapse>
              </div>
            );
          })}
      </div>
    ));

  return (
    <Card className="flex-grow-1 h-100">
      <Card.Body className="d-flex flex-column p-3 text-start">
        <h5 className="h5 pb-3 mb-3 border-bottom">
          1. Pilih Kategori / Cari Kerangka Kerja:
        </h5>
        <Button
          variant="outline-primary"
          onClick={() => onNavigate("dashboard")}
          className="mb-3 w-100"
          aria-label="Dashboard"
        >
          <FaTachometerAlt className="me-2" /> Dashboard
        </Button>
        <Row className="mb-3 g-2">
          {CATEGORY_ORDER.map((categoryName, _index) => (
            <Col xs={12} md={6} key={categoryName}>
              <Button
                onClick={() => handleCategorySelect(categoryName)}
                className={`btn w-100 category-button-dynamic category-level-1 ${
                  categoryCssNameMap[categoryName]
                }${selectedCategory === categoryName ? " active" : ""}`}
                aria-pressed={selectedCategory === categoryName}
                style={{
                  background: `var(--${categoryCssNameMap[categoryName]}-static)`,
                  borderColor: `var(--${categoryCssNameMap[categoryName]}-static)`,
                }}
                title={`Pilih kategori ${categoryName}`}
              >
                {categoryName}
              </Button>
            </Col>
          ))}
        </Row>
        <SearchBar
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          toolTypeFilter={toolTypeFilter}
          handleToolTypeFilterChange={handleToolTypeFilterChange}
        />

        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <div className="d-flex flex-column gap-3 w-100 mt-4 skeleton-container">
              {/* Skeleton for Category Header */}
              <div
                className="skeleton-loading"
                style={{ height: "40px", width: "100%" }}
              ></div>
              {/* Skeleton for Subcategory Button */}
              <div
                className="skeleton-loading"
                style={{ height: "50px", width: "100%" }}
              ></div>
              {/* Skeleton for Framework Items Grid */}
              <div className="row g-2">
                <div className="col-12 col-md-4">
                  <div
                    className="skeleton-loading"
                    style={{ height: "60px", width: "100%" }}
                  ></div>
                </div>
                <div className="col-12 col-md-4">
                  <div
                    className="skeleton-loading"
                    style={{ height: "60px", width: "100%" }}
                  ></div>
                </div>
                <div className="col-12 col-md-4">
                  <div
                    className="skeleton-loading"
                    style={{ height: "60px", width: "100%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="navigation-section flex-grow-1 d-flex flex-column">
            <h5 className="h5 pb-3 mb-3 border-bottom">
              2. Pilih Sub-Kategori & Kerangka Kerja:
            </h5>

            <div className="framework-list flex-grow-1">
              {frameworkListContent.length === 0 &&
              (debouncedSearchQuery || toolTypeFilter) ? (
                <div className="text-center text-muted mt-4">
                  Tidak ada kerangka kerja yang cocok dengan pencarian atau
                  filter Anda.
                </div>
              ) : (
                frameworkListContent
              )}
            </div>
            {showInitialMessage && (
              <div className="text-center text-muted mt-4">
                Pilih kategori di atas untuk melihat kerangka kerja.
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default NavigationPane;
